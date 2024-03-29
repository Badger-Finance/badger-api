import { Currency, Network, VaultEarning } from '@badger-dao/sdk';
import { Controller, Get, Inject, PathParams, QueryParams, UseCache } from '@tsed/common';
import { ContentType, Deprecated, Description, Returns, Summary } from '@tsed/schema';

import { getOrCreateChain } from '../chains/chains.utils';
import { VaultHarvestsMap } from './interfaces/vault-harvest-map';
import { VaultHarvestsMapModel } from './interfaces/vault-harvests-list-model.interface';
import { VaultHarvestsModel } from './interfaces/vault-harvests-model.interface';
import { VaultModel } from './interfaces/vault-model.interface';
import { VaultsService } from './vaults.service';

@Deprecated()
@Controller('/vaults')
export class VaultsV2Controller {
  @Inject()
  vaultService!: VaultsService;

  @Get()
  @ContentType('json')
  @Summary('Get a list of protocol vaults')
  @Description('Return a list of protocol vaults for the requested chain')
  @Returns(200, VaultModel)
  @Returns(400).Description('Not a valid chain')
  async listVaults(
    @QueryParams('chain') chain?: Network,
    @QueryParams('currency') currency?: Currency,
  ): Promise<VaultModel[]> {
    return this.vaultService.listVaults(getOrCreateChain(chain), currency);
  }

  @Get('/harvests')
  @UseCache()
  @ContentType('json')
  @Summary('Get all vaults harvests on a chain')
  @Description('Return map of vaults, with harvests')
  @Returns(200, VaultHarvestsMapModel)
  @Returns(400).Description('Not a valid chain')
  async getlistVaultHarvests(@QueryParams('chain') chain?: Network): Promise<VaultHarvestsMap> {
    return this.vaultService.listVaultHarvests(getOrCreateChain(chain));
  }

  @Get('/harvests/:address')
  @ContentType('json')
  @Summary('Get harvests on a specific vault')
  @Description('Return full list of vault`s harvests')
  @Returns(200, Array).Of(VaultHarvestsModel)
  @Returns(400).Description('Not a valid chain')
  async getVaultsHarvests(
    @PathParams('address') address: string,
    @QueryParams('chain') chain?: Network,
  ): Promise<VaultEarning[]> {
    const targetChain = getOrCreateChain(chain);
    const vault = await targetChain.vaults.getVault(address);
    return this.vaultService.getVaultHarvests(targetChain, vault);
  }

  @Get('/:vault')
  @ContentType('json')
  @Summary('Get a specific vault')
  @Description('Return a specific vault for the requested chain')
  @Returns(200, VaultModel)
  @Returns(400).Description('Not a valid chain')
  @Returns(404).Description('Not a valid vault')
  async getVault(
    @PathParams('vault') vault: string,
    @QueryParams('chain') chain?: Network,
    @QueryParams('currency') currency?: Currency,
  ): Promise<VaultModel> {
    const chainInst = getOrCreateChain(chain);
    const vaultDef = await chainInst.vaults.getVault(vault);

    return VaultsService.loadVaultV2(chainInst, vaultDef, currency);
  }
}
