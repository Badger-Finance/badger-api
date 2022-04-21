import { CachedValueSource } from '../../aws/models/apy-snapshots.model';

export interface ValueSourceMap {
  [name: string]: CachedValueSource;
}
