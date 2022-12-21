import { Network } from '@badger-dao/sdk/lib/config/enums/network.enum';

export interface LastScannedBlock {
  lastScannedBlock: number;
}

export type LastScannedBlockMeta = Record<Network, LastScannedBlock>;
