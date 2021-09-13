import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { SETT_BOOST_DATA } from '../../config/constants';
import { SettBoost } from './sett-boost.interface';

@table(SETT_BOOST_DATA)
export class CachedSettBoost implements SettBoost {
  @hashKey()
  address!: string;

  @rangeKey()
  boost!: number;

  @attribute()
  multiplier!: number;
}
