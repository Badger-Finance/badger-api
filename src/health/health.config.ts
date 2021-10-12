import { gql } from 'graphql-request';
import { Provider } from '../chains/enums/provider.enum';
import { COINGECKO_URL, PANCAKESWAP_URL, SUSHISWAP_URL, UNISWAP_URL } from '../config/constants';
import { CURVE_API_URL } from '../protocols/strategies/convex.strategy';
import { Endpoint, Subgraph } from './health.types';

export const apis: Endpoint[] = [
  { name: 'BSC Node', url: new URL('https://bsc-node.badger.guru') },
  { name: 'Curve API', url: new URL(CURVE_API_URL) },
  { name: 'CoinGecko', url: new URL(COINGECKO_URL + '/supported_vs_currencies') },
  { name: 'WC Bridge', url: new URL('https://wc-bridge.badger.finance') },
];

export const providers: Endpoint[] = [
  { name: 'Quicknode', url: new URL(Provider.Quicknode) },
  { name: 'Binance', url: new URL(Provider.Binance) },
  { name: 'Cloudflare', url: new URL(Provider.Cloudflare) },
  { name: 'xDai', url: new URL(Provider.xDai) },
];

// CONTRACTS:
// See /src/config/abi/health-bsc-abis.ts for BSC
// See /src/config/abi/health-eth-abis.ts for ETH

export const subgraphs: Subgraph[] = [
  {
    name: 'PANCAKESWAP',
    url: new URL(PANCAKESWAP_URL),
    query: gql`
      {
        users(first: 5) {
          id
          liquidityPositions {
            id
          }
        }
        bundles(first: 5) {
          id
          ethPrice
        }
      }
    `,
  },
  {
    name: 'SUSHISWAP',
    url: new URL(SUSHISWAP_URL),
    query: gql`
      {
        uniswapFactory(id: "0xBCfCcbde45cE874adCB698cC183deBcF17952812") {
          pairCount
          totalVolumeUSD
          totalVolumeETH
        }
      }
    `,
  },
  {
    name: 'UNISWAP',
    url: new URL(UNISWAP_URL),
    query: gql`
      {
        masterChefs(first: 5) {
          id
          bonusMultiplier
          bonusEndBlock
          devaddr
        }
        histories(first: 5) {
          id
          owner {
            id
          }
          slpBalance
          slpAge
        }
      }
    `,
  },
];
