import { ChainNetwork } from '../../chains/enums/chain-network.enum';

export interface WrappedToken {
  symbol: string;
  network: ChainNetwork;
}
