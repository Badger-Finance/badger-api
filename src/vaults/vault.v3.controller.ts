import { Currency, Network } from '@badger-dao/sdk';
import { Controller, Get, Inject, QueryParams, UseCache } from '@tsed/common';
import { ContentType, Description, Returns, Summary } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { VaultModel } from './interfaces/vault-model.interface';
import { VaultsService } from './vaults.service';
import { getVaultDefinition } from './vaults.utils';
import { VaultHarvestsMapModel } from './interfaces/vault-harvests-list-model.interface';
import { VaultHarvestsMap } from './interfaces/vault-harvest-map';
import { VaultHarvestsModel } from './interfaces/vault-harvests-model.interface';
import { VaultHarvestsExtendedResp } from './interfaces/vault-harvest-extended-resp.interface';
import { QueryParamError } from '../errors/validation/query.param.error';

@Controller('/vault')
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
    @QueryParams('vault') vault: string,
    @QueryParams('chain') chain?: Network,
    @QueryParams('currency') currency?: Currency,
  ): Promise<VaultModel> {
    if (!vault) throw new QueryParamError('vault');

    const chainInst = Chain.getChain(chain);
    const vaultDef = getVaultDefinition(Chain.getChain(chain), vault);

    return this.vaultService.getVault(chainInst, vaultDef, currency);
  }

  @Get('/list')
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
  @ContentType('json')
  @Summary('Get harvests on a specific vault')
  @Description('Return full list of vault`s harvests')
  @Returns(200, Array).Of(VaultHarvestsModel)
  @Returns(400).Description('Not a valid chain')
  async getVaultsHarvests(
    @QueryParams('vault') vault: string,
    @QueryParams('chain') chain?: Network,
  ): Promise<VaultHarvestsExtendedResp[]> {
    if (!vault) throw new QueryParamError('vault');

    return this.vaultService.getVaultHarvests(Chain.getChain(chain), vault);
  }

  @Get('/list/harvests')
  @UseCache()
  @ContentType('json')
  @Summary('Get all vaults harvests on a chain')
  @Description('Return map of vaults, with harvests')
  @Returns(200, VaultHarvestsMapModel)
  @Returns(400).Description('Not a valid chain')
  async getlistVaultHarvests(@QueryParams('chain') chain?: Network): Promise<VaultHarvestsMap> {
    return this.vaultService.listVaultHarvests(Chain.getChain(chain));
  }
}
