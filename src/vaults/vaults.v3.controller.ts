import { Currency, Network, VaultDTOV3, VaultSnapshot } from '@badger-dao/sdk';
import { Controller, Inject } from '@tsed/di';
import { UseCache } from '@tsed/platform-cache';
import { QueryParams } from '@tsed/platform-params';
import { ContentType, Description, Get, Hidden, Returns, Summary } from '@tsed/schema';

import { VaultYieldEvent } from '../aws/models/vault-yield-event.model';
import { getOrCreateChain } from '../chains/chains.utils';
import { QueryParamError } from '../errors/validation/query.param.error';
import { queryVaultHistoricYieldEvents } from './harvests.utils';
import { VaultHarvestsMap } from './interfaces/vault-harvest-map';
import { VaultHarvestsMapModel } from './interfaces/vault-harvests-list-model.interface';
import { VaultModel } from './interfaces/vault-model.interface';
import { VaultsService } from './vaults.service';

@Controller('/vaults')
export class VaultsV3Controller {
  @Inject()
  vaultService!: VaultsService;

  @Get()
  @ContentType('json')
  @Summary('Get a specific vault')
  @Description('Return a specific vault for the requested chain')
  @Returns(200, VaultModel)
  @Returns(400).Description('Not a valid chain')
  @Returns(404).Description('Not a valid vault')
  async getVault(
    @QueryParams('address') address: string,
    @QueryParams('chain') chain?: Network,
    @QueryParams('currency') currency?: Currency,
  ): Promise<VaultDTOV3> {
    if (!address) {
      throw new QueryParamError('vault');
    }

    const chainInst = getOrCreateChain(chain);
    const compoundVault = await chainInst.vaults.getVault(address);
    return VaultsService.loadVaultV3(chainInst, compoundVault, currency);
  }

  @Get('/list')
  @ContentType('json')
  @Summary('Get a list of protocol vaults')
  @Description('Return a list of protocol vaults for the requested chain')
  // TODO: follow up with a swagger model pr
  // @Returns(200, VaultModel)
  @Returns(400).Description('Not a valid chain')
  async listVaults(
    @QueryParams('chain') chain?: Network,
    @QueryParams('currency') currency?: Currency,
  ): Promise<VaultDTOV3[]> {
    return this.vaultService.listVaultsV3(getOrCreateChain(chain), currency);
  }

  @Get('/harvests')
  @ContentType('json')
  @Summary('Get harvests on a specific vault')
  @Description('Return full list of vault`s harvests')
  // TODO: create a yield event model
  // @Returns(200, Array).Of(VaultHarvestsModel)
  @Returns(400).Description('Not a valid chain')
  async getVaultsHarvests(
    @QueryParams('address') address: string,
    @QueryParams('chain') chain?: Network,
  ): Promise<VaultYieldEvent[]> {
    if (!address) {
      throw new QueryParamError('address');
    }

    const targetChain = getOrCreateChain(chain);
    const vault = await targetChain.vaults.getVault(address);
    return queryVaultHistoricYieldEvents(targetChain, vault);
  }

  @Get('/list/harvests')
  @UseCache()
  @ContentType('json')
  @Summary('Get all vaults harvests on a chain')
  @Description('Return map of vaults, with harvests')
  @Returns(200, VaultHarvestsMapModel)
  @Returns(400).Description('Not a valid chain')
  async getlistVaultHarvests(@QueryParams('chain') chain?: Network): Promise<VaultHarvestsMap> {
    return this.vaultService.listVaultHarvests(getOrCreateChain(chain));
  }

  @Hidden()
  @UseCache()
  @Get('/snapshots')
  @ContentType('json')
  async getVaultSnapshotsInRange(
    @QueryParams('vault') vault: string,
    @QueryParams('timestamps') timestamps: string,
    @QueryParams('chain') chain?: Network,
  ): Promise<VaultSnapshot[]> {
    if (!vault) {
      throw new QueryParamError('vault');
    }
    if (!timestamps) {
      throw new QueryParamError('timestamps');
    }

    const timestampsList = timestamps.split(',').map((n) => Number(n));
    const isTimestampsValid = timestampsList.every((time) => time > 0);

    if (!isTimestampsValid) {
      throw new QueryParamError('timestamps');
    }

    return this.vaultService.getVaultChartDataByTimestamps(vault, getOrCreateChain(chain), timestampsList);
  }
}
