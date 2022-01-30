import { TokenBalance } from '@badger-dao/sdk';
import { ethers } from '@badger-dao/sdk/node_modules/ethers';
import { Chain } from '../chains/config/chain.config';
import { getPrice } from '../prices/prices.utils';
import { uniformPerformance } from '../protocols/interfaces/performance.interface';
import { createValueSource } from '../protocols/interfaces/value-source.interface';
import { SourceType } from '../rewards/enums/source-type.enum';
import { valueSourceToCachedValueSource } from '../rewards/rewards.utils';
import { VaultDefinition } from './interfaces/vault-definition.interface';

export async function getVaultPerformance(chain: Chain, vaultDefinition: VaultDefinition) {
  const sdk = await chain.getSdk();
  const {
    currentBalance,
    historicBalance,
    expectedHarvestTimeDelta,
    expectedHarvestAssets,
    previousHarvest,
    previousHarvestTimeDelta,
    previousTreeDistribution,
    cumulativeHarvest,
    cumulativeHarvestTimeDelta,
    cumulativeTreeDistributions,
  } = await sdk.vaults.loadVaultPerformance(vaultDefinition.vaultToken);

  const depositTokenPrice = await getPrice(vaultDefinition.depositToken);
  const historicBalanceValue = depositTokenPrice.usd * historicBalance;
  const currentBalanceValue = depositTokenPrice.usd * currentBalance;

  const previousDistributions = await Promise.all(
    Object.entries(previousTreeDistribution).map(async (entry) => {
      const [rewardToken, amount] = entry;
      if (rewardToken === ethers.constants.AddressZero) {
        return 0;
      }
      const rewardTokenPrice = await getPrice(rewardToken);
      const distributionValue = rewardTokenPrice.usd * amount;
      return sdk.vaults.getVaultPerformance(distributionValue, historicBalanceValue, previousHarvestTimeDelta);
    }),
  );
  const previousDistributionPerformance = previousDistributions.reduce((total, value) => (total += value), 0);
  const previousPerformance = sdk.vaults.getVaultPerformance(previousHarvest, currentBalance, previousHarvestTimeDelta);
  const previousTotalPerformance = previousDistributionPerformance + previousPerformance;

  const cumulativeDistributions = await Promise.all(
    Object.entries(cumulativeTreeDistributions).map(async (entry) => {
      const [rewardToken, amount] = entry;
      const token = await sdk.tokens.loadToken(rewardToken);
      const rewardTokenPrice = await getPrice(rewardToken);
      const distributionValue = rewardTokenPrice.usd * amount;
      const distributionPerformance = sdk.vaults.getVaultPerformance(
        distributionValue,
        currentBalanceValue,
        cumulativeHarvestTimeDelta,
      );
      const distribution = createValueSource(
        `${token.name} Rewards`,
        uniformPerformance(distributionPerformance),
        true,
      );
      return valueSourceToCachedValueSource(distribution, vaultDefinition, SourceType.Emission);
    }),
  );
  const cumulativeDistributionPerformance = cumulativeDistributions
    .map((d) => d.apr)
    .reduce((total, value) => (total += value), 0);
  const cumulativePerfomance = sdk.vaults.getVaultPerformance(
    cumulativeHarvest,
    currentBalance,
    cumulativeHarvestTimeDelta,
  );
  const cumulativeTotalPerformance = cumulativeDistributionPerformance + cumulativePerfomance;

  const expectedHarvestTokens = await Promise.all(
    Object.entries(expectedHarvestAssets).map(async (entry): Promise<TokenBalance> => {
      const [rewardToken, amount] = entry;
      const tokenPrice = await getPrice(rewardToken);
      const rewardValue = tokenPrice.usd * amount;
      const token = await sdk.tokens.loadToken(rewardToken);
      return {
        ...token,
        balance: amount,
        value: rewardValue,
      };
    }),
  );
  const expectedHarvestValue = expectedHarvestTokens.map((t) => t.value).reduce((total, value) => (total += value), 0);
  const expectedPerfomance = sdk.vaults.getVaultPerformance(
    expectedHarvestValue,
    currentBalanceValue,
    expectedHarvestTimeDelta,
  );

  const timeDeltaWeight = previousHarvestTimeDelta + cumulativeHarvestTimeDelta;
  const totalWeightedPerformance =
    previousTotalPerformance * previousHarvestTimeDelta +
    cumulativeTotalPerformance * cumulativeHarvestTimeDelta +
    timeDeltaWeight * expectedPerfomance;
  const weightedPerformance = totalWeightedPerformance / (timeDeltaWeight * 2);

  console.log({
    previousTotalPerformance,
    cumulativeTotalPerformance,
    expectedPerfomance,
    weightedPerformance,
  });
}
