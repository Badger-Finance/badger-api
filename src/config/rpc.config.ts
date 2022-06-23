import { Network } from '@badger-dao/sdk';

import { Provider } from '../chains/enums/provider.enum';

const rpc = {
  [Network.Ethereum]: process.env.ETH_RPC || Provider.Cloudflare,
  [Network.BinanceSmartChain]: process.env.BSC_RPC || Provider.Binance,
  [Network.Polygon]: process.env.MATIC_RPC || Provider.Quicknode,
  [Network.Arbitrum]: process.env.ARBITRUM_RPC || Provider.Arbitrum,
  [Network.Avalanche]: process.env.AVALANCHE_RPC || Provider.Avalanche,
  [Network.Fantom]: process.env.FANTOM_RPC || Provider.Fantom,
};

export default rpc;
