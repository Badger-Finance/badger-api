import { Description, Example } from '@tsed/schema';
import { TokenFull, TokenFullMap } from './token-full.interface';
import { fullTokenMockMap } from '../mocks/full-token.mock';

@Description('Mapping of checksum token address to token metadata')
@Example(fullTokenMockMap)
export class TokenConfigModel implements TokenFullMap {
  [address: string]: TokenFull;
}
