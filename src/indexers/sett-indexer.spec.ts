import { DataMapper } from '@aws/dynamodb-data-mapper';
import { indexProtocolSetts } from './sett-indexer';
import * as indexerUtils from './indexer.utils';
import { VaultSnapshot } from '../vaults/interfaces/vault-snapshot.interface';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';

describe('sett-indexer', () => {
  const originalEnv = process.env;
  const chains = loadChains();
  let indexedBlock: jest.SpyInstance<
    Promise<number>,
    [VaultDefinition: VaultDefinition, startBlock: number, alignment: number]
  >;
  let settToSnapshot: jest.SpyInstance<
    Promise<VaultSnapshot | null>,
    [chain: Chain, VaultDefinition: VaultDefinition, block: number]
  >;
  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      IS_OFFLINE: 'false',
    };
    indexedBlock = jest.spyOn(indexerUtils, 'getIndexedBlock').mockImplementation(async () => Promise.resolve(100));
    settToSnapshot = jest.spyOn(indexerUtils, 'settToSnapshot').mockImplementation(async () =>
      Promise.resolve(
        Object.assign(new VaultSnapshot(), {
          address: '0x12d8E12e981be773cb777Be342a528285b3c7661',
          height: 100,
          timestamp: 123123123123,
          balance: 180000000000000000,
          supply: 18000000000000000000,
          ratio: 12,
          value: 1000,
        }),
      ),
    );
    // Always throw because we need to exit infinite loop
    jest.spyOn(DataMapper.prototype, 'put').mockImplementation(() => {
      throw new Error();
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });
  describe('indexProtocolSetts', () => {
    it('should call update price for all tokens', async () => {
      await indexProtocolSetts();
      let settCount = 0;
      chains.forEach((chain) => {
        chain.setts.forEach((sett) => {
          settCount++;
        });
      });
      expect(indexedBlock.mock.calls.length).toEqual(settCount);
      expect(settToSnapshot.mock.calls.length).toEqual(settCount);
    });
  });
});
