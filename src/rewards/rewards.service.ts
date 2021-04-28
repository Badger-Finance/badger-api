import { Inject, Service } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { S3Service } from '../aws/s3.service';
import { CacheService } from '../cache/cache.service';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { rewardsLoggerAbi, rewardsLoggerAddress } from '../config/abi/rewards-logger.abi';
import { BOUNCER_PROOFS, ONE_YEAR_SECONDS, REWARD_DATA } from '../config/constants';
import { getPrice } from '../prices/prices.utils';
import { uniformPerformance } from '../protocols/interfaces/performance.interface';
import { ValueSource } from '../protocols/interfaces/value-source.interface';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { getCachcedSett } from '../setts/setts.utils';
import { getToken } from '../tokens/tokens.utils';
import { Eligibility } from './interfaces/eligibility.interface';
import {
  AirdropMerkleClaim,
  AirdropMerkleDistribution,
  RewardMerkleClaim,
  RewardMerkleDistribution,
} from './interfaces/merkle-distributor.interface';
import { UnlockSchedule } from './interfaces/unlock-schedule.interface';

@Service()
export class RewardsService {
  @Inject()
  s3Service!: S3Service;
  @Inject()
  cacheService!: CacheService;

  /**
   * Get airdrop merkle claim for a user.
   * @param airdrop Airdrop JSON filename.
   * @param address User Ethereum address.
   */
  async getUserAirdrop(airdrop: string, address: string): Promise<AirdropMerkleClaim> {
    const airdropFile = await this.s3Service.getObject(REWARD_DATA, airdrop);
    const fileContents: AirdropMerkleDistribution = JSON.parse(airdropFile.toString('utf-8'));
    const claim = fileContents.claims[address.toLowerCase()];
    if (!claim) {
      throw new NotFound(`${address} does not qualify for airdrop`);
    }
    return claim;
  }

  /**
   * Get airdrop merkle claim for a user.
   * @param airdrop Airdrop JSON filename.
   * @param address User Ethereum address.
   */
  async getBouncerProof(address: string): Promise<AirdropMerkleClaim> {
    const airdropFile = await this.s3Service.getObject(REWARD_DATA, BOUNCER_PROOFS);
    const fileContents: AirdropMerkleDistribution = JSON.parse(airdropFile.toString('utf-8'));
    const claim = fileContents.claims[ethers.utils.getAddress(address)];
    if (!claim) {
      throw new NotFound(`${address} is not on the bouncer list`);
    }
    return claim;
  }

  /**
   * Get badger tree reward merkle claim for a user.
   * @param address User Ethereum address.
   */
  async getUserRewards(address: string): Promise<RewardMerkleClaim> {
    const rewardFile = await this.s3Service.getObject(REWARD_DATA, 'badger-tree.json');
    const fileContents: RewardMerkleDistribution = JSON.parse(rewardFile.toString('utf-8'));
    const claim = fileContents.claims[address];
    if (!claim) {
      throw new NotFound(`${address} does not have claimable rewards.`);
    }
    return claim;
  }

  /**
   * Get badger shop eligibility for a user.
   * Returns 200 on eligible, 403 on not eligible.
   * @param address User Ethereum address.
   */
  async checkBouncerList(address: string): Promise<Eligibility> {
    let eligible = false;
    try {
      await this.getBouncerProof(address);
      eligible = true;
    } catch (err) {} // not found, not eligible
    return {
      isEligible: eligible,
    };
  }

  static async getRewardEmission(chain: Chain, settDefinition: SettDefinition): Promise<ValueSource[]> {
    if (chain.network !== ChainNetwork.Ethereum) {
      return [];
    }
    const { settToken } = settDefinition;
    const sett = await getCachcedSett(settDefinition);
    const rewardsLogger = new ethers.Contract(rewardsLoggerAddress, rewardsLoggerAbi, chain.provider);
    const unlockSchedules: UnlockSchedule[] = await rewardsLogger.getAllUnlockSchedulesFor(settToken);
    const emissionSources: ValueSource[] = [];
    for (const schedule of unlockSchedules) {
      const price = await getPrice(schedule.token);
      const token = getToken(schedule.token);
      const amount = parseFloat(ethers.utils.formatUnits(schedule.totalAmount, token.decimals));
      const durationScalar = ONE_YEAR_SECONDS / schedule.duration.toNumber();
      const yearlyEmission = price.usd * amount * durationScalar;
      const apr = yearlyEmission / sett.settValue * 100;
      console.log({ price, token, amount, value: sett.settValue, yearlyEmission });
      emissionSources.push({
        name: `${token.name} Rewards`,
        apy: apr,
        performance: uniformPerformance(apr),
      });
    }
    // console.log({ settToken, emissionSources });
    return emissionSources;
  }
}
