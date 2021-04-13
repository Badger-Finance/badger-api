import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { Sett } from '../setts/interfaces/sett.interface.';
import { GeyserService } from './geysers.service';

@Controller('/geysers')
export class GeyserController {
  @Inject()
  geyserService!: GeyserService;

  @Get()
  @ContentType('json')
  async listFarms(@QueryParams('chain') chain?: ChainNetwork): Promise<Sett[]> {
    return this.geyserService.listFarms(Chain.getChain(chain));
  }
}
