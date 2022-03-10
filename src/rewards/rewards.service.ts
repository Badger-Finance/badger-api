import { Service } from '@tsed/common';
import { BadRequest, NotFound } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { getObject } from '../aws/s3.utils';

import { Chain } from '../chains/config/chain.config';
import { REWARD_DATA } from '../config/constants';

import { getRewardSchedules, getRewordLoggerInst, getTreeDistribution } from './rewards.utils';

import { AirdropMerkleClaim, AirdropMerkleDistribution } from './interfaces/merkle-distributor.interface';
import { RewardMerkleClaim } from './interfaces/reward-merkle-claim.interface';
import { RewardSchedulesByVault, RewardSchedulesByVaults } from './interfaces/reward-schedules-vault.interface';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';

@Service()
export class RewardsService {
  /**
   * Get airdrop merkle claim for a user.
   * @param airdrop Airdrop JSON filename.
   * @param address User Ethereum address.
   */
  async getBouncerProof(chain: Chain, address: string): Promise<AirdropMerkleClaim> {
    const fileName = `badger-bouncer-${parseInt(chain.chainId)}.json`;
    const airdropFile = await getObject(REWARD_DATA, fileName);
    const fileContents: AirdropMerkleDistribution = JSON.parse(airdropFile.toString('utf-8'));
    const claim = fileContents.claims[address.toLowerCase()] || fileContents.claims[ethers.utils.getAddress(address)];
    if (!claim) {
      throw new NotFound(`${address} is not on the bouncer list`);
    }
    return claim;
  }

  /**
   * Get badger tree reward merkle claim for a user.
   * @param address User Ethereum address.
   */
  async getUserRewards(chain: Chain, address: string): Promise<RewardMerkleClaim> {
    const treeDistribution = await getTreeDistribution(chain);
    if (!treeDistribution) {
      throw new BadRequest(`${chain.name} does not support claimable rewards.`);
    }
    const claim = treeDistribution.claims[address];
    if (!claim) {
      throw new NotFound(`${address} does not have claimable rewards.`);
    }
    return claim;
  }

  /**
   * Get all token rewards emmited, by vault
   * @param chain Network chain obj
   * @param address Vault token adress
   */
  async rewardSchedulesByVault(chain: Chain, address: VaultDefinition['vaultToken']): Promise<RewardSchedulesByVault> {
    const rewardsLogger = getRewordLoggerInst(chain);

    if (!rewardsLogger) throw new NotFound(`No rewards token emission data for network ${Chain.name}`);

    const vault = chain.vaults.find((v) => v.vaultToken === address);

    if (!vault || !vault?.vaultToken) throw new NotFound(`Unknown vault ${address}`);

    return {
      schedules: await getRewardSchedules(chain, vault.vaultToken, rewardsLogger),
    };
  }

  /**
   * Get all token rewards emmited, by all vaults
   */
  async rewardSchedulesVaultsList(chain: Chain): Promise<RewardSchedulesByVaults> {
    const rewardsLogger = getRewordLoggerInst(chain);

    if (!rewardsLogger) throw new NotFound(`No rewards token emission data for network ${Chain.name}`);

    const vaultsSchedules = await Promise.all(
      chain.vaults.map(async (vault) => {
        if (!vault.vaultToken) return [];

        return getRewardSchedules(chain, vault.vaultToken, rewardsLogger);
      }),
    );

    return vaultsSchedules.reduce((acc: RewardSchedulesByVaults, vaultSchedules) => {
      if (!vaultSchedules || vaultSchedules?.length === 0) return acc;

      const [firstVaultSchedule] = vaultSchedules;

      acc[firstVaultSchedule.vault] = vaultSchedules;

      return acc;
    }, {});
  }
}
