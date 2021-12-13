import BadgerSDK, { Network } from '@badger-dao/sdk';
import { AccountsService } from '../accounts/accounts.service';
import { getBoostFile, getCachedAccount } from '../accounts/accounts.utils';
import { getObject } from '../aws/s3.utils';
import { Chain } from '../chains/config/chain.config';
import { ONE_YEAR_SECONDS, REWARD_DATA } from '../config/constants';
import { TOKENS } from '../config/tokens.config';
import { valueSourceToCachedValueSource } from '../indexers/indexer.utils';
import { getPrice } from '../prices/prices.utils';
import { CachedValueSource } from '../protocols/interfaces/cached-value-source.interface';
import { uniformPerformance } from '../protocols/interfaces/performance.interface';
import { createValueSource } from '../protocols/interfaces/value-source.interface';
import { tokenEmission } from '../protocols/protocols.utils';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { getCachedSett } from '../vaults/vaults.utils';
import { Token } from '../tokens/interfaces/token.interface';
import { getToken } from '../tokens/tokens.utils';
import { RewardMerkleDistribution } from './interfaces/merkle-distributor.interface';
import { BadgerTree__factory } from '../contracts';
import { BigNumber } from '@ethersproject/bignumber';
import { UnprocessableEntity } from '@tsed/exceptions';

export async function getTreeDistribution(chain: Chain): Promise<RewardMerkleDistribution | null> {
  if (!chain.badgerTree) {
    return null;
  }
  const fileName = `badger-tree-${parseInt(chain.chainId, 16)}.json`;
  const rewardFile = await getObject(REWARD_DATA, fileName);
  return JSON.parse(rewardFile.toString('utf-8'));
}

export function noRewards(VaultDefinition: VaultDefinition, token: Token) {
  return valueSourceToCachedValueSource(
    createValueSource(`${token.symbol} Rewards`, uniformPerformance(0)),
    VaultDefinition,
    tokenEmission(token),
  );
}

export function getChainStartBlockKey(chain: Chain, block: number): string {
  return `${chain.network}_${block}`;
}

export function getClaimableRewards(
  chain: Chain,
  chainUsers: string[],
  distribution: RewardMerkleDistribution,
  blockNumber: number,
): Promise<[string, [string[], BigNumber[]]][]> {
  if (!chain.badgerTree) {
    throw new UnprocessableEntity(`No BadgerTree is available from ${chain.name}`);
  }
  const tree = BadgerTree__factory.connect(chain.badgerTree, chain.batchProvider);
  const requests = chainUsers.map(async (user): Promise<[string, [string[], BigNumber[]]]> => {
    const proof = distribution.claims[user];
    if (!proof) {
      return [user, [[], []]];
    }
    const result = await tree.getClaimableFor(user, proof.tokens, proof.cumulativeAmounts, { blockTag: blockNumber });
    return [user, result];
  });
  return Promise.all(requests);
}

export async function getRewardEmission(chain: Chain, VaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
  const boostFile = await getBoostFile(chain);
  if (!chain.rewardsLogger || VaultDefinition.depositToken === TOKENS.DIGG || !boostFile) {
    return [];
  }
  const { settToken } = VaultDefinition;
  const sett = await getCachedSett(VaultDefinition);
  if (sett.settToken === TOKENS.BICVX) {
    delete boostFile.multiplierData[sett.settToken];
  }
  const boostRange = boostFile.multiplierData[sett.settToken] ?? { min: 1, max: 1 };
  const sdk = new BadgerSDK(parseInt(chain.chainId, 16), chain.batchProvider);
  await sdk.ready();
  const activeSchedules = await sdk.rewards.loadActiveSchedules(settToken);

  // Badger controlled addresses are blacklisted from receiving rewards. We only dogfood on ETH
  let ignoredTVL = 0;
  if (chain.network === Network.Ethereum) {
    const blacklistedAccounts = await Promise.all([
      getCachedAccount('0xB65cef03b9B89f99517643226d76e286ee999e77'), // dev multisig
      getCachedAccount('0x86cbD0ce0c087b482782c181dA8d191De18C8275'), // tech ops multisig
      getCachedAccount('0x042B32Ac6b453485e357938bdC38e0340d4b9276'), // treasury ops multisig
      getCachedAccount('0xD0A7A8B98957b9CD3cFB9c0425AbE44551158e9e'), // treasury vault
    ]);
    const transformedAccounts = await Promise.all(
      blacklistedAccounts.map(async (a) => AccountsService.cachedAccountToAccount(chain, a)),
    );
    ignoredTVL = transformedAccounts
      .map((a) => a.data[sett.settToken])
      .map((s) => (s ? s.value : 0))
      .reduce((total, value) => total + value, 0);
  }

  /**
   * Calculate rewards emission percentages:
   *   - P: Price of Token
   *   - A: Amount of Token Emitted
   *   - D: Duration of Token Emission in Seconds
   *   - S: Number of Seconds Per Year
   *   - L: Amount of Value Locked in Sett
   *
   * Reward APR is determined by the extrapolated one year value emitted
   * from the unlock schedues as a percentage of the current locked value.
   *
   * APR = (P * A * (S / D)) / L * 100
   *
   * This vaule is calculated for all tokens emitted for any given sett
   * and persisted against that sett. There is a 20 minute grace period for
   * emission that have since ended, and only the latest active emission
   * will be used for yield calcuation.
   *
   */

  const emissionSources = [];
  for (const schedule of activeSchedules) {
    const [price, token] = await Promise.all([getPrice(schedule.token), getToken(schedule.token)]);
    const durationScalar = ONE_YEAR_SECONDS / (schedule.end - schedule.start);
    const yearlyEmission = price.usd * schedule.amount * durationScalar;
    const apr = (yearlyEmission / (sett.value - ignoredTVL)) * 100;
    let proRataAPR = apr;
    if (sett.boost.enabled && token.address === chain.getBadgerTokenAddress()) {
      const boostedAPR = (sett.boost.weight / 10_000) * proRataAPR;
      proRataAPR = proRataAPR - boostedAPR;
      const boostedSource = createValueSource(
        `Boosted ${token.name} Rewards`,
        uniformPerformance(boostedAPR),
        false,
        boostRange,
      );
      emissionSources.push(valueSourceToCachedValueSource(boostedSource, VaultDefinition, tokenEmission(token, true)));
    }
    const proRataSource = createValueSource(`${token.name} Rewards`, uniformPerformance(proRataAPR));
    emissionSources.push(valueSourceToCachedValueSource(proRataSource, VaultDefinition, tokenEmission(token)));
  }
  return emissionSources;
}
