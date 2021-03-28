import { Chain } from '../../chains/config/chain.config';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';

export interface TokenRequest {
  chain: Chain;
  sett: SettDefinition;
  balance: number;
  currency?: string;
}
