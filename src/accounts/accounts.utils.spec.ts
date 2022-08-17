import { DataMapper } from '@aws/dynamodb-data-mapper';
import BadgerSDK, { gqlGenT, Network } from '@badger-dao/sdk';

import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { LeaderBoardType } from '../leaderboards/enums/leaderboard-type.enum';
import { UserClaimMetadata } from '../rewards/entities/user-claim-metadata';
import { TEST_ADDR, TEST_CURRENT_BLOCK } from '../test/constants';
import { mockQuery, setupMockChain } from '../test/mocks.utils';
// import { defaultAccount, randomSnapshot } from "../test/tests.utils";
import { getAccounts, getCachedBoost, getLatestMetadata } from './accounts.utils';

describe('accounts.utils', () => {
  const mockBoost = {
    address: TEST_ADDR,
    boost: 1,
    boostRank: 0,
    bveCvxBalance: 0,
    diggBalance: 0,
    leaderboard: `${Network.Ethereum}_${LeaderBoardType.BadgerBoost}`,
    nativeBalance: 0,
    nftBalance: 0,
    nonNativeBalance: 0,
    stakeRatio: 0,
    updatedAt: 0,
  };

  // function testVaultBalance(vaultDefinition: VaultDefinitionModel): gqlGenT.UserSettBalance {
  //   const vaultToken = fullTokenMockMap[vaultDefinition.address];
  //   const depositToken = fullTokenMockMap[vaultDefinition.depositToken];
  //   const toWei = (amt: number) => {
  //     const values = amt * Math.pow(10, vaultToken.decimals);
  //     return values.toString();
  //   };
  //   return {
  //     id: TEST_ADDR,
  //     netDeposit: 4,
  //     netShareDeposit: toWei(4),
  //     grossDeposit: 9,
  //     grossShareDeposit: toWei(9),
  //     grossWithdraw: 5,
  //     grossShareWithdraw: toWei(5),
  //     user: {
  //       id: TEST_ADDR,
  //       settBalances: [],
  //     },
  //     sett: {
  //       id: vaultToken.address,
  //       name: vaultToken.name,
  //       symbol: vaultToken.symbol,
  //       available: 1,
  //       pricePerFullShare: 1034039284374221,
  //       balance: 3,
  //       totalSupply: 5,
  //       netDeposit: 4,
  //       netShareDeposit: toWei(4),
  //       grossDeposit: 9,
  //       grossShareDeposit: toWei(9),
  //       grossWithdraw: 5,
  //       grossShareWithdraw: toWei(5),
  //       decimals: 18,
  //       token: {
  //         id: depositToken.address,
  //         name: depositToken.name,
  //         symbol: depositToken.symbol,
  //         decimals: depositToken.decimals,
  //         totalSupply: 21000000,
  //       },
  //       treeDistributions: [],
  //       harvests: [],
  //       version: VaultVersion.v1_5,
  //       status: VaultStatus.guarded,
  //       isProduction: true,
  //       protocol: Protocol.Badger,
  //       createdAt: 0,
  //       behavior: VaultBehavior.Compounder,
  //       lastUpdatedAt: 0,
  //       releasedAt: 0,
  //     },
  //   };
  // }

  beforeEach(() => {
    jest.spyOn(DataMapper.prototype, 'put').mockImplementation(async (o) => ({
      ...o,
      updatedAt: 0,
    }));
    jest.spyOn(console, 'log').mockImplementation(jest.fn);
    setupMockChain();
  });

  // TODO: re enable this test once more time is allowed for fixing test leaks
  // describe("queryCachedAccount", () => {
  //   describe("no saved account", () => {
  //     it("returns undefined", async () => {
  //       mockQuery([]);
  //       const actual = await queryCachedAccount(TEST_ADDR);
  //       expect(actual).toMatchObject(defaultAccount(TEST_ADDR));
  //     });
  //   });

  //   describe("encounters an errors", () => {
  //     it("returns undefined", async () => {
  //       jest.spyOn(DataMapper.prototype, "query").mockImplementation(() => {
  //         throw new Error();
  //       });
  //       const actual = await queryCachedAccount(TEST_ADDR);
  //       expect(actual).toMatchObject(defaultAccount(TEST_ADDR));
  //     });
  //   });

  //   describe("a saved account", () => {
  //     it("returns the stored account", async () => {
  //       const expected = { address: TEST_ADDR, claimableBalances: [] };
  //       mockQuery([expected]);
  //       const actual = await queryCachedAccount(TEST_ADDR);
  //       expect(actual).toMatchObject(expected);
  //     });
  //   });
  // });

  describe('getAccounts', () => {
    describe('users exist', () => {
      it('returns a list of user accounts', async () => {
        const chain = setupMockChain();
        const mockAccounts = [TOKENS.BADGER, TOKENS.DIGG, TOKENS.WBTC, TOKENS.FTM_GEIST];
        const result: gqlGenT.UsersQuery = {
          users: mockAccounts.map((account) => ({ id: account, settBalances: [] })),
        };
        let responded = false;
        jest.spyOn(Chain.prototype, 'getSdk').mockImplementation(async () => chain.sdk);
        jest.spyOn(chain.sdk.graph, 'loadUsers').mockImplementation(async (_a) => {
          if (responded) {
            return { users: [] };
          }
          responded = true;
          return result;
        });
        const users = await getAccounts(chain);
        expect(users).toMatchObject(mockAccounts);
      });
    });

    describe('users do not exist', () => {
      it('returns an empty list', async () => {
        const chain = setupMockChain();
        jest.spyOn(BadgerSDK.prototype, 'ready');
        jest.spyOn(Chain.prototype, 'getSdk').mockImplementation(async () => chain.sdk);
        jest.spyOn(chain.sdk.graph, 'loadUsers').mockImplementationOnce(async () => ({ users: [] }));
        const nullReturn = await getAccounts(chain);
        expect(nullReturn).toMatchObject([]);
      });
    });
  });

  // TODO: re enable this test once more time is allowed for fixing test leaks
  // describe("toVaultBalance", () => {
  //   it.each([
  //     [undefined, Currency.USD],
  //     [Currency.USD, Currency.USD],
  //     [Currency.ETH, Currency.ETH]
  //   ])("returns vault balance request in %s currency with %s denominated value", async (currency, _toCurrency) => {
  //     const chain = setupMockChain();
  //     const snapshot = randomSnapshot(MOCK_VAULT_DEFINITION);
  //     const cachedVault = await vaultsUtils.defaultVault(chain, MOCK_VAULT_DEFINITION);
  //     cachedVault.balance = snapshot.balance;
  //     cachedVault.pricePerFullShare = snapshot.balance / snapshot.totalSupply;
  //     jest.spyOn(vaultsUtils, "getCachedVault").mockImplementation(async (_c, _v) => cachedVault);
  //     const depositToken = fullTokenMockMap[cachedVault.underlyingToken];
  //     const wbtc = fullTokenMockMap[TOKENS.WBTC];
  //     const weth = fullTokenMockMap[TOKENS.WETH];
  //     const tokenBalances = [mockBalance(wbtc, 1), mockBalance(weth, 20)];
  //     const cached = { vault: MOCK_VAULT_DEFINITION.address, tokenBalances };
  //     mockQuery([cached]);
  //     const mockedBalance = testVaultBalance(MOCK_VAULT_DEFINITION);
  //     const actual = await toVaultBalance(chain, mockedBalance, currency);
  //     expect(actual).toBeTruthy();
  //     expect(actual.name).toEqual(MOCK_VAULT_DEFINITION.name);
  //     expect(actual.symbol).toEqual(depositToken.symbol);
  //     expect(actual.pricePerFullShare).toEqual(snapshot.balance / snapshot.totalSupply);
  //   });
  // });

  describe('getCachedBoost', () => {
    describe('no cached boost', () => {
      it('returns the default boost', async () => {
        const chain = setupMockChain();
        mockQuery([]);
        const result = await getCachedBoost(chain.network, TEST_ADDR);
        expect(result).toMatchObject(mockBoost);
      });
    });
    describe('a previously cached boost', () => {
      it('returns the default boost', async () => {
        const chain = setupMockChain();
        mockBoost.boostRank = 42;
        mockBoost.stakeRatio = 1;
        mockBoost.nativeBalance = 32021;
        mockBoost.nonNativeBalance = 32021;
        mockQuery([mockBoost]);
        const result = await getCachedBoost(chain.network, TEST_ADDR);
        expect(result).toMatchObject(mockBoost);
      });
    });
  });

  describe('getLatestMetadata', () => {
    it('should not create new meta obj if exists', async () => {
      const chain = setupMockChain();
      const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
      const cachedMetadata = Object.assign(new UserClaimMetadata(), {
        startBlock: 100,
        endBlock: 101,
        chainStartBlock: `${chain.network}_123123`,
        chain: chain.network,
        count: 0,
      });
      mockQuery([cachedMetadata]);
      const latestMetadata = await getLatestMetadata(chain);
      expect(latestMetadata).toEqual(cachedMetadata);
      expect(put.mock.calls).toEqual([]);
    });

    it('should create new meta if no meta obj found', async () => {
      const chain = setupMockChain();
      const expected = Object.assign(new UserClaimMetadata(), {
        startBlock: TEST_CURRENT_BLOCK,
        endBlock: TEST_CURRENT_BLOCK + 1,
        chainStartBlock: `${chain.network}_${TEST_CURRENT_BLOCK}`,
        chain: chain.network,
        count: 0,
      });
      mockQuery([]);
      const latestMetadata = await getLatestMetadata(chain);
      expect(latestMetadata).toMatchObject(expected);
    });
  });
});
