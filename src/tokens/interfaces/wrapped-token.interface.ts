import { ChainNetwork } from '../../chains/enums/chain-network.enum';

export interface WrappedToken {
  address: string;
  network: ChainNetwork;
}
