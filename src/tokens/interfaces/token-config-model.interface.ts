import { Description, Example } from '@tsed/schema';
import { ethTokensConfig } from '../config/eth-tokens.config';
import { Token, TokenConfiguration } from '@badger-dao/sdk';

@Description('Mapping of checksum token address to token metadata')
@Example(ethTokensConfig)
export class TokenConfigModel implements TokenConfiguration {
  [address: string]: Token;
}
