import { Network } from '@badger-dao/sdk';

import { getOrCreateChain, getSupportedChains, SUPPORTED_NETWORKS } from './chains.utils';
import { Chain } from './config/chain.config';

describe('chains.utils', () => {
  describe('getSupportedChains', () => {
    it('returns chain objects for all supported networks', () => {
      const result = getSupportedChains().map((c) => c.network);
      const expected = new Set(SUPPORTED_NETWORKS);
      expect(result.length).toEqual(SUPPORTED_NETWORKS.length);
      for (const network of result) {
        expect(expected.has(network)).toBeTruthy();
      }
    });
  });

  describe('getOrCreateChain', () => {
    describe('request a chain by network', () => {
      it.each(SUPPORTED_NETWORKS)('requesting %s returns a chain object', (network) => {
        const result = getOrCreateChain(network);
        expect(result.network).toEqual(network);
      });
    });

    describe('request an undefined chain', () => {
      it('returns ethereum chain object', () => {
        jest.spyOn(Chain, 'getChain').mockImplementation(() => {
          throw new Error('Expected test error: getChain');
        });
        expect(getOrCreateChain().network).toEqual(Network.Ethereum);
      });
    });

    describe('request an unsupported chain', () => {
      it('throws a bad request error', () => {
        expect(() => getOrCreateChain('badnetwork' as Network)).toThrow('badnetwork is not a supported chain');
      });
    });
  });
});
