import { DataMapper } from '@aws/dynamodb-data-mapper';
import { GraphQLClient } from 'graphql-request';
import { Ethereum } from '../chains/config/eth.config';
import { TestStrategy } from '../chains/strategies/test.strategy';
import { TOKENS } from '../config/tokens.config';
import { UserQuery, UserSettBalance, UsersQuery } from '../graphql/generated/badger';
import * as priceUtils from '../prices/prices.utils';
import { inCurrency } from '../prices/prices.utils';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { getSettDefinition } from '../setts/setts.utils';
import { randomSnapshot, setupMapper, TEST_ADDR } from '../test/tests.utils';
import { getToken } from '../tokens/tokens.utils';
import { getAccounts, getCachedAccount, getUserAccount, toSettBalance } from './accounts.utils';

describe('accounts.utils', () => {
  const defaultAccount = (address: string) => ({
    address,
    boost: 0,
    boostRank: 0,
    multipliers: [],
    value: 0,
    earnedValue: 0,
    balances: [],
    claimableBalances: [],
    nativeBalance: 0,
    nonNativeBalance: 0,
  });

  const testSettBalance = (sett: SettDefinition): UserSettBalance => {
    const settToken = getToken(sett.settToken);
    const depositToken = getToken(sett.depositToken);
    const toWei = (amt: number) => {
      const values = amt * Math.pow(10, settToken.decimals);
      return values.toString();
    };
    return {
      id: TEST_ADDR,
      netDeposit: 4,
      netShareDeposit: toWei(4),
      grossDeposit: 9,
      grossShareDeposit: toWei(9),
      grossWithdraw: 5,
      grossShareWithdraw: toWei(5),
      user: {
        id: TEST_ADDR,
        settBalances: [],
      },
      sett: {
        id: settToken.address,
        name: settToken.name,
        symbol: settToken.symbol,
        pricePerFullShare: 1034039284374221,
        balance: 3,
        totalSupply: 5,
        netDeposit: 4,
        netShareDeposit: toWei(4),
        grossDeposit: 9,
        grossShareDeposit: toWei(9),
        grossWithdraw: 5,
        grossShareWithdraw: toWei(5),
        decimals: 18,
        token: {
          id: depositToken.address,
          name: depositToken.name,
          symbol: depositToken.symbol,
          decimals: depositToken.decimals,
          totalSupply: 21000000,
        },
      },
    };
  };

  describe('getCachedAccount', () => {
    describe('no saved account', () => {
      it('returns undefined', async () => {
        setupMapper([]);
        const actual = await getCachedAccount(TEST_ADDR);
        expect(actual).toMatchObject(defaultAccount(TEST_ADDR));
      });
    });

    describe('encounters an errors', () => {
      it('returns undefined', async () => {
        jest.spyOn(DataMapper.prototype, 'query').mockImplementation(() => {
          throw new Error();
        });
        const actual = await getCachedAccount(TEST_ADDR);
        expect(actual).toMatchObject(defaultAccount(TEST_ADDR));
      });
    });

    describe('a saved account', () => {
      it('returns the stored account', async () => {
        const expected = { address: TEST_ADDR, claimableBalances: [] };
        setupMapper([expected]);
        const actual = await getCachedAccount(TEST_ADDR);
        expect(actual).toMatchObject(expected);
      });
    });
  });

  describe('getUserAccount', () => {
    describe('user exists', () => {
      it('returns the user account', async () => {
        const sett = getSettDefinition(new Ethereum(), TOKENS.BBADGER);
        const result: UserQuery = {
          user: {
            settBalances: [testSettBalance(sett)],
          },
        };
        jest.spyOn(GraphQLClient.prototype, 'request').mockImplementationOnce(async () => Promise.resolve(result));
        const user = await getUserAccount(new Ethereum(), TEST_ADDR);
        expect(user).toMatchObject(result);
      });
    });

    describe('user does not exist', () => {
      it('returns null', async () => {
        const result: UserQuery = {
          user: null,
        };
        jest.spyOn(GraphQLClient.prototype, 'request').mockImplementationOnce(async () => Promise.resolve(result));
        const user = await getUserAccount(new Ethereum(), TEST_ADDR);
        expect(user).toMatchObject(result);
      });
    });
  });

  describe('getAccounts', () => {
    describe('users exist', () => {
      it('returns a list of user accounts', async () => {
        const result: UsersQuery = {
          users: Object.values(TOKENS).map((token) => ({ id: token, settBalances: [] })),
        };
        let responded = false;
        jest.spyOn(GraphQLClient.prototype, 'request').mockImplementation(async () => {
          if (responded) {
            return { users: [] };
          }
          responded = true;
          return Promise.resolve(result);
        });
        const users = await getAccounts(new Ethereum());
        expect(users).toMatchObject(Object.values(TOKENS));
      });
    });

    describe('users do not exist', () => {
      it('returns an empty list', async () => {
        jest.spyOn(GraphQLClient.prototype, 'request').mockImplementationOnce(async () => Promise.resolve(null));
        const nullReturn = await getAccounts(new Ethereum());
        expect(nullReturn).toMatchObject([]);

        jest
          .spyOn(GraphQLClient.prototype, 'request')
          .mockImplementationOnce(async () => Promise.resolve({ users: null }));
        const nullUsers = await getAccounts(new Ethereum());
        expect(nullUsers).toMatchObject([]);
      });
    });
  });

  describe('toSettBalance', () => {
    const chain = new Ethereum();
    const strategy = new TestStrategy();

    const testToSettBalance = (settAddress: string) => {
      it.each([
        [undefined, 'usd'],
        ['eth', 'eth'],
        ['usd', 'usd'],
      ])('returns sett balance request in %s currency with %s denominated value', async (currency, _res) => {
        jest.spyOn(priceUtils, 'getPrice').mockImplementation(async (contract) => ({
          ...(await strategy.getPrice(contract)),
          updatedAt: Date.now(),
        }));
        const sett = getSettDefinition(chain, settAddress);
        const snapshot = randomSnapshot(sett);
        setupMapper([snapshot]);
        const depositToken = getToken(sett.depositToken);
        const mockBalance = testSettBalance(sett);
        const actual = await toSettBalance(chain, mockBalance, currency);
        expect(actual).toBeTruthy();
        expect(actual.name).toEqual(depositToken.name);
        expect(actual.asset).toEqual(depositToken.symbol);
        expect(actual.ppfs).toEqual(snapshot.balance / snapshot.supply);
        const price = await strategy.getPrice(depositToken.address);
        expect(actual.value).toEqual(inCurrency(price, currency) * actual.balance);
      });
    };

    describe('non-digg token conversion', () => {
      testToSettBalance(TOKENS.BBADGER);
    });

    describe('digg token conversion', () => {
      testToSettBalance(TOKENS.BDIGG);
    });
  });
});
