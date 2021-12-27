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
  @Summary('Get a list of protocol setts')
  @Description('Return a list of protocol setts for the requested chain')
  @Returns(200, VaultModel)
  @Returns(400).Description('Not a valid chain')
  @Returns(404).Description('Not a valid sett')
  async listSetts(
    @QueryParams('chain') chain?: Network,
    @QueryParams('currency') currency?: string,
  ): Promise<VaultModel[]> {
    return this.vaultService.listSetts(Chain.getChain(chain), currency);
  }

  @Get('/:contract')
  @ContentType('json')
  @Summary('Get a specific sett')
  @Description('Return a specific sett for the requested chain')
  @Returns(200, VaultModel)
  @Returns(400).Description('Not a valid chain')
  @Returns(404).Description('Not a valid sett')
  async getSett(
    @PathParams('contract') contract: string,
    @QueryParams('chain') chain?: Network,
    @QueryParams('currency') currency?: string,
  ): Promise<VaultModel> {
    return this.vaultService.getSett(Chain.getChain(chain), contract, currency);
  }
}
