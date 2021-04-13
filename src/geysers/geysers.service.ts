import { Inject, Service } from '@tsed/common';
import { BigNumber, constants, ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import { CacheService } from '../cache/CacheService';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { diggAbi, geyserAbi } from '../config/abi/abi';
import { BADGER_URL, TOKENS } from '../config/constants';
import { secondToDay, toRate } from '../config/util';
import { getSdk, OrderDirection, Sdk as BadgerGraphqlSdk } from '../graphql/generated/badger';
import { Emission, Geyser, UnlockSchedule } from '../interface/Geyser';
import { PricesService } from '../prices/prices.service';
import { ValueSource } from '../protocols/interfaces/value-source.interface';
import { Sett } from '../setts/interfaces/sett.interface.';
import { SettsService } from '../setts/setts.service';
import { TokensService } from '../tokens/tokens.service';
import { getToken } from '../tokens/tokens-util';

/**
 * TODO: Remove geysers service + geysers controller once they are
 * removed from the protocol.
 */
@Service()
export class GeyserService {
  @Inject()
  settsService!: SettsService;
  @Inject()
  tokensService!: TokensService;
  @Inject()
  pricesService!: PricesService;
  @Inject()
  cacheService!: CacheService;

  private badgerGraphqlSdk: BadgerGraphqlSdk;

  constructor() {
    const badgerDaoGraphqlClient = new GraphQLClient(BADGER_URL);
    this.badgerGraphqlSdk = getSdk(badgerDaoGraphqlClient);
  }

  async listFarms(chain: Chain): Promise<Sett[]> {
    const provider = Chain.getChain(ChainNetwork.Ethereum).provider;
    const diggContract = new ethers.Contract(TOKENS.DIGG, diggAbi, provider);

    const sharesKey = CacheService.getCacheKey('sharesPerFragment');
    const cachedSharesPerFragment = this.cacheService.get<BigNumber>(sharesKey);

    let sharesPerFragment: BigNumber;
    if (!cachedSharesPerFragment) {
      sharesPerFragment = await diggContract._sharesPerFragment();
      this.cacheService.set(sharesKey, sharesPerFragment);
    } else {
      sharesPerFragment = cachedSharesPerFragment;
    }

    const [settData, geyserData] = await Promise.all([
      this.settsService.listSetts(chain),
      this.badgerGraphqlSdk.GeysersAndSetts({
        geysersOrderDirection: OrderDirection.Asc,
        settsOrderDirection: OrderDirection.Asc,
      }),
    ]);
    const { geysers, setts } = geyserData;

    await Promise.all(
      geysers.map(async (geyser) => {
        const sett = setts.find((geyserSett) => geyserSett.id === geyser.stakingToken.id);
        const settLink = chain.setts.find((s) => s.geyserAddress && s.geyserAddress === geyser.id);
        const settInfo = settData.find((s) => s.asset.toLowerCase() === settLink?.symbol.toLowerCase());
        if (!sett || !settLink || !settInfo) return;

        // Collect Geyser Information
        const geyserToken = sett.token.id;
        const pricePerFullShare = sett.pricePerFullShare / 1e18;
        const geyserDeposits = (geyser.netShareDeposit * pricePerFullShare) / 1e18;
        const geyserDepositsValue = await this.pricesService.getValue(geyserToken, geyserDeposits);
        const geyserData = await this.getGeyserData(geyser.id, sharesPerFragment);
        const [badgerEmissionData, diggEmissionData] = geyserData.emissions;
        const emissionSources = [] as ValueSource[];

        // Calculate Emission Values
        if (badgerEmissionData) {
          const badgerUnlockSchedule = badgerEmissionData.unlockSchedule;
          const badgerAmount = ethers.utils.formatUnits(
            badgerUnlockSchedule.initialLocked.mul(1000).div(constants.WeiPerEther),
            3,
          );
          const badgerEmitted = parseFloat(badgerAmount);
          const badgerEmissionDuration = badgerUnlockSchedule.endAtSec.sub(badgerUnlockSchedule.startTime).toNumber();
          const badgerEmissionValue = await this.pricesService.getValue(TOKENS.BADGER, badgerEmitted);
          const badgerEmissionValueRate = toRate(badgerEmissionValue, badgerEmissionDuration);
          const badgerApy = ((secondToDay(badgerEmissionValueRate) * 365) / geyserDepositsValue) * 100;
          if (badgerApy > 0) {
            // Emission value is constant, so performance values a identical for every sample
            const badgerSource: ValueSource = {
              name: 'Badger Rewards',
              apy: badgerApy,
              performance: {
                oneDay: badgerApy,
                threeDay: badgerApy,
                sevenDay: badgerApy,
                thirtyDay: badgerApy,
              },
            };
            emissionSources.push(badgerSource);
          }
        }

        if (diggEmissionData) {
          const diggUnlockSchedule = diggEmissionData.unlockSchedule;
          const diggAmount = ethers.utils.formatUnits(diggUnlockSchedule.initialLocked.mul(1000).div(1e9), 3);
          const diggEmitted = parseFloat(diggAmount);
          const diggEmissionDuration = diggUnlockSchedule.endAtSec.sub(diggUnlockSchedule.startTime).toNumber();
          const diggEmissionValue = await this.pricesService.getValue(TOKENS.DIGG, diggEmitted);
          const diggEmissionValueRate = toRate(diggEmissionValue, diggEmissionDuration);
          const diggApy = ((secondToDay(diggEmissionValueRate) * 365) / geyserDepositsValue) * 100;
          if (diggApy > 0) {
            const diggSource: ValueSource = {
              name: 'Digg Rewards',
              apy: diggApy,
              performance: {
                oneDay: diggApy,
                threeDay: diggApy,
                sevenDay: diggApy,
                thirtyDay: diggApy,
              },
            };
            emissionSources.push(diggSource);
          }
        }

        settInfo.value = geyserDepositsValue;
        settInfo.sources = settInfo.sources.concat(emissionSources);
        settInfo.apy = settInfo.sources.map((s) => s.apy).reduce((total, apy) => (total += apy));
      }),
    );

    return settData;
  }

  async loadUnlockSchedule(geyser: string, token: string): Promise<UnlockSchedule[]> {
    const provider = Chain.getChain(ChainNetwork.Ethereum).provider;
    const geyserContract = new ethers.Contract(geyser, geyserAbi, provider);
    const cacheKey = CacheService.getCacheKey(geyser, token);
    const cachedData = this.cacheService.get<UnlockSchedule[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const unlockSchedules = await geyserContract.getUnlockSchedulesFor(token);
    this.cacheService.set(cacheKey, unlockSchedules);
    return unlockSchedules;
  }

  async getGeyserData(geyser: string, sharesPerFragment: BigNumber): Promise<Geyser> {
    const [badgerUnlockSchedules, diggUnlockSchedules] = await Promise.all([
      this.loadUnlockSchedule(geyser, TOKENS.BADGER),
      this.loadUnlockSchedule(geyser, TOKENS.DIGG),
    ]);

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 2);
    const cutoffSecs = parseInt((cutoff.getTime() / 1000).toString());

    let badgerEmission: Emission | undefined = undefined;
    if (badgerUnlockSchedules.length > 0) {
      const badgerUnlock = badgerUnlockSchedules[badgerUnlockSchedules.length - 1];
      if (badgerUnlock.endAtSec.gte(cutoffSecs)) {
        badgerEmission = {
          token: getToken(TOKENS.BADGER),
          unlockSchedule: {
            startTime: badgerUnlock.startTime,
            endAtSec: badgerUnlock.endAtSec,
            durationSec: badgerUnlock.durationSec,
            initialLocked: badgerUnlock.initialLocked,
          },
        };
      }
    }

    let diggEmission: Emission | undefined = undefined;
    if (diggUnlockSchedules.length > 0) {
      const diggUnlock = diggUnlockSchedules[diggUnlockSchedules.length - 1];
      if (diggUnlock.endAtSec.gte(cutoffSecs)) {
        diggEmission = {
          token: getToken(TOKENS.DIGG),
          unlockSchedule: {
            startTime: diggUnlock.startTime,
            endAtSec: diggUnlock.endAtSec,
            durationSec: diggUnlock.durationSec,
            initialLocked: diggUnlock.initialLocked.div(sharesPerFragment),
          },
        };
      }
    }
    return {
      emissions: [badgerEmission, diggEmission],
    };
  }
}
