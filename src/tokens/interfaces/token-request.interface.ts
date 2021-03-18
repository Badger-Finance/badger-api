import { Chain } from '../../chains/config/chain.config';
import { SettDefinition } from '../../interface/Sett';

export interface TokenRequest {
  chain: Chain;
  sett: SettDefinition;
  balance: number;
  currency?: string;
}
