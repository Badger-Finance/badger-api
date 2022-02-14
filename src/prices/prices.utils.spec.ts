import { DataMapper } from '@aws/dynamodb-data-mapper';
import { NotFound } from '@tsed/exceptions';
import { TestStrategy } from '../chains/strategies/test.strategy';
import { TOKENS } from '../config/tokens.config';
import { setupMapper, TEST_ADDR } from '../test/tests.utils';
import { convert, getPrice, updatePrice } from './prices.utils';
import { Currency } from '@badger-dao/sdk';

describe('prices.utils', () => {
  const strategy = new TestStrategy();

  describe('getPrice', () => {
    describe('query encounters an error', () => {
      it('returns a price of 0', async () => {
        jest.spyOn(DataMapper.prototype, 'query').mockImplementation(() => {
          throw new Error('QueryError');
        });
        const cakePrice = await getPrice(TOKENS.CAKE);
        expect(cakePrice).toBeDefined();
        const expected = { address: TOKENS.CAKE, price: 0 };
        expect(cakePrice).toMatchObject(expected);
      });
    });

    describe('when price is not available', () => {
      it('returns a price of 0', async () => {
        setupMapper([]);
        const cakePrice = await getPrice(TOKENS.CAKE);
        expect(cakePrice).toBeDefined();
        const expected = { address: TOKENS.CAKE, price: 0 };
        expect(cakePrice).toMatchObject(expected);
      });
    });

    describe('when price is available', () => {
      it('returns a token snapshot with the latest price data', async () => {
        const price = await strategy.getPrice(TOKENS.BADGER);
        setupMapper([price]);
        const fetchedBadgerPrice = await getPrice(TOKENS.BADGER);
        expect(fetchedBadgerPrice).toBeDefined();
        expect(fetchedBadgerPrice).toMatchObject(price);
      });
    });
  });

  describe('updatePrice', () => {
    describe('update unsupported token', () => {
      it('throws an bad request error', async () => {
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        await expect(updatePrice(TEST_ADDR)).rejects.toThrow(NotFound);
        expect(put.mock.calls.length).toEqual(0);
      });
    });

    describe('encounters an error from a price of 0', () => {
      it('returns the price of 0, but does not save the record', async () => {
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        jest.spyOn(TestStrategy.prototype, 'getPrice').mockImplementation(async (token) => ({
          address: token,
          price: 0,
        }));
        const result = await updatePrice(TOKENS.BADGER);
        expect(put.mock.calls.length).toEqual(0);
        expect(result).toMatchObject({ address: TOKENS.BADGER, price: 0 });
      });
    });

    describe('encounters an error from a price of 0', () => {
      it('returns the price of NaN, but does not save the record', async () => {
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        jest.spyOn(TestStrategy.prototype, 'getPrice').mockImplementation(async (token) => ({
          address: token,
          price: NaN,
        }));
        const result = await updatePrice(TOKENS.BADGER);
        expect(put.mock.calls.length).toEqual(0);
        expect(result).toMatchObject({ address: TOKENS.BADGER, price: 0 });
      });
    });

    describe('update supported token', () => {
      it('creates an price db entry', async () => {
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        await updatePrice(TOKENS.BADGER);
        expect(put.mock.calls.length).toEqual(1);
      });
    });
  });

  describe('convert', () => {
    it.each([
      [3600, 3600, Currency.USD],
      [3600, 2, Currency.ETH],
    ])('converts %d USD to %s %s', async (price, conversion, currency) => {
      setupMapper([{ address: TOKENS.WETH, price: 1800 }]);
      const result = await convert(price, currency);
      expect(result).toEqual(conversion);
    });
  });
});
