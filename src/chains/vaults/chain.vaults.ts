import { Network, ONE_MINUTE_MS } from '@badger-dao/sdk';
import { NotFound } from '@tsed/exceptions';
import { ethers } from 'ethers';

import { getDataMapper } from '../../aws/dynamodb.utils';
import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { STAGE } from '../../config/constants';
import { Stage } from '../../config/enums/stage.enum';

export class ChainVaults {
  network: Network;
  cachedVaults: VaultDefinitionModel[] = [];

  readonly cacheTtl = ONE_MINUTE_MS * 2;
  private updatedAt!: number;

  constructor(network: Network) {
    this.network = network;
  }

  async all(): Promise<VaultDefinitionModel[]> {
    await this.#updateCachedVaults();
    return this.cachedVaults;
  }

  async getVault(address: string): Promise<VaultDefinitionModel> {
    await this.#updateCachedVaults();
    const requestAddress = ethers.utils.getAddress(address);
    const vault = Object.fromEntries(this.cachedVaults.map((v) => [v.address, v]))[requestAddress];
    if (!vault) {
      throw new NotFound(`No vault exists with address ${requestAddress}`);
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
        { indexName: 'IndexVaultCompoundDataChainIsProd' }
      );

      try {
        for await (const vault of query) {
          const index = this.cachedVaults.findIndex((v) => v.address === vault.address);
          if (index >= 0) {
            this.cachedVaults[index] = vault;
          } else {
            if (vault.stage === Stage.Production || vault.stage === STAGE) {
              this.cachedVaults.push(vault);
            }
          }
        }
      } catch (e) {
        console.error(`Failed to update cached vaults for ${this.network} network. ${e}`);
      }

      this.updatedAt = Date.now();
    }
  }
}
