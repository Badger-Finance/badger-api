import { Network } from '@badger-dao/sdk';
import { Controller, Get, Inject, PathParams, QueryParams } from '@tsed/common';
import { ContentType, Description, Returns, Summary } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { VaultModel } from './interfaces/vault-model.interface';
import { VaultsService } from './vaults.service';

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
    @QueryParams('currency') currency?: string,
  ): Promise<VaultModel[]> {
    return this.vaultService.listVaults(Chain.getChain(chain), currency);
  }

  @Get('/:contract')
  @ContentType('json')
  @Summary('Get a specific vault')
  @Description('Return a specific vault for the requested chain')
  @Returns(200, VaultModel)
  @Returns(400).Description('Not a valid chain')
  @Returns(404).Description('Not a valid vault')
  async getVault(
    @PathParams('contract') contract: string,
    @QueryParams('chain') chain?: Network,
    @QueryParams('currency') currency?: string,
  ): Promise<VaultModel> {
    return this.vaultService.getVault(Chain.getChain(chain), contract, currency);
  }
}
