import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { INDEXING_META_DATA } from '../../config/constants';

@table(INDEXING_META_DATA)
export class IndexingMetadata<T> {
  @hashKey()
  task!: string;

  @attribute({ memberType: { type: 'Any' } })
  data!: T;
}
