import { Network } from '@badger-dao/sdk';

import { Chain } from '../../chains/config/chain.config';
import { TOKENS } from '../../config/tokens.config';
import * as sushiswapGraph from '../../graphql/generated/sushiswap';
import { MOCK_VAULT_DEFINITION } from '../../test/constants';
import { setupMockChain } from '../../test/mocks.utils';
import { getSushiswapYieldSources } from './sushiswap.strategy';

describe('sushiswap.strategy', () => {
  let chain: Chain;

  beforeEach(() => {
    chain = setupMockChain();
  });

  describe('getSushiswapYieldSources', () => {
    it('returns no value sources given no trade data in the subgraph', async () => {
      jest.spyOn(sushiswapGraph, 'getSdk').mockImplementation((_client) => {
        return {
          SushiPairDayDatas(_v, _r): Promise<sushiswapGraph.SushiPairDayDatasQuery> {
            return Promise.resolve({ pairDayDatas: [] });
          },
        };
      });
      const result = await getSushiswapYieldSources(chain, MOCK_VAULT_DEFINITION);
      expect(result).toMatchObject([]);
    });

    it.each([[Network.Ethereum], [Network.Polygon], [Network.Arbitrum]])(
      'returns trade fees for the pair given trade data in the subgraph for %s',
      async (network) => {
        chain = setupMockChain({ network });
        jest.spyOn(sushiswapGraph, 'getSdk').mockImplementation((_client) => {
          return {
            SushiPairDayDatas(_v, _r): Promise<sushiswapGraph.SushiPairDayDatasQuery> {
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
                    volumeUSD: 2500000,
                    date: 85000,
                  },
                ],
              });
            },
          };
        });
        const result = await getSushiswapYieldSources(chain, MOCK_VAULT_DEFINITION);
        expect(result).toMatchSnapshot();
      },
    );
  });
});
