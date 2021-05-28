import { Protocol } from '../../config/enums/protocol.enum';
import { Stage } from '../../config/enums/stage.enum';
import { SettAffiliateData } from './sett-affiliate-data.interface';

export interface SettDefinition {
  affiliate?: SettAffiliateData;
  balanceDecimals?: number;
  createdBlock: number;
  depositToken: string;
  experimental?: boolean;
  hasBouncer?: boolean;
  name: string;
  protocol?: Protocol;
  settToken: string;
  stage?: Stage;
  supplyDecimals?: number;
  symbol: string;
}
