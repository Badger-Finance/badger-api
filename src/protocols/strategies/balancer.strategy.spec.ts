import { Erc20, Erc20__factory } from '@badger-dao/sdk';
import { BigNumber, ethers } from 'ethers';
import { mock, MockProxy } from 'jest-mock-extended';

import { CurrentVaultSnapshotModel } from '../../aws/models/current-vault-snapshot.model';
import { Chain } from '../../chains/config/chain.config';
import { TOKENS } from '../../config/tokens.config';
import {
  BalancerVault,
  BalancerVault__factory,
  StablePhantomVault,
  StablePhantomVault__factory,
  WeightedPool,
  WeightedPool__factory,
} from '../../contracts';
import * as balancerGraph from '../../graphql/generated/balancer';
import {
  MOCK_TOKEN,
  MOCK_TOKENS,
  MOCK_VAULT_DEFINITION,
  MOCK_VAULT_SNAPSHOT,
  TEST_ADDR,
  TEST_CURRENT_BLOCK,
  TEST_CURRENT_TIMESTAMP,
  TEST_TOKEN,
} from '../../test/constants';
import { setupMockChain } from '../../test/mocks.utils';
import * as vaultsUtils from '../../vaults/vaults.utils';
import {
  getBalancerPoolTokens,
  getBalancerVaultTokenBalance,
  getBalancerYieldSources,
  getBPTPrice,
  resolveBalancerPoolTokenPrice,
} from './balancer.strategy';

describe('balancer.strategy', () => {
  let chain: Chain;
  let stablePool: MockProxy<StablePhantomVault>;
  let weightedPool: MockProxy<WeightedPool>;

  beforeEach(() => {
    chain = setupMockChain();

    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(balancerGraph, 'getSdk').mockImplementation((_client) => {
      return {
        PoolSnapshots(_v, _r): Promise<balancerGraph.PoolSnapshotsQuery> {
          return Promise.resolve({
            poolSnapshots: [
              {
                id: TEST_TOKEN,
                swapFees: 1500000,
                liquidity: 1000,
                amounts: [],
                timestamp: TEST_CURRENT_TIMESTAMP,
                totalShares: 100,
                swapVolume: 1000,
              },
              {
                id: TEST_TOKEN,
                swapFees: 1600000,
                liquidity: 1000,
                amounts: [],
                timestamp: TEST_CURRENT_TIMESTAMP,
                totalShares: 100,
                swapVolume: 1000,
              },
              {
                id: TEST_TOKEN,
                swapFees: 1700000,
                liquidity: 1000,
                amounts: [],
                timestamp: TEST_CURRENT_TIMESTAMP,
                totalShares: 100,
                swapVolume: 1000,
              },
            ],
          });
        },
      };
    });

    stablePool = mock<StablePhantomVault>();
    jest.spyOn(stablePool, 'getBptIndex').mockImplementation(async () => BigNumber.from(1));
    jest.spyOn(StablePhantomVault__factory, 'connect').mockImplementation(() => stablePool);

    weightedPool = mock<WeightedPool>();
    jest.spyOn(weightedPool, 'getVault').mockImplementation(async () => TEST_ADDR);
    jest.spyOn(weightedPool, 'getPoolId').mockImplementation(async () => TEST_ADDR);
    jest.spyOn(WeightedPool__factory, 'connect').mockImplementation(() => weightedPool);

    const balancerVault = mock<BalancerVault>();
    const poolTokens = <
      [string[], BigNumber[], BigNumber] & {
        tokens: string[];
        balances: BigNumber[];
        lastChangeBlock: BigNumber;
      }
    >{
      tokens: [TOKENS.BB_A_USDT, TOKENS.DIGG, TOKENS.BB_A_USDC, TOKENS.BB_A_DAI],
      balances: [
        ethers.constants.WeiPerEther,
        ethers.constants.WeiPerEther,
        ethers.constants.WeiPerEther,
        ethers.constants.WeiPerEther,
      ],
      lastChangeBlock: BigNumber.from(TEST_CURRENT_BLOCK),
    };
    // throw in digg as the ignored phantom token
    jest.spyOn(balancerVault, 'getPoolTokens').mockImplementation(async () => poolTokens);
    jest.spyOn(BalancerVault__factory, 'connect').mockImplementation(() => balancerVault);
  });

  describe('getBalancerYieldSources', () => {
    it('returns no yield sources if it encounters an error', async () => {
      jest.spyOn(balancerGraph, 'getSdk').mockImplementation((_client) => {
        throw new Error('Expected test error: getSdk');
      });
      const result = await getBalancerYieldSources(MOCK_VAULT_DEFINITION);
      expect(result).toMatchObject([]);
    });

    it('returns no yield sources if not enough data is available', async () => {
      jest.spyOn(balancerGraph, 'getSdk').mockImplementation((_client) => {
        return {
          PoolSnapshots(_v, _r): Promise<balancerGraph.PoolSnapshotsQuery> {
            return Promise.resolve({
              poolSnapshots: [],
            });
          },
        };
      });
      const result = await getBalancerYieldSources(MOCK_VAULT_DEFINITION);
      expect(result).toMatchObject([]);
    });

    it('returns fee data for the requested pool', async () => {
      const result = await getBalancerYieldSources(MOCK_VAULT_DEFINITION);
      expect(result).toMatchSnapshot();
    });
  });

  describe('getBalancerPoolTokens', () => {
    it('returns all relevant pool tokens', async () => {
      const result = await getBalancerPoolTokens(chain, TOKENS.BPT_BB_AAVE_USD);
      expect(result).toMatchSnapshot();
    });
  });

  describe('getBPTPrice', () => {
    it('calculates price for the phantom pool', async () => {
      jest.spyOn(stablePool, 'getVirtualSupply').mockImplementation(async () => ethers.constants.WeiPerEther);
      const result = await getBPTPrice(chain, TEST_TOKEN);
      expect(result).toMatchSnapshot();
    });

    it('calculates price for the weighted pool', async () => {
      jest.spyOn(stablePool, 'getVirtualSupply').mockImplementation(async () => {
        throw new Error('Expected test error: getVirtualSupply');
      });
      const erc20 = mock<Erc20>();
      jest.spyOn(erc20, 'totalSupply').mockImplementation(async () => ethers.constants.WeiPerEther);
      jest.spyOn(Erc20__factory, 'connect').mockImplementation(() => erc20);
      const result = await getBPTPrice(chain, TEST_TOKEN);
      expect(result).toMatchSnapshot();
    });
  });

  describe('getBalancerVaultTokenBalance', () => {
    beforeEach(() => {
      jest
        .spyOn(vaultsUtils, 'getCachedVault')
        .mockImplementation(async (_c, _v) => MOCK_VAULT_SNAPSHOT as CurrentVaultSnapshotModel);
    });

    it('returns vault tokens for a stable pool', async () => {
      jest.spyOn(stablePool, 'getVirtualSupply').mockImplementation(async () => ethers.constants.WeiPerEther);
      const result = await getBalancerVaultTokenBalance(chain, TEST_TOKEN);
      expect(result).toMatchSnapshot();
    });

    it('returns vault tokens for a weighted pool', async () => {
      jest.spyOn(stablePool, 'getVirtualSupply').mockImplementation(async () => {
        throw new Error('Expected test error: getVirtualSupply');
      });
      const erc20 = mock<Erc20>();
      jest.spyOn(erc20, 'totalSupply').mockImplementation(async () => ethers.constants.WeiPerEther);
      jest.spyOn(Erc20__factory, 'connect').mockImplementation(() => erc20);
      const result = await getBalancerVaultTokenBalance(chain, TEST_TOKEN);
      expect(result).toMatchSnapshot();
    });
  });

  describe('resolveBalancerPoolTokenPrice', () => {
    it('returns zero price when encountering errors', async () => {
      jest.spyOn(weightedPool, 'getNormalizedWeights').mockImplementation(async () => {
        throw new Error('Expected test error: getNormalizedWeights');
      });
      const { price } = await resolveBalancerPoolTokenPrice(chain, MOCK_TOKEN, TEST_ADDR);
      expect(price).toEqual(0);
    });

    it('returns zero price for missing requested token', async () => {
      jest
        .spyOn(weightedPool, 'getNormalizedWeights')
        .mockImplementation(async () => [
          ethers.constants.WeiPerEther.mul(30),
          ethers.constants.WeiPerEther.mul(40),
          ethers.constants.WeiPerEther.mul(30),
        ]);
      const { price } = await resolveBalancerPoolTokenPrice(chain, MOCK_TOKEN, TEST_ADDR);
      expect(price).toEqual(0);
    });

    it('returns the price of a token in a weighted pool', async () => {
      jest
        .spyOn(weightedPool, 'getNormalizedWeights')
        .mockImplementation(async () => [
          ethers.constants.WeiPerEther.mul(30),
          ethers.constants.WeiPerEther.mul(40),
          ethers.constants.WeiPerEther.mul(30),
        ]);
      const token = MOCK_TOKENS[TOKENS.BB_A_USDT];
      const result = await resolveBalancerPoolTokenPrice(chain, token, TEST_ADDR);
      expect(result).toMatchSnapshot();
    });

    it('returns the price of a token in a stable pool', async () => {
      jest.spyOn(weightedPool, 'getNormalizedWeights').mockImplementation(async () => {
        throw new Error('Expected test error: getNormalizedWeights');
      });
      const amplificationData = <
        [BigNumber, boolean, BigNumber] & {
          value: BigNumber;
          isUpdating: boolean;
          precision: BigNumber;
        }
      >{
        value: ethers.constants.WeiPerEther,
        isUpdating: false,
        precision: BigNumber.from('1000000'),
      };
      jest.spyOn(stablePool, 'getAmplificationParameter').mockImplementation(async () => amplificationData);
      const invariantData = <
        [BigNumber, BigNumber] & {
          lastInvariant: BigNumber;
          lastInvariantAmp: BigNumber;
        }
      >{
        lastInvariant: ethers.constants.WeiPerEther,
        lastInvariantAmp: BigNumber.from('1000000'),
      };
      jest.spyOn(stablePool, 'getLastInvariant').mockImplementation(async () => invariantData);

      const balancerVault = mock<BalancerVault>();
      const poolTokens = <
        [string[], BigNumber[], BigNumber] & {
          tokens: string[];
          balances: BigNumber[];
          lastChangeBlock: BigNumber;
        }
      >{
        tokens: [TOKENS.BB_A_USDT, TOKENS.BB_A_USDC],
        balances: [ethers.constants.WeiPerEther, ethers.constants.WeiPerEther],
        lastChangeBlock: BigNumber.from(TEST_CURRENT_BLOCK),
      };
      // throw in digg as the ignored phantom token
      jest.spyOn(balancerVault, 'getPoolTokens').mockImplementation(async () => poolTokens);
      jest.spyOn(BalancerVault__factory, 'connect').mockImplementation(() => balancerVault);

      const token = MOCK_TOKENS[TOKENS.BB_A_USDT];
      const result = await resolveBalancerPoolTokenPrice(chain, token, TEST_ADDR);
      expect(result).toMatchSnapshot();
    });
  });
});
