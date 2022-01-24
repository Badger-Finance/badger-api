import { TOKENS } from '../../config/tokens.config';
import { TokenType } from '../enums/token-type.enum';
import { TokenConfig } from '../interfaces/token-config.interface';

export const fantomTokensConfig: TokenConfig = {
  [TOKENS.MULTI_BADGER]: {
    address: TOKENS.MULTI_BADGER,
    decimals: 18,
    lookupName: 'badger-dao',
    name: 'Badger',
    symbol: 'BADGER',
    type: TokenType.Contract,
  },
};
