import { Controller, Get, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { Network } from '../chains/enums/chain-network.enum';
import { Sett } from '../interface/Sett';
import { GeyserService } from './GeysersService';

@Controller('/geysers')
export class GeyserController {
  constructor(private geyserService: GeyserService) {}

  @Get()
  @ContentType('json')
  async listFarms(@QueryParams('chain') chain?: Network): Promise<Sett[]> {
    return this.geyserService.listFarms(Chain.getChain(chain));
  }
}
