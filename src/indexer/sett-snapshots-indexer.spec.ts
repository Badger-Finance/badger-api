import { TransactWriteItemsInput } from 'aws-sdk/clients/dynamodb';
import * as dynamodbUtils from '../aws/dynamodb-utils';
import { bscSetts } from '../chains/config/bsc.config';
import { ethSetts } from '../chains/config/eth.config';
import { BscStrategy } from '../chains/strategies/bsc.strategy';
import { EthStrategy } from '../chains/strategies/eth.strategy';
import { SettQuery } from '../graphql/generated/badger';
import * as settUtils from '../setts/setts-util';
import { refreshSettSnapshots } from './sett-snapshots-indexer';

describe('refreshSettSnapshots', () => {
  const supportedAddresses = [...bscSetts, ...ethSetts].map((settDefinition) => settDefinition.settToken).sort();

  let getSettMock: jest.SpyInstance<
    Promise<SettQuery>,
    [graphUrl: string, contract: string, block?: number | undefined]
  >;
  let transactWrite: jest.SpyInstance<Promise<void>, [input: TransactWriteItemsInput]>;

  beforeEach(async () => {
    getSettMock = jest.spyOn(settUtils, 'getSett').mockImplementation(async (_graphUrl: string, _contract: string) => ({
      sett: {
        id: 'sett_123',
        balance: 0,
        token: {
          id: '0xdead',
          decimals: 18,
        },
        netDeposit: 0,
        netShareDeposit: 0,
        pricePerFullShare: 1,
        totalSupply: 10,
      },
    }));

    transactWrite = jest.spyOn(dynamodbUtils, 'transactWrite').mockImplementation();

    const mockTokenPrice = { name: 'mock', usd: 10, eth: 0, address: '0xbeef' };
    jest.spyOn(BscStrategy.prototype, 'getPrice').mockImplementation(async (_address: string) => mockTokenPrice);
    jest.spyOn(EthStrategy.prototype, 'getPrice').mockImplementation(async (_address: string) => mockTokenPrice);

    await refreshSettSnapshots();
  });

  it('fetches Setts for ETH and BSC tokens', async () => {
    const requestedAddresses = getSettMock.mock.calls.map((calls) => calls[1]);
    expect(requestedAddresses.sort()).toEqual(supportedAddresses);
  });

  it('saves Setts in Dynamo', () => {
    const requestedAddresses = [];
    // Verify each saved object.
    for (const input of transactWrite.mock.calls) {
      const { TransactItems: transactItems } = input[0];
      for (const transactItem of transactItems) {
        expect(transactItem.Update).toBeDefined();

        const attributeValues = transactItem.Update?.ExpressionAttributeValues;
        expect(attributeValues).toBeDefined();

        expect(attributeValues).toMatchObject({
          ':balance': { N: expect.any(String) },
          ':supply': { N: expect.any(String) },
          ':ratio': { N: expect.any(String) },
          ':settValue': { N: expect.any(String) },
          ':updatedAt': { N: expect.any(String) },
        });

        const key = transactItem.Update?.Key;
        expect(key).toBeDefined();
        expect(key).toMatchObject({
          address: { S: expect.any(String) },
        });

        requestedAddresses.push(key?.address.S);
      }
    }
    // Verify addresses match supported setts.
    expect(requestedAddresses.sort()).toEqual(supportedAddresses);
  });
});
