import { Description, Example } from '@tsed/schema';
import { ethTokensConfig } from '../config/eth-tokens.config';
import { Token } from './token.interface';
import { TokenConfig } from './token-config.interface';

@Description('Mapping of checksum token address to token metadata')
@Example(ethTokensConfig)
export class TokenConfigModel implements TokenConfig {
  [address: string]: Token;
}
