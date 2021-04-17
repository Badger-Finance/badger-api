import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { ContentType } from '@tsed/schema';
import { ethers } from 'ethers';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { SettSnapshot } from '../setts/interfaces/sett-snapshot.interface';
import { SettsService } from '../setts/setts.service';
import { getSettSnapshots } from '../setts/setts.utils';

@Controller('/charts')
export class ChartsController {
  @Inject()
  settsService!: SettsService;

  @Get()
  @ContentType('json')
  getChart(
    @QueryParams('id') settToken: string,
    // @QueryParams('count') count?: number,
    @QueryParams('chain') chain?: ChainNetwork,
  ): Promise<SettSnapshot[]> {
    const checksumContract = ethers.utils.getAddress(settToken);
    const sett = Chain.getChain(chain).setts.find((sett) => sett.settToken === checksumContract);
    if (!sett) {
      throw new NotFound(`${checksumContract} is not a valid sett`);
    }
    return getSettSnapshots(sett);
  }
}
