import { CachedValueSource } from './cached-value-source.interface';

export interface ValueSourceMap {
  [name: string]: CachedValueSource;
}
