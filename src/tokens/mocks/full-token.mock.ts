import { TokenFullMap } from '../interfaces/token-full.interface';
import { TOKENS } from '../../config/tokens.config';
import { PricingType } from '../../prices/enums/pricing-type.enum';

// temp solution, remove after sdk lib mocks
export const fullTokenMockMap: TokenFullMap = {
  [TOKENS.BADGER]: {
    address: TOKENS.BADGER,
    decimals: 18,
    name: 'Badger',
    symbol: 'BADGER',
    type: PricingType.Contract,
  },
  [TOKENS.DIGG]: {
    address: TOKENS.DIGG,
    decimals: 9,
    name: 'Digg',
    symbol: 'DIGG',
    type: PricingType.Contract,
  },
};
