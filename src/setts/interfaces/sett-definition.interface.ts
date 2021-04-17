import { Protocol } from '../../config/constants';
import { SettAffiliateData } from './sett-affiliate-data.interface';

export interface SettDefinition {
  affiliate?: SettAffiliateData;
  createdBlock: number;
  depositToken: string;
  geyserAddress?: string;
  hasBouncer?: boolean;
  name: string;
  protocol?: Protocol;
  settToken: string;
  symbol: string;
}
