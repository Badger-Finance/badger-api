import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { MIGRATION_PROCESS_DATA } from '../../config/constants';
import { MigrationStatus } from '../../migrations/migration.enums';

// Helper table for different kinds of migrations,
// persists the process of running migration state

class MigrationSequence {
  @attribute()
  name!: string;

  @attribute()
  value!: string;

  @attribute()
  status!: MigrationStatus;
}

@table(MIGRATION_PROCESS_DATA)
export class MigrationProcessData {
  @hashKey()
  id!: string;

  @attribute({ defaultProvider: () => Date.now() })
  timestamp!: number;

  @attribute()
  status!: MigrationStatus;

  @attribute({ memberType: embed(MigrationSequence) })
  sequences!: MigrationSequence[];
}
