import { Protocol } from '../../config/constants';

export interface SettAffiliateData {
  availableDepositLimit?: number;
  protocol: Protocol;
  depositLimit?: number;
}
