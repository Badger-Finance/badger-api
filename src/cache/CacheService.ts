import { Service } from '@tsed/di';
import NodeCache from 'node-cache';

/**
 * Central cache for all API cachable entities.
 * Serves as a simple type checked wrapper on the
 * underlying NodeCache.
 */
@Service()
export class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 300, checkperiod: 480 });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get(key);
  }

  set<T>(key: string, value: T): void {
    this.cache.set(key, value);
  }

  flush(): void {
    this.cache.flushAll();
  }

  static getCacheKey(...parts: string[]): string {
    return parts.join('-');
  }
}
