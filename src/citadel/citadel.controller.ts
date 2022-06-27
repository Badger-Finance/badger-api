import { ChartTimeFrame, CitadelLeaderboardEntry, Currency, Network } from '@badger-dao/sdk';
import { CitadelSummary } from '@badger-dao/sdk/lib/api/interfaces/citadel-summary.interface';
import { CitadelTreasurySummary } from '@badger-dao/sdk/lib/api/interfaces/citadel-treasury-summary.interface';
import { RewardFilter } from '@badger-dao/sdk/lib/citadel/enums/reward-filter.enum';
import { Controller, Get, Inject, QueryParams, UseCache } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { ContentType, Description, Returns, Summary } from '@tsed/schema';

import { HistoricTreasurySummarySnapshot } from '../aws/models/historic-treasury-summary-snapshot.model';
import { Chain } from '../chains/config/chain.config';
import { TreasuryService } from '../treasury/treasury.service';
import { VaultModel } from '../vaults/interfaces/vault-model.interface';
import { VaultsService } from '../vaults/vaults.service';
import { CitadelService } from './citadel.service';
import { CITADEL_TREASURY_ADDRESS } from './config/citadel-treasury.config';
import { CitadelAccount } from './interfaces/citadel-account.interface';
import { CitadelRewardEvent } from './interfaces/citadel-reward-event.interface';
import { CitadelRewardEventModel } from './interfaces/citadel-reward-event-model.interface';
import { CitadelSummaryModel } from './interfaces/citadel-summary-model.interface';
import { CitadelTreasurySummaryModel } from './interfaces/citadel-treasury-summary-model.interface';
import { MetadataClient } from '@badger-dao/sdk/lib/registry.v2/enums/metadata.client.enum';

@Controller('/')
export class CitadelController {
  @Inject()
  citadelService!: CitadelService;

  @Inject()
  treasuryService!: TreasuryService;

  @Inject()
  vaultsService!: VaultsService;

  @UseCache()
  @Get('/treasury')
  @ContentType('json')
  @Summary('Citadel DAO Treasury Allocation and Metrics')
  @Description('Returns specific treasury metrics, positions, and yield')
  @Returns(200, CitadelTreasurySummaryModel)
  async loadCitadelTreasury(): Promise<CitadelTreasurySummary> {
    return this.citadelService.loadTreasurySummary();
  }

  @UseCache()
  @Get('/summary')
  @ContentType('json')
  @Summary('Protocol aggregate rewards information')
  @Description('Returns aggregate paid tokens and yield for staking or locking')
  @Returns(200, CitadelSummaryModel)
  async loadRewardsSummary(): Promise<CitadelSummary> {
    return this.citadelService.loadRewardSummary();
  }

  @Get('/rewards')
  @ContentType('json')
  @Summary('Added/paid rewards list')
  @Description('List of reward events')
  @Returns(200, Array).Of(CitadelRewardEventModel)
  @Returns(400).Description('Token should be specified')
  @Returns(400).Description('User or token param is missing')
  async loadRewardsList(
    @QueryParams('token') token?: string,
    @QueryParams('account') account?: string,
    @QueryParams('epoch') epoch?: number,
    @QueryParams('filter') filter?: RewardFilter,
  ): Promise<CitadelRewardEvent[]> {
    if (filter && !Object.values(RewardFilter).includes(filter)) {
      throw new NotFound(`Unknown filter ${filter}`);
    }

    return this.citadelService.getListRewards({ token, account, epoch, filter: filter ?? RewardFilter.ADDED });
  }

  @UseCache()
  @Get('/history')
  @ContentType('json')
  async loadCitadelTreasuryCharts(
    @QueryParams('timeframe') timeframe = ChartTimeFrame.Day,
  ): Promise<HistoricTreasurySummarySnapshot[]> {
    return this.treasuryService.loadTreasuryChartData(CITADEL_TREASURY_ADDRESS, timeframe);
  }

  @UseCache()
  @Get('/accounts')
  @ContentType('json')
  async loadCitadelAccount(@QueryParams('address') address: string): Promise<CitadelAccount> {
    return this.citadelService.loadAccount(address);
  }

  @UseCache()
  @Get('/leaderboard')
  @ContentType('json')
  async loadKnightingRoundLeaderboard(): Promise<CitadelLeaderboardEntry[]> {
    return this.citadelService.loadKnightingRoundLeaderboard();
  }

  @Get('/vaults')
  @ContentType('json')
  @Summary('Get a list of protocol vaults')
  @Description('Return a list of protocol vaults for the requested chain')
  @Returns(200, VaultModel)
  @Returns(400).Description('Not a valid chain')
  async listVaults(
    @QueryParams('chain') chain?: Network,
    @QueryParams('currency') currency?: Currency,
  ): Promise<VaultModel[]> {
    return this.vaultsService.listV3Vaults(Chain.getChain(chain), currency, MetadataClient.Citadel);
  }
}
