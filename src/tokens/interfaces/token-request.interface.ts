import { Chain } from '../../chains/config/chain.config';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';

export interface TokenRequest {
  chain: Chain;
  sett: VaultDefinition;
  balance: number;
  currency?: string;
}
