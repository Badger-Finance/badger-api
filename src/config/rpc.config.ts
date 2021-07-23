import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { Provider } from '../chains/enums/provider.enum';

const rpc = {
  [ChainNetwork.Ethereum]: process.env.ETH_RPC || Provider.Cloudflare,
  [ChainNetwork.BinanceSmartChain]: process.env.BSC_RPC || Provider.Binance,
  [ChainNetwork.Matic]: process.env.MATIC_RPC || Provider.Quicknode,
  [ChainNetwork.xDai]: process.env.XDAI_RPC || Provider.xDai,
};

export default rpc;
