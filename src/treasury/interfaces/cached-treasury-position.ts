import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { Protocol } from '@badger-dao/sdk';
import { CachedTokenBalance } from '../../tokens/interfaces/cached-token-balance.interface';
import { TreasuryPosition } from './treasy-position.interface';

export class CachedTreasuryPosition extends CachedTokenBalance implements TreasuryPosition {
  @attribute()
  protocol!: Protocol | string;

  @attribute()
  apr!: number;
}
