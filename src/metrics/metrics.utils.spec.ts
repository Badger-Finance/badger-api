import * as accountsUtils from '../accounts/accounts.utils';
import * as dynamoDbUtils from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { MOCK_PROTOCOL_METRICS, MOCK_VAULT, TEST_ADDR, TEST_TOKEN } from '../test/constants';
import { mockQuery, setupMockChain } from '../test/mocks.utils';
import * as vaultsUtils from '../vaults/vaults.utils';
import { getChainMetrics, queryProtocolMetrics } from './metrics.utils';

describe('metrics.utils', () => {
  let chain: Chain;

  beforeEach(() => {
    chain = setupMockChain();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(accountsUtils, 'getAccounts').mockImplementation(async (_c) => [TEST_ADDR, TEST_TOKEN]);
    jest.spyOn(vaultsUtils, 'getCachedVault').mockImplementation(async () => MOCK_VAULT);
  });

  describe('getChainMetrics', () => {
    it('returns total users, value, and vaults for all requested chains', async () => {
      const metrics = await getChainMetrics([chain]);
      expect(metrics).toMatchSnapshot();
    });
  });

  describe('queryProtocolMetrics', () => {
    describe('encounters an error', () => {
      it('throws a not found error', async () => {
        jest.spyOn(dynamoDbUtils, 'getDataMapper').mockImplementationOnce(() => {
          throw new Error('Expected test error: queryProtocolMetrics error');
        });
        await expect(queryProtocolMetrics()).rejects.toThrow('Protocol metrics not available');
      });
    });

    describe('no metrics exist', () => {
      it('throws a not found error', async () => {
        mockQuery([]);
        await expect(queryProtocolMetrics()).rejects.toThrow('Protocol metrics not available');
      });
    });

    describe('system has saved data', () => {
      it('returns the cached yield projection', async () => {
        mockQuery([MOCK_PROTOCOL_METRICS]);
        const result = await queryProtocolMetrics();
        expect(result).toMatchObject(MOCK_PROTOCOL_METRICS);
      });
    });
  });
});
