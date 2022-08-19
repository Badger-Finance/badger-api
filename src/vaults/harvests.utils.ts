import {
  formatBalance,
  HarvestType,
  ListHarvestOptions,
  ONE_YEAR_SECONDS,
  VaultHarvestData,
  VaultPerformanceEvent,
} from '@badger-dao/sdk';
import { BigNumber } from 'ethers';

import { getDataMapper } from '../aws/dynamodb.utils';
import { HarvestCompoundData } from '../aws/models/harvest-compound.model';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { Chain } from '../chains/config/chain.config';
import { getFullToken } from '../tokens/tokens.utils';
import { Nullable } from '../utils/types.utils';
import { VaultHarvestsExtendedResp } from './interfaces/vault-harvest-extended-resp.interface';

export async function estimateHarvestEventApr(
  chain: Chain,
  token: VaultPerformanceEvent['token'],
  start: number,
  end: number,
  amount: VaultPerformanceEvent['amount'],
  balance: BigNumber,
): Promise<number> {
  const duration = end - start;

  const depositToken = await getFullToken(chain, token);

  const fmtBalance = formatBalance(balance, depositToken.decimals);

  const totalHarvestedTokens = formatBalance(amount || BigNumber.from(0), depositToken.decimals);
  const durationScalar = ONE_YEAR_SECONDS / duration;

  const compoundApr = (totalHarvestedTokens / fmtBalance) * durationScalar * 100;

  return parseFloat(compoundApr.toFixed(2));
}

export async function getVaultHarvestsOnChain(
  chain: Chain,
  address: VaultDefinitionModel['address'],
  startFromBlock: Nullable<number> = null,
): Promise<VaultHarvestsExtendedResp[]> {
  const vaultHarvests: VaultHarvestsExtendedResp[] = [];

  const sdk = await chain.getSdk();
  const { version, depositToken } = await chain.vaults.getVault(address);

  let sdkVaultHarvestsResp: {
    data: VaultHarvestData[];
  } = { data: [] };

  try {
    const listHarvestsArgs: ListHarvestOptions = {
      address,
      version,
    };

    if (startFromBlock) listHarvestsArgs.startBlock = startFromBlock;

    sdkVaultHarvestsResp = await sdk.vaults.listHarvests(listHarvestsArgs);
  } catch (e) {
    console.warn(`Failed to get harvests list ${e}`);
  }

  if (!sdkVaultHarvestsResp || sdkVaultHarvestsResp?.data?.length === 0) {
    return vaultHarvests;
  }

  const sdkVaultHarvests = sdkVaultHarvestsResp.data;

  const harvestsStartEndMap: Record<string, number> = {};

  const _extend_harvests_data = async (harvestsList: VaultPerformanceEvent[], eventType: HarvestType) => {
    if (!harvestsList || harvestsList?.length === 0) return;

    for (let i = 0; i < harvestsList.length; i++) {
      const harvest = harvestsList[i];

      const vaultGraph = await sdk.graph.loadSett({
        id: address.toLowerCase(),
        block: { number: harvest.block },
      });

      const harvestToken = harvest.token || depositToken;

      const depositTokenInfo = await getFullToken(chain, harvestToken);

      const harvestAmount = formatBalance(harvest.amount || BigNumber.from(0), depositTokenInfo.decimals);

      const extendedHarvest = {
        ...harvest,
        token: harvestToken,
        amount: harvestAmount,
        eventType,
        strategyBalance: 0,
        estimatedApr: 0,
      };

      if (vaultGraph?.sett) {
        const balance = BigNumber.from(vaultGraph.sett?.strategy?.balance || vaultGraph.sett.balance || 0);

        extendedHarvest.strategyBalance = formatBalance(balance, depositTokenInfo.decimals);

        if (i === harvestsList.length - 1 && eventType === HarvestType.Harvest) {
          vaultHarvests.push(extendedHarvest);
          continue;
        }

        const startOfHarvest = harvest.timestamp;
        let endOfCurrentHarvest: Nullable<number>;

        if (eventType === HarvestType.Harvest) {
          endOfCurrentHarvest = harvestsList[i + 1].timestamp;
          harvestsStartEndMap[`${startOfHarvest}`] = endOfCurrentHarvest;
        } else if (eventType === HarvestType.TreeDistribution) {
          endOfCurrentHarvest = harvestsStartEndMap[`${harvest.timestamp}`];
        }

        if (endOfCurrentHarvest) {
          extendedHarvest.estimatedApr = await estimateHarvestEventApr(
            chain,
            harvestToken,
            startOfHarvest,
            endOfCurrentHarvest,
            harvest.amount,
            balance,
          );
        }
      }

      vaultHarvests.push(extendedHarvest);
    }
  };

  const allHarvests = sdkVaultHarvests.flatMap((h) => h.harvests).sort((a, b) => a.timestamp - b.timestamp);
  const allTreeDistributions = sdkVaultHarvests
    .flatMap((h) => h.treeDistributions)
    .sort((a, b) => a.timestamp - b.timestamp);

  await _extend_harvests_data(allHarvests, HarvestType.Harvest);
  await _extend_harvests_data(allTreeDistributions, HarvestType.TreeDistribution);

  return vaultHarvests;
}

export async function getLastCompoundHarvest(vault: string): Promise<Nullable<HarvestCompoundData>> {
  const mapper = getDataMapper();
  const query = mapper.query(HarvestCompoundData, { vault }, { limit: 1, scanIndexForward: false });

  let lastHarvest = null;

  try {
    for await (const harvest of query) {
      lastHarvest = harvest;
    }
  } catch (e) {
    console.error(`Failed to get compound harvest from ddb for vault: ${vault}; ${e}`);
  }

  return lastHarvest;
}
