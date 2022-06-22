import { Network } from '@badger-dao/sdk';

import { getDataMapper } from '../../aws/dynamodb.utils';
import { VaultCompoundModel } from '../../aws/models/vault-compound.model';
import { ONE_MINUTE_SECONDS } from '../../config/constants';

export class ChainVaults {
  network: Network;
  cachedVaults: VaultCompoundModel[] = [];

  readonly cacheTtl = ONE_MINUTE_SECONDS * 2 * 1000;
  private cacheLastUpd!: number;

  constructor(network: Network) {
    this.network = network;
  }

  async all() {
    await this.#updateCachedVaults();
    return this.cachedVaults;
  }

  async getAllBy<T>(key: string, val: T) {
    await this.#updateCachedVaults();
    // Note, this will be removed, when VaultCompoundModel will have proper
    // interface to get the keys by keysof
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.cachedVaults.filter((vault) => vault[key] === val);
  }

  async getOneBy<T>(key: string, val: T) {
    await this.#updateCachedVaults();
    // Same as for getAllBy
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.cachedVaults.find((vault) => vault[key] === val);
  }

  #isCacheTTLRelevant() {
    if (!this.cacheLastUpd) return false;
    return Date.now() - this.cacheLastUpd <= this.cacheTtl;
  }

  async #updateCachedVaults() {
    if (this.#isCacheTTLRelevant()) return;

    const mapper = getDataMapper();
    const query = mapper.query(
      VaultCompoundModel,
      { chain: this.network, isProduction: 1 },
      { indexName: 'IndexVaultCompoundDataChainIsProd' },
    );

    try {
      for await (const compoundVault of query) {
        this.cachedVaults.push(compoundVault);
      }
    } catch (e) {
      console.error(`Failed to get compoundVault ${this.network}`);
    }

    this.cacheLastUpd = Date.now();
  }
}
