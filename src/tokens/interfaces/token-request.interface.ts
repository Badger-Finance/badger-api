import { Chain } from '../../config/chain/chain';
import { SettDefinition } from '../../interface/Sett';

export interface TokenRequest {
  chain: Chain;
  sett: SettDefinition;
  balance: number;
  currency?: string;
}
