import { ChainNetwork } from '../../chains/enums/chain-network.enum';

export interface WrappedToken {
  address: string;
  symbol: string;
  network: ChainNetwork;
}
