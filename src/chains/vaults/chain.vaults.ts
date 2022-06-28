import { Network } from '@badger-dao/sdk';

import { getDataMapper } from '../../aws/dynamodb.utils';
import { IVaultCompoundModel } from '../../aws/interfaces/vault-compound-model.interface';
import { VaultCompoundModel } from '../../aws/models/vault-compound.model';
import { ONE_MINUTE_SECONDS } from '../../config/constants';

type VaultCompoundModelTypes = IVaultCompoundModel[keyof IVaultCompoundModel];

export class ChainVaults {
  network: Network;
  cachedVaults: IVaultCompoundModel[] = [];

  readonly cacheTtl = ONE_MINUTE_SECONDS * 2 * 1000;
  private cacheLastUpd!: number;

  constructor(network: Network) {
    this.network = network;
  }

  async all() {
    await this.#updateCachedVaults();
    return this.cachedVaults;
  }

  async getAllBy<T extends VaultCompoundModelTypes>(key: keyof IVaultCompoundModel, val: T) {
    await this.#updateCachedVaults();
    return this.cachedVaults.filter((vault) => vault[key] === val);
  }

  async getOneBy<T extends VaultCompoundModelTypes>(key: keyof IVaultCompoundModel, val: T) {
    await this.#updateCachedVaults();
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
        const cachedVaultIx = this.cachedVaults.findIndex((v) => v.address === compoundVault.address);
        if (cachedVaultIx >= 0) this.cachedVaults[cachedVaultIx] = compoundVault;
        else this.cachedVaults.push(compoundVault);
      }
    } catch (e) {
      console.error(`Failed to get compoundVault ${this.network}. ${e}`);
    }

    this.cacheLastUpd = Date.now();
  }
}
