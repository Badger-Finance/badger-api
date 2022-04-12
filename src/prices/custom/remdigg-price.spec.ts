import { TOKENS } from '../../config/tokens.config';
import { TEST_CHAIN } from '../../test/tests.utils';
import * as pricesUtils from '../prices.utils';
import { getRemDiggPrice } from './remdigg-price';
import { fullTokenMockMap } from '../../tokens/mocks/full-token.mock';

describe('remdigg-price', () => {
  describe('getRemDiggPrice', () => {
    it('converts the digg price to the frozen remdigg price', async () => {
      jest.spyOn(pricesUtils, 'queryPrice').mockImplementation(async (digg) => ({
        address: digg,
        price: 31000,
      }));
      const remDiggPrice = await getRemDiggPrice(TEST_CHAIN, fullTokenMockMap[TOKENS.REMDIGG]);
      expect(remDiggPrice).toMatchObject({ address: TOKENS.REMDIGG, price: 31000 });
    });
  });
});
