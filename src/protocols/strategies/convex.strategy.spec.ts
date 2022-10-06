import {
  CurveBaseRegistry,
  CurveBaseRegistry__factory,
  CurveRegistry,
  CurveRegistry__factory,
  Erc20,
  Erc20__factory,
  Network,
  TokenValue,
} from '@badger-dao/sdk';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { mock, MockProxy } from 'jest-mock-extended';

import { Vaultish } from '../../aws/interfaces/vaultish.interface';
import { CurrentVaultSnapshotModel } from '../../aws/models/current-vault-snapshot.model';
import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { Chain } from '../../chains/config/chain.config';
import * as requestUtils from '../../common/request';
import { TOKENS } from '../../config/tokens.config';
import { CurvePool, CurvePool__factory, CurvePool3, CurvePool3__factory } from '../../contracts';
import { PromiseOrValue } from '../../contracts/common';
import { MOCK_TOKENS, MOCK_VAULT_DEFINITION, MOCK_VAULT_SNAPSHOT, TEST_ADDR, TEST_TOKEN } from '../../test/constants';
import { mockBalance, setupMockChain } from '../../test/mocks.utils';
import { setupTestVault } from '../../test/mocks.utils/mock.api.chain';
import * as tokensUtils from '../../tokens/tokens.utils';
import * as vaultsUtils from '../../vaults/vaults.utils';
import {
  getCurvePerformance,
  getCurvePoolBalance,
  getCurveTokenPrice,
  getCurveVaultTokenBalance,
  getCurveYieldSources,
  resolveCurvePoolTokenPrice,
  resolveCurveStablePoolTokenPrice,
} from './convex.strategy';

describe('convex.strategy', () => {
  let chain: Chain;
  let baseRegistry: MockProxy<CurveBaseRegistry>;
  let registry: MockProxy<CurveRegistry>;
  let curvePool3: MockProxy<CurvePool3>;
  let curvePool: MockProxy<CurvePool>;

  function setupBadPoolSize() {
    async function bad_coins(index: PromiseOrValue<BigNumberish>): Promise<string> {
      switch (index) {
        case 0:
          return TOKENS.WBTC;
        case 1:
          return TOKENS.DIGG;
        case 2:
          return TOKENS.BADGER;
        default:
          throw new Error('Expected test error: coins');
      }
    }
    jest.spyOn(curvePool3, 'coins').mockImplementation(bad_coins);
    jest.spyOn(curvePool, 'coins').mockImplementation(bad_coins);

    async function bad_balances(index: PromiseOrValue<BigNumberish>): Promise<BigNumber> {
      switch (index) {
        case 0:
          return ethers.constants.WeiPerEther;
        case 1:
          return ethers.constants.WeiPerEther;
        case 2:
          return ethers.constants.WeiPerEther.mul(5000);
        default:
          throw new Error('Expected test error: balances');
      }
    }
    jest.spyOn(curvePool3, 'balances').mockImplementation(bad_balances);
    jest.spyOn(curvePool, 'balances').mockImplementation(bad_balances);
  }

  beforeEach(() => {
    chain = setupMockChain();
    baseRegistry = mock<CurveBaseRegistry>();
    registry = mock<CurveRegistry>();
    curvePool3 = mock<CurvePool3>();
    curvePool = mock<CurvePool>();

    jest.spyOn(baseRegistry, 'get_registry').mockImplementation(async () => TEST_ADDR);
    jest.spyOn(CurveBaseRegistry__factory, 'connect').mockImplementation(() => baseRegistry);

    jest.spyOn(registry, 'get_pool_from_lp_token').mockImplementation(async () => TEST_ADDR);
    jest.spyOn(CurveRegistry__factory, 'connect').mockImplementation(() => registry);

    async function coins(index: PromiseOrValue<BigNumberish>): Promise<string> {
      switch (index) {
        case 0:
          return TOKENS.WBTC;
        case 1:
          return TOKENS.BADGER;
        default:
          throw new Error('Expected test error: coins');
      }
    }
    jest.spyOn(curvePool3, 'coins').mockImplementation(coins);
    jest.spyOn(curvePool, 'coins').mockImplementation(coins);

    async function balances(index: PromiseOrValue<BigNumberish>): Promise<BigNumber> {
      switch (index) {
        case 0:
          return ethers.constants.WeiPerEther;
        case 1:
          return ethers.constants.WeiPerEther.mul(5000);
        default:
          throw new Error('Expected test error: balances');
      }
    }
    jest.spyOn(curvePool3, 'balances').mockImplementation(balances);
    jest.spyOn(curvePool, 'balances').mockImplementation(balances);

    jest.spyOn(curvePool3, 'price_oracle').mockImplementation(async () => BigNumber.from('963845856610322279'));

    jest.spyOn(CurvePool3__factory, 'connect').mockImplementation(() => curvePool3);
    jest.spyOn(CurvePool__factory, 'connect').mockImplementation(() => curvePool);

    const erc20 = mock<Erc20>();
    jest.spyOn(erc20, 'totalSupply').mockImplementation(async () => ethers.constants.WeiPerEther);
    jest.spyOn(Erc20__factory, 'connect').mockImplementation(() => erc20);

    jest
      .spyOn(vaultsUtils, 'getCachedVault')
      .mockImplementation(async (_c, _v) => MOCK_VAULT_SNAPSHOT as CurrentVaultSnapshotModel);

    jest.spyOn(requestUtils, 'request').mockImplementation(async () => ({
      apy: {
        month: {
          tricrypto2: 0.1,
        },
        day: {
          tricrypto2: 0.04,
        },
        week: {
          tricrypto2: 0.2,
        },
      },
    }));

    jest.spyOn(tokensUtils, 'getFullToken').mockImplementation(async (_, token) => MOCK_TOKENS[token]);
  });

  describe('getCurveYieldSources', () => {
    it('returns no sources for bvecvx', async () => {
      const bveCVXDefinition = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
      bveCVXDefinition.address = TOKENS.BVECVX;
      const result = await getCurveYieldSources(chain, bveCVXDefinition);
      expect(result).toMatchObject([]);
    });

    it('returns trade fees for standard vaults', async () => {
      const tricryptoDefinition = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
      tricryptoDefinition.depositToken = TOKENS.CRV_TRICRYPTO2;
      const result = await getCurveYieldSources(chain, tricryptoDefinition);
      expect(result).toMatchSnapshot();
    });

    it('returns derived data for liquidity pool vault', async () => {
      setupTestVault();

      jest
        .spyOn(tokensUtils, 'getVaultTokens')
        .mockImplementation(async (_chain: Chain, _vault: Vaultish, _currency?: string): Promise<TokenValue[]> => {
          const token0 = MOCK_TOKENS[TOKENS.CVX];
          const token1 = MOCK_TOKENS[TOKENS.BVECVX];
          return [mockBalance(token0, 15), mockBalance(token1, 16)];
        });
      let calls = 0;
      jest.spyOn(requestUtils, 'request').mockImplementation(async () => {
        if (calls <= 1) {
          calls++;
          return {
            apy: { week: {} },
          };
        }
        return {
          data: {
            poolDetails: [
              {
                apy: 1.2,
                poolAddress: TOKENS.BCRV_CVXBVECVX,
              },
            ],
          },
        };
      });
      const liquidityDefinition = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
      liquidityDefinition.address = TOKENS.BCRV_CVXBVECVX;
      const result = await getCurveYieldSources(chain, liquidityDefinition);
      expect(result).toMatchSnapshot();
    });
  });

  describe('getCurvePoolBalance', () => {
    it('returns curve pool underlying pool', async () => {
      const result = await getCurvePoolBalance(chain, TEST_TOKEN);
      expect(result).toMatchSnapshot();
    });

    it('falls back to pool definitions for pools missing from the registry', async () => {
      jest.spyOn(registry, 'get_pool_from_lp_token').mockImplementation(async () => ethers.constants.AddressZero);
      const result = await getCurvePoolBalance(chain, TOKENS.CVXFXS);
      expect(result).toMatchSnapshot();
    });

    it('falls back to older pool abi when new pools fail', async () => {
      jest.spyOn(curvePool3, 'coins').mockImplementation(async () => {
        throw new Error('Expected test error: coins');
      });
      const result = await getCurvePoolBalance(chain, TEST_TOKEN);
      expect(result).toMatchSnapshot();
    });

    it('returns no tokens if all abi fail', async () => {
      jest.spyOn(curvePool3, 'coins').mockImplementation(async () => {
        throw new Error('Expected test error: coins');
      });
      jest.spyOn(curvePool, 'coins').mockImplementation(async () => {
        throw new Error('Expected test error: coins');
      });
      const result = await getCurvePoolBalance(chain, TEST_TOKEN);
      expect(result).toMatchObject([]);
    });
  });

  describe('getCurveVaultTokenBalance', () => {
    it('returns vault tokens built on a curve pool', async () => {
      const result = await getCurveVaultTokenBalance(chain, MOCK_VAULT_DEFINITION);
      expect(result).toMatchSnapshot();
    });
  });

  describe('getCurveTokenPrice', () => {
    it('returns the price of a curve pool token', async () => {
      const result = await getCurveTokenPrice(chain, TEST_TOKEN);
      expect(result).toMatchSnapshot();
    });
  });

  describe('resolveCurvePoolTokenPrice', () => {
    it('throws an error for wrong pool size', async () => {
      setupBadPoolSize();
      await expect(resolveCurvePoolTokenPrice(chain, MOCK_TOKENS[TOKENS.DIGG])).rejects.toThrow(
        'Pool has unexpected number of tokens!',
      );
    });

    it('resolves the requested token0 price based off paired token price', async () => {
      const result = await resolveCurvePoolTokenPrice(chain, MOCK_TOKENS[TOKENS.WBTC]);
      expect(result).toMatchSnapshot();
    });

    it('resolves the requested token1 price based off paired token price', async () => {
      const result = await resolveCurvePoolTokenPrice(chain, MOCK_TOKENS[TOKENS.BADGER]);
      expect(result).toMatchSnapshot();
    });
  });

  describe('resolveCurveStablePoolTokenPrice', () => {
    it('throws an error for wrong pool size', async () => {
      setupBadPoolSize();
      await expect(resolveCurveStablePoolTokenPrice(chain, MOCK_TOKENS[TOKENS.CVXFXS])).rejects.toThrow(
        'Pool has unexpected number of tokens!',
      );
    });

    it('returns price derived from pool price oracle', async () => {
      const result = await resolveCurveStablePoolTokenPrice(chain, MOCK_TOKENS[TOKENS.CVXFXS]);
      expect(result).toMatchSnapshot();
    });

    it('returns price of zero when encounters pool price oracle error', async () => {
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(curvePool3, 'price_oracle').mockImplementation(async () => {
        throw new Error('Expected test error: price_oracle');
      });
      const { price } = await resolveCurveStablePoolTokenPrice(chain, MOCK_TOKENS[TOKENS.CVXFXS]);
      expect(price).toEqual(0);
    });
  });

  describe('getCurvePerformance', () => {
    let tricryptoDefinition: VaultDefinitionModel;

    beforeEach(() => {
      tricryptoDefinition = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
      tricryptoDefinition.depositToken = TOKENS.CRV_TRICRYPTO2;
    });

    it.each([[Network.Arbitrum], [Network.Polygon], [Network.Ethereum]])(
      'requests trade fees from the curve api on %s',
      async (network) => {
        chain = setupMockChain({ network });
        const result = await getCurvePerformance(chain, tricryptoDefinition);
        expect(result).toMatchSnapshot();
      },
    );

    it('utilizes crypto api fallback option if required', async () => {
      let calls = 0;
      jest.spyOn(requestUtils, 'request').mockImplementation(async () => {
        if (calls === 0) {
          calls++;
          return {
            apy: { week: {} },
          };
        }
        return {
          apy: {
            month: {
              tricrypto2: 0.01,
            },
            day: {
              tricrypto2: 0.4,
            },
            week: {
              tricrypto2: 0.02,
            },
          },
        };
      });
    });

    it('utilizes factory 2 api fallback option if required', async () => {
      let calls = 0;
      jest.spyOn(requestUtils, 'request').mockImplementation(async () => {
        if (calls <= 1) {
          calls++;
          return {
            apy: { week: {} },
          };
        }
        return {
          data: {
            poolDetails: [
              {
                apy: 1.2,
                poolAddress: TOKENS.CRV_TRICRYPTO2,
              },
            ],
          },
        };
      });
      const result = await getCurvePerformance(chain, tricryptoDefinition);
      expect(result).toMatchSnapshot();
    });

    it('utilizes crypto factory api fallback option if required', async () => {
      let calls = 0;
      jest.spyOn(requestUtils, 'request').mockImplementation(async () => {
        if (calls <= 1) {
          calls++;
          return {
            apy: { week: {} },
          };
        }
        if (calls <= 2) {
          calls++;
          return {
            data: {
              poolDetails: [],
            },
          };
        }
        return {
          data: {
            poolDetails: [
              {
                apy: 1.2,
                poolAddress: TOKENS.CRV_TRICRYPTO2,
              },
            ],
          },
        };
      });
      const result = await getCurvePerformance(chain, tricryptoDefinition);
      expect(result).toMatchSnapshot();
    });
  });
});
