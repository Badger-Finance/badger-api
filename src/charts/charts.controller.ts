import { Controller, Get, Inject, QueryParams, UsePipe } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { ContentType } from '@tsed/schema';
import { ethers } from 'ethers';
import { Chain } from '../chains/config/chain.config';
import { ValidationPipe } from '../common/validation-pipe';
import { SettSnapshot } from '../setts/interfaces/sett-snapshot.interface';
import { SettsService } from '../setts/setts.service';
import { getSettSnapshots } from '../setts/setts.utils';
import { ChartsQueryDto } from './dto/charts-query.dto';

@Controller('/charts')
export class ChartsController {
  @Inject()
  settsService!: SettsService;

  @Get()
  @ContentType('json')
  async getChart(
    @UsePipe(ValidationPipe) @QueryParams() { id: settToken, chain }: ChartsQueryDto,
  ): Promise<SettSnapshot[]> {
    const checksumContract = ethers.utils.getAddress(settToken);
    const sett = Chain.getChain(chain).setts.find((sett) => sett.settToken === checksumContract);
    if (!sett) {
      throw new NotFound(`${checksumContract} is not a valid sett`);
    }
    return getSettSnapshots(sett);
  }
}
