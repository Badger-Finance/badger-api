import { UniV2, UniV2__factory } from '@badger-dao/sdk';
import { NotFound } from '@tsed/exceptions';
import { BigNumber, ethers } from 'ethers';
import { mock, MockProxy } from 'jest-mock-extended';

import { CurrentVaultSnapshotModel } from '../../aws/models/current-vault-snapshot.model';
import { Chain } from '../../chains/config/chain.config';
import { TOKENS } from '../../config/tokens.config';
import * as uniswapGraph from '../../graphql/generated/uniswap';
import * as pricesUtils from '../../prices/prices.utils';
import { MOCK_VAULT_DEFINITION, MOCK_VAULT_SNAPSHOT, TEST_ADDR, TEST_TOKEN } from '../../test/constants';
import { setupMockChain } from '../../test/mocks.utils';
import { mockPrice } from '../../test/mocks.utils/mock.helpers';
import { fullTokenMockMap } from '../../tokens/mocks/full-token.mock';
import * as vaultsUtils from '../../vaults/vaults.utils';
import { getSwaprYieldSources } from './swapr.strategy';
import {
  getLpTokenBalances,
  getOnChainLiquidityPrice,
  getUniswapV2YieldSources,
  resolveTokenPrice,
} from './uniswap.strategy';

describe('uniswap.strategy', () => {
  let chain: Chain;
  let pairContractMock: MockProxy<UniV2>;

  beforeEach(() => {
    chain = setupMockChain();
    pairContractMock = mock<UniV2>();

    jest.spyOn(UniV2__factory, 'connect').mockImplementation(() => pairContractMock);

    jest.spyOn(pairContractMock, 'totalSupply').mockImplementation(async () => ethers.constants.WeiPerEther);
    jest.spyOn(pairContractMock, 'token0').mockImplementation(async () => fullTokenMockMap[TOKENS.BADGER].address);
    jest.spyOn(pairContractMock, 'token1').mockImplementation(async () => fullTokenMockMap[TOKENS.WBTC].address);

    jest
      .spyOn(pairContractMock, 'getReserves')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .mockImplementation(async () => ({ _reserve0: BigNumber.from(1000), _reserve1: BigNumber.from(20) }));

    jest
      .spyOn(vaultsUtils, 'getCachedVault')
      .mockImplementation(async (_c, _v) => MOCK_VAULT_SNAPSHOT as CurrentVaultSnapshotModel);
  });

  describe('getLpTokenBalances', () => {
    it('should return token balances of the vault', async () => {
      const lpTokenBalances = await getLpTokenBalances(chain, MOCK_VAULT_DEFINITION);
      expect(lpTokenBalances).toMatchSnapshot();
    });

    it('should throw NotFound in case of error', async () => {
      jest.spyOn(vaultsUtils, 'getCachedVault').mockImplementation(async (_c, _v) => {
        throw new Error();
      });
      await expect(getLpTokenBalances(chain, MOCK_VAULT_DEFINITION)).rejects.toThrow(NotFound);
    });
  });

  describe('getOnChainLiquidityPrice', () => {
    it('resolves no supply token as price zero', async () => {
      jest.spyOn(pairContractMock, 'totalSupply').mockImplementation(async () => ethers.constants.Zero);
      const { price } = await getOnChainLiquidityPrice(chain, TEST_TOKEN);
      expect(price).toEqual(0);
    });

    it('throws an error given neither pool token is priced', async () => {
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(pricesUtils, 'queryPrice').mockImplementation(async (address) => ({ price: 0, address }));
      await expect(getOnChainLiquidityPrice(chain, TEST_TOKEN)).rejects.toThrow(
        `Unable to price pool, or not found for ${TEST_TOKEN}`,
      );
    });

    it('throws an error given no such pool exists', async () => {
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(pairContractMock, 'totalSupply').mockImplementation(async () => {
        throw new Error('Expected test error: totalSupply');
      });
      await expect(getOnChainLiquidityPrice(chain, TEST_TOKEN)).rejects.toThrow(
        `Unable to price pool, or not found for ${TEST_TOKEN}`,
      );
    });

    it('resolves missing token price based on a known token0 price', async () => {
      let calls = 0;
      jest.spyOn(pricesUtils, 'queryPrice').mockImplementation(async (address) => {
        if (calls === 0) {
          calls++;
          return mockPrice(address);
        } else {
          return { price: 0, address };
        }
      });
      const result = await getOnChainLiquidityPrice(chain, TEST_TOKEN);
      expect(result).toMatchSnapshot();
    });

    it('resolves missing token price based on a known token1 price', async () => {
      let calls = 0;
      jest.spyOn(pricesUtils, 'queryPrice').mockImplementation(async (address) => {
        if (calls === 0) {
          calls++;
          return { price: 0, address };
        } else {
          return mockPrice(address);
        }
      });
      const result = await getOnChainLiquidityPrice(chain, TEST_TOKEN);
      expect(result).toMatchSnapshot();
    });
  });

  describe('resolveTokenPrice', () => {
    it('throws an error given no known token price', async () => {
      jest.spyOn(pricesUtils, 'queryPrice').mockImplementation(async (address) => ({ price: 0, address }));
      await expect(resolveTokenPrice(chain, TEST_TOKEN, TEST_ADDR)).rejects.toThrow('Token Badger cannot be priced');
    });

    it('scales unknown token price by the known token price based on uniswap invariants', async () => {
      const result = await resolveTokenPrice(chain, TEST_TOKEN, TEST_ADDR);
      expect(result).toMatchSnapshot();
    });
  });

  describe('getUniswapV2YieldSources', () => {
    it('returns no value sources given no trade data in the subgraph', async () => {
      jest.spyOn(uniswapGraph, 'getSdk').mockImplementation((_client) => {
        return {
          UniPairDayDatas(_v, _r): Promise<uniswapGraph.UniPairDayDatasQuery> {
            return Promise.resolve({ pairDayDatas: [] });
          },
          UniV2Pair(_v, _r): Promise<uniswapGraph.UniV2PairQuery> {
            return Promise.resolve({});
          },
        };
      });
      const result = await getUniswapV2YieldSources(MOCK_VAULT_DEFINITION);
      expect(result).toMatchObject([]);
      const swaprResult = await getSwaprYieldSources(MOCK_VAULT_DEFINITION);
      expect(swaprResult).toMatchObject(result);
    });

    it('returns trade fees for the pair given trade data in the subgraph', async () => {
      jest.spyOn(uniswapGraph, 'getSdk').mockImplementation((_client) => {
        return {
          UniPairDayDatas(_v, _r): Promise<uniswapGraph.UniPairDayDatasQuery> {
            return Promise.resolve({
              pairDayDatas: [
                {
                  token0: {
                    id: TOKENS.BADGER,
                  },
                  token1: {
                    id: TOKENS.WBTC,
                  },
                  reserve0: 5000,
                  reserve1: 1,
                  reserveUSD: 40000,
                  dailyVolumeToken0: 1000000,
                  dailyVolumeToken1: 2000000,
                },
              ],
            });
          },
          UniV2Pair(_v, _r): Promise<uniswapGraph.UniV2PairQuery> {
            return Promise.resolve({});
          },
        };
      });
      const result = await getUniswapV2YieldSources(MOCK_VAULT_DEFINITION);
      expect(result).toMatchSnapshot();
      const swaprResult = await getSwaprYieldSources(MOCK_VAULT_DEFINITION);
      expect(swaprResult).toMatchObject(result);
    });
  });
});
