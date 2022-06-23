import { Description, Example } from '@tsed/schema';

import { fullTokenMockMap } from '../mocks/full-token.mock';
import { TokenFull, TokenFullMap } from './token-full.interface';

@Description('Mapping of checksum token address to token metadata')
@Example(fullTokenMockMap)
export class TokenConfigModel implements TokenFullMap {
  [address: string]: TokenFull;
}
