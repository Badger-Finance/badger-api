import { Ethereum } from '../chains/config/eth.config';
import { getChainStartBlockKey } from './dynamodb.utils';

describe('rewards.utils', () => {
  describe('getChainStartBlockKey', () => {
    it('returns underscore delimited string comprised of chain network and requested block', () => {
      expect(getChainStartBlockKey(new Ethereum(), 13500000)).toEqual(`ethereum_13500000`);
    });
  });
});
