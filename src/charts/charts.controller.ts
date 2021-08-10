import { Controller, Get, Inject, QueryParams, UsePipe } from '@tsed/common';
import { NotFound, UnprocessableEntity } from '@tsed/exceptions';
import { ContentType, Hidden } from '@tsed/schema';
import { ethers } from 'ethers';
import { Chain } from '../chains/config/chain.config';
import { ValidationPipe } from '../common/decorators/validation-pipe';
import { SettSnapshot } from '../setts/interfaces/sett-snapshot.interface';
import { SettsService } from '../setts/setts.service';
import { getSettSnapshotsInRange } from '../setts/setts.utils';
import { ChartsQueryDto } from './dto/charts-query.dto';
import { ChartGranularity } from './enums/chart-granularity.enum';

@Controller('/charts')
export class ChartsController {
  @Inject()
  settsService!: SettsService;

  @Hidden()
  @Get()
  @ContentType('json')
  async getChart(
    @UsePipe(ValidationPipe)
    @QueryParams()
    query: ChartsQueryDto,
  ): Promise<SettSnapshot[]> {
    const now = new Date();
    const yesterday = new Date();
    yesterday.setHours(now.getHours() - 24);

    const {
      id: settToken,
      chain,
      start: queryStart,
      end: queryEnd,
      period = 1,
      granularity = ChartGranularity.HOUR,
    } = query;

    const start = queryStart ? new Date(queryStart) : yesterday;
    const end = queryEnd ? new Date(queryEnd) : now;

    const { isValid, error } = this.isValidGranularityPeriod(granularity, period, start, end);

    if (!isValid && error) {
      throw new UnprocessableEntity(error);
    }

    const checksumContract = ethers.utils.getAddress(settToken);
    const sett = Chain.getChain(chain).setts.find((sett) => sett.settToken === checksumContract);

    if (!sett) {
      throw new NotFound(`${checksumContract} is not a valid sett`);
    }

    return getSettSnapshotsInRange(sett, start, end);
  }

  private isValidGranularityPeriod(
    granularity: ChartGranularity,
    period: number,
    start: Date,
    end: Date,
  ): { isValid: boolean; error?: string } {
    const maxDataPointsToReturn = 50;

    if (start >= end) {
      return {
        isValid: false,
        error: '"start" must be strictly less than "end"',
      };
    }

    let returnedDataPoints: number;
    const diffInMs = new Date(end).getTime() - new Date(start).getTime();
    if (granularity === ChartGranularity.DAY) {
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      returnedDataPoints = Math.floor(diffInDays / period);
    } else {
      const diffInHours = diffInMs / (1000 * 60 * 60);
      returnedDataPoints = Math.floor(diffInHours / period);
    }

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
