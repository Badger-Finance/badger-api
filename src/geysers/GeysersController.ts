import { Controller, Get, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { Sett } from '../setts/interfaces/sett.interface.';
import { GeyserService } from './GeysersService';

@Controller('/geysers')
export class GeyserController {
  constructor(private geyserService: GeyserService) {}

  @Get()
  @ContentType('json')
  async listFarms(@QueryParams('chain') chain?: ChainNetwork): Promise<Sett[]> {
    return this.geyserService.listFarms(Chain.getChain(chain));
  }
}
