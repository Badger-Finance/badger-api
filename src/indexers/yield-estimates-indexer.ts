import BadgerSDK, { ONE_DAY_MS, Protocol, TokenBalance, VaultState, VaultVersion } from '@badger-dao/sdk';
import {
  BadgerTreeDistribution_OrderBy,
  OrderDirection,
  SettHarvest_OrderBy,
} from '@badger-dao/sdk/lib/graphql/generated/badger';

import { getDataMapper } from '../aws/dynamodb.utils';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { YieldEstimate } from '../aws/models/yield-estimate.model';
import { getSupportedChains } from '../chains/chains.utils';
import { CachedTokenBalance } from '../tokens/interfaces/cached-token-balance.interface';
import { calculateBalanceDifference, toTokenValue } from '../tokens/tokens.utils';
import { VAULT_SOURCE } from '../vaults/vaults.config';
import { getCachedVault, queryYieldEstimate } from '../vaults/vaults.utils';

function toTableRow({ balance, symbol, value }: CachedTokenBalance) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return {
    name: symbol,
    amount: balance.toFixed(2),
    value: formatter.format(value),
  };
}

async function loadGraphTimestamp(sdk: BadgerSDK, vault: VaultDefinitionModel): Promise<number> {
  let lastHarvestedAt = 0;

  const { settHarvests } = await sdk.graph.loadSettHarvests({
    first: 1,
    where: {
      sett: vault.address.toLowerCase(),
    },
    orderBy: SettHarvest_OrderBy.Timestamp,
    orderDirection: OrderDirection.Desc,
  });
  const { badgerTreeDistributions } = await sdk.graph.loadBadgerTreeDistributions({
    first: 1,
    where: {
      sett: vault.address.toLowerCase(),
    },
    orderBy: BadgerTreeDistribution_OrderBy.Timestamp,
    orderDirection: OrderDirection.Desc,
  });

  if (settHarvests.length > 0) {
    lastHarvestedAt = settHarvests[0].timestamp * 1000;
  }
  if (badgerTreeDistributions.length > 0 && badgerTreeDistributions[0].timestamp > lastHarvestedAt) {
    lastHarvestedAt = badgerTreeDistributions[0].timestamp * 1000;
  }

  return lastHarvestedAt;
}

export async function refreshYieldEstimates() {
  const chains = getSupportedChains();
  const now = Date.now();

  for (const chain of chains) {
    const convert = async (t: TokenBalance) => toTokenValue(chain, t);
    const sdk = await chain.getSdk();
    const mapper = getDataMapper();
    const vaults = await chain.vaults.all();

    for (const vault of vaults) {
      if (vault.state === VaultState.Discontinued || vault.protocol !== Protocol.Aura) {
        continue;
      }

      const existingHarvest = await queryYieldEstimate(vault);
      const harvestData: YieldEstimate = {
        vault: vault.address,
        yieldTokens: [],
        harvestTokens: [],
        lastHarvestedAt: 0,
        previousYieldTokens: existingHarvest.yieldTokens,
        previousHarvestTokens: existingHarvest.harvestTokens,
        lastMeasuredAt: existingHarvest.lastMeasuredAt ?? 0,
        duration: existingHarvest.duration ?? Number.MAX_SAFE_INTEGER,
        lastReportedAt: existingHarvest.lastReportedAt ?? 0,
      };

      let shouldCheckGraph = true;

      if (vault.version === VaultVersion.v1_5) {
        try {
          const pendingHarvest = await sdk.vaults.getPendingHarvest(vault.address);

          harvestData.harvestTokens = await Promise.all(pendingHarvest.tokenRewards.map(convert));

          harvestData.lastHarvestedAt = pendingHarvest.lastHarvestedAt * 1000;
          shouldCheckGraph = false;
        } catch {
          if (now - ONE_DAY_MS > harvestData.lastReportedAt) {
            // TODO: enable once its not busted
            // sendPlainTextToDiscord(
            //   `${chain.network} ${vault.name} (${vault.protocol}, ${vault.version}, ${
            //     vault.state ?? VaultState.Open
            //   }) failed to harvest!`,
            // );
            harvestData.lastReportedAt = now;
          }
        }

        const pendingYield = await sdk.vaults.getPendingYield(vault.address);
        harvestData.yieldTokens = await Promise.all(pendingYield.tokenRewards.map(convert));
      }

      if (shouldCheckGraph) {
        harvestData.lastHarvestedAt = await loadGraphTimestamp(sdk, vault);
      }

      // a harvest happened since we last measured, all previous data is now invalid
      if (harvestData.lastHarvestedAt > harvestData.lastMeasuredAt) {
        harvestData.previousHarvestTokens = [];
        harvestData.previousYieldTokens = [];
      }

      const cachedVault = await getCachedVault(chain, vault);
      const {
        strategy: { performanceFee },
      } = cachedVault;
      // max fee bps is 10_000, this scales values by the remainder after fees
      const feeMultiplier = 1 - performanceFee / 10_000;
      const feeScalingFunction = (t: CachedTokenBalance) => {
        t.balance *= feeMultiplier;
        t.value *= feeMultiplier;
      };
      harvestData.harvestTokens.forEach(feeScalingFunction);
      harvestData.yieldTokens.forEach(feeScalingFunction);

      harvestData.harvestTokens.forEach((t) => {
        if (t.address === vault.depositToken) {
          t.name = VAULT_SOURCE;
        }
      });
      harvestData.duration = now - harvestData.lastMeasuredAt;
      harvestData.lastMeasuredAt = now;

      const harvestDifference = calculateBalanceDifference(
        harvestData.previousHarvestTokens,
        harvestData.harvestTokens,
      );
      const hasNegatives = harvestDifference.some((b) => b.balance < 0);

      // if the difference incur negative values due to slippage or otherwise, force a comparison against the full harvest
      if (hasNegatives) {
        harvestData.previousHarvestTokens = [];
      }

      console.log(`${vault.name} Yield Report`);
      console.log('Current Yield Tokens');
      console.table(harvestData.yieldTokens.map(toTableRow));
      console.log('Current Harvest Tokens');
      console.table(harvestData.harvestTokens.map(toTableRow));
      console.log('Previous Yield Tokens');
      console.table(harvestData.previousYieldTokens.map(toTableRow));
      console.log('Previous Harvest Tokens');
      console.table(harvestData.previousHarvestTokens.map(toTableRow));

      try {
        await mapper.put(Object.assign(new YieldEstimate(), harvestData));
      } catch (err) {
        console.error({ err, vault });
      }
    }
  }

  return 'done';
}
