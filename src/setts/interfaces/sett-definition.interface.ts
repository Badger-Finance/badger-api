import { Protocol } from '../../config/constants';
import { Affiliate } from './affiliate.interface';

export interface SettDefinition {
  affiliate?: Affiliate;
  depositToken: string;
  geyserAddress?: string;
  hasBouncer?: boolean;
  name: string;
  protocol?: Protocol;
  settToken: string;
  symbol: string;
}
