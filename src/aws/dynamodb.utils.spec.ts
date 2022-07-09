import { TEST_CHAIN } from '../test/tests.utils';
import { getChainStartBlockKey } from './dynamodb.utils';

describe('rewards.utils', () => {
  describe('getChainStartBlockKey', () => {
    it('returns underscore delimited string comprised of chain network and requested block', () => {
      expect(getChainStartBlockKey(TEST_CHAIN, 13500000)).toEqual(`ethereum_13500000`);
    });
  });
});
