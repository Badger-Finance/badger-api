import { Network } from '@badger-dao/sdk';
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
  [TOKENS.FTM_DAI]: {
    address: TOKENS.FTM_DAI,
    decimals: 18,
    name: 'Dai',
    lookupName: 'dai',
    symbol: 'DAI',
    type: TokenType.Contract,
  },
  [TOKENS.FTM_USDC]: {
    address: TOKENS.FTM_USDC,
    decimals: 6,
    name: 'US Dollar Coin',
    lookupName: 'usd-coin',
    symbol: 'USDC',
    type: TokenType.Contract,
  },
  [TOKENS.SMM_USDC_DAI]: {
    address: TOKENS.SMM_USDC_DAI,
    decimals: 18,
    lpToken: true,
    name: 'Solidly: USDC-DAI',
    symbol: 'SMM-USDC-DAI',
    type: TokenType.SolidlyLp,
  },
  [TOKENS.BSMM_USDC_DAI]: {
    address: TOKENS.BSMM_USDC_DAI,
    decimals: 18,
    name: 'bSolidly: USDC-DAI',
    symbol: 'bSMM-USDC-DAI',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.SMM_USDC_DAI,
      network: Network.Fantom,
    },
  },
};
