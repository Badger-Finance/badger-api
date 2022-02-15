import { Controller, Get, Inject, QueryParams, UsePipe } from '@tsed/common';
import { NotFound, UnprocessableEntity } from '@tsed/exceptions';
import { ContentType, Hidden } from '@tsed/schema';
import { ethers } from 'ethers';
import { Chain } from '../chains/config/chain.config';
import { ValidationPipe } from '../common/decorators/validation-pipe';
import { VaultSnapshot } from '../vaults/interfaces/vault-snapshot.interface';
import { ChartsService } from './charts.service';
import { ChartsQueryDto } from './dto/charts-query.dto';
import { ChartGranularity } from './enums/chart-granularity.enum';

@Controller('/charts')
export class ChartsController {
  @Inject()
  chartsService!: ChartsService;

  @Hidden()
  @Get()
  @ContentType('json')
  async getChart(
    @UsePipe(ValidationPipe)
    @QueryParams()
    query: ChartsQueryDto,
  ): Promise<VaultSnapshot[]> {
    const now = new Date();
    const yesterday = new Date();
    yesterday.setHours(now.getHours() - 24);

    const {
      id: settToken,
      chain,
      start = yesterday,
      end = now,
      period = 1,
      granularity = ChartGranularity.HOUR,
    } = query;

    const { isValid, error } = this.isValidGranularityPeriod(start, end, granularity, period);

    if (!isValid && error) {
      throw new UnprocessableEntity(error);
    }

    let checksumContract = settToken;
    try {
      checksumContract = ethers.utils.getAddress(settToken);
    } catch (err) {
      throw new UnprocessableEntity('Invalid contract address');
    }

    const vault = Chain.getChain(chain).vaults.find((vault) => vault.vaultToken === checksumContract);

    if (!vault) {
      throw new NotFound(`${checksumContract} is not a valid sett`);
    }

    return this.chartsService.getChartData(vault, start, end, granularity, period);
  }

  private isValidGranularityPeriod(
    start: Date,
    end: Date,
    granularity: ChartGranularity,
    period: number,
  ): { isValid: boolean; error?: string } {
    const maxDataPointsToReturn = 50;

    if (start >= end) {
      return {
        isValid: false,
        error: '"start" must be strictly less than "end"',
      };
    }

    const returnedDataPoints = ChartsService.getRequestedDataPoints(start, end, granularity, period);
    if (returnedDataPoints > maxDataPointsToReturn) {
      return {
        isValid: false,
        error: 'Too many data points to return. Increase the period or shorten the time range.',
      };
    }

    return {
      isValid: true,
    };
  }
}
