import { Currency, Network } from '@badger-dao/sdk';
import { Controller, Get, Inject, PathParams, QueryParams, UseCache } from '@tsed/common';
import { ContentType, Description, Returns, Summary } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { VaultModel } from './interfaces/vault-model.interface';
import { VaultsService } from './vaults.service';
import { getVaultDefinition } from './vaults.utils';
import { VaultHarvestsMapModel } from './interfaces/vault-harvests-list-model.interface';
import { VaultHarvestsMap } from './interfaces/vault-harvest-map';
import { VaultHarvestsModel } from './interfaces/vault-harvests-model.interface';
import { VaultHarvestsExtended } from './interfaces/vault-harvest-extended';

@Controller('/vaults')
export class VaultsController {
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
    return this.vaultService.listVaults(Chain.getChain(chain), currency);
  }

  @Get('/harvests')
  @UseCache()
  @ContentType('json')
  @Summary('Get all vaults harvests on a chain')
  @Description('Return map of vaults, with harvests')
  @Returns(200, VaultHarvestsMapModel)
  @Returns(400).Description('Not a valid chain')
  async getlistVaultHarvests(@QueryParams('chain') chain?: Network): Promise<VaultHarvestsMap> {
    return this.vaultService.listVaultHarvests(Chain.getChain(chain));
  }

  @Get('/harvests/:vault')
  @ContentType('json')
  @Summary('Get harvests on a specific vault')
  @Description('Return full list of vault`s harvests')
  @Returns(200, Array).Of(VaultHarvestsModel)
  @Returns(400).Description('Not a valid chain')
  async getVaultsHarvests(
    @PathParams('vault') vault: string,
    @QueryParams('chain') chain?: Network,
  ): Promise<VaultHarvestsExtended[]> {
    return this.vaultService.getVaultHarvests(Chain.getChain(chain), vault);
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
    const chainInst = Chain.getChain(chain);
    const vaultDef = getVaultDefinition(Chain.getChain(chain), vault);

    return this.vaultService.getVault(chainInst, vaultDef, currency);
  }
}
