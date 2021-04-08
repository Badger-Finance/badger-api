import { Affiliate } from './config/affiliate.config';
import { Yearn } from './config/yearn.config';

/**
 * Instantiate objects for registration.
 */
export const loadAffiliates = (): Affiliate[] => {
  return [new Yearn()];
};
