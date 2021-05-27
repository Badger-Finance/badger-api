import { Protocol } from '../../config/enums/protocol.enum';

export interface SettAffiliateData {
  availableDepositLimit?: number;
  protocol: Protocol;
  depositLimit?: number;
}
