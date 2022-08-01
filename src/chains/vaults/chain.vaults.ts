import { Network } from '@badger-dao/sdk';

import { getDataMapper } from '../../aws/dynamodb.utils';
import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { ONE_MINUTE_SECONDS } from '../../config/constants';

export class ChainVaults {
  network: Network;
  cachedVaults: VaultDefinitionModel[] = [];

  readonly cacheTtl = ONE_MINUTE_SECONDS * 2 * 1000;
  private updatedAt!: number;

  constructor(network: Network) {
    this.network = network;
  }

  async all() {
    await this.#updateCachedVaults();
    return this.cachedVaults;
  }

  async getVault(address: string) {
    const vault = Object.fromEntries(this.cachedVaults.map((v) => [v.address, v]))[address];
    if (!vault) {
      throw new Error(`No vault exists with address ${address}`);
    }
    return vault;
  }

  #shouldUpdate() {
    if (!this.updatedAt) {
      return true;
    }
    return Date.now() - this.updatedAt > this.cacheTtl;
  }

  async #updateCachedVaults() {
    if (this.#shouldUpdate()) {
      const mapper = getDataMapper();
      const query = mapper.query(
        VaultDefinitionModel,
        { chain: this.network, isProduction: 1 },
        { indexName: 'IndexVaultCompoundDataChainIsProd' },
      );

      try {
        for await (const compoundVault of query) {
          const cachedVaultIx = this.cachedVaults.findIndex((v) => v.address === compoundVault.address);
          if (cachedVaultIx >= 0) {
            this.cachedVaults[cachedVaultIx] = compoundVault;
          } else {
            this.cachedVaults.push(compoundVault);
          }
        }
      } catch (e) {
        console.error(`Failed to get compoundVault ${this.network}. ${e}`);
      }

      this.updatedAt = Date.now();
    }
  }
}
