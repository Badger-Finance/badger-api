import { greaterThanOrEqualTo, lessThan } from '@aws/dynamodb-expressions';
import { formatBalance, gqlGenT, keyBy, ONE_DAY_MS, VaultHarvestData, YieldEvent, YieldType } from '@badger-dao/sdk';
import { BadgerTreeDistribution_OrderBy, SettHarvest_OrderBy } from '@badger-dao/sdk/lib/graphql/generated/badger';
import { BigNumber, ethers } from 'ethers';

import { getDataMapper, getVaultEntityId } from '../aws/dynamodb.utils';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { VaultYieldEvent } from '../aws/models/vault-yield-event.model';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { OrderDirection } from '../graphql/generated/balancer';
import { queryPriceAtTimestamp } from '../prices/prices.utils';
import { getFullToken } from '../tokens/tokens.utils';
import { Nullable } from '../utils/types.utils';
import { getVaultHarvestBalance, isInfluenceVault } from './influence.utils';
import { VaultYieldItem } from './interfaces/vault-yield-item.interface';
import { VAULT_TWAY_DURATION } from './vaults.config';
import { getStrategyInfoRfw } from './vaults.utils';
import { calculateYield } from './yields.utils';

// this allows five chunks of 10k blocks per index, approx 2 week
export const HARVEST_SCAN_BLOCK_INCREMENT = 100_000;

function grabYieldGraphTx(graphTxId?: string): string {
  if (!graphTxId) {
    return '';
  }

  if (!graphTxId.includes('-')) {
    return graphTxId;
  }

  return graphTxId.split('-')[0];
}

/**
 * Modify subgraph response to match on chain event data allowing it to fit into our estimation functions.
 * @param vault vault requesting graph data transformation
 * @param harvests harvests data retrieved from the graph
 * @param distributions distribution data retrieved from the graph
 * @returns vault harvest data in the same form as delivered via event logs
 */
function constructGraphVaultData(
  vault: VaultDefinitionModel,
  harvests: gqlGenT.SettHarvestsQuery['settHarvests'],
  distributions: gqlGenT.BadgerTreeDistributionsQuery['badgerTreeDistributions'],
): VaultHarvestData[] {
  const harvestsByTimestamp = keyBy(harvests, (harvest) => harvest.timestamp);
  const treeDistributionsByTimestamp = keyBy(distributions, (distribution) => distribution.timestamp);
  const timestamps = Array.from(
    new Set([...harvestsByTimestamp.keys(), ...treeDistributionsByTimestamp.keys()]).values(),
  );
  return timestamps.map((t) => {
    const timestamp = Number(t);
    const currentHarvests = harvestsByTimestamp.get(timestamp) ?? [];
    const currentDistributions = treeDistributionsByTimestamp.get(timestamp) ?? [];
    return {
      timestamp,
      harvests: currentHarvests.map((h) => ({
        tx: grabYieldGraphTx(h.id),
        timestamp,
        block: Number(h.blockNumber),
        token: vault.depositToken,
        amount: h.amount,
      })),
      treeDistributions: currentDistributions.map((d) => {
        const tokenAddress = d.token.id.startsWith('0x0x') ? d.token.id.slice(2) : d.token.id;
        return {
          tx: grabYieldGraphTx(d.id),
          timestamp,
          block: Number(d.blockNumber),
          token: ethers.utils.getAddress(tokenAddress),
          amount: d.amount,
        };
      }),
    };
  });
}

/**
 *
 * @param data
 * @returns
 */
function constructYieldItems(data: VaultHarvestData[]): VaultYieldItem[] {
  const recentHarvests = data.sort((a, b) => b.timestamp - a.timestamp);
  const allHarvests = recentHarvests.flatMap((h) => h.harvests.map((h) => ({ ...h, type: YieldType.Harvest })));
  const allDistributions = recentHarvests.flatMap((h) =>
    h.treeDistributions.map((d) => ({ ...d, type: YieldType.TreeDistribution })),
  );
  return allHarvests
    .concat(allDistributions)
    .filter((e) => BigNumber.from(e.amount).gt(ethers.constants.Zero))
    .sort((a, b) => b.timestamp - a.timestamp);
}

function isIncentiveDistribution(vault: VaultDefinitionModel, event: VaultYieldItem): boolean {
  if (event.type !== YieldType.TreeDistribution) {
    return false;
  }
  if (event.token !== TOKENS.BADGER && event.token !== vault.address) {
    return false;
  }
  return true;
}

/**
 * Evaluate yield events to derivate base apr, and apy as well as apr of any emitted tokens.
 * @param chain network the vault is deployed on
 * @param vault vault requested yield event evaluation
 * @param yieldEvents events sourced from either on chain or the graph
 * @returns yield summary providing the base information for construction of yield sources
 */
async function evaluateYieldItems(
  chain: Chain,
  vault: VaultDefinitionModel,
  yieldItems: VaultYieldItem[],
): Promise<YieldEvent[]> {
  // dates return from the chain or graph are in seconds, and persisted in ms - convert here!
  yieldItems.forEach((i) => (i.timestamp *= 1000));
  const eventsByTimestamp = keyBy(yieldItems, (i) => i.timestamp);
  const eventTimestamps = Array.from(new Set(yieldItems.map((i) => i.timestamp))).sort((a, b) => a - b);

  if (eventTimestamps.length === 0) {
    return [];
  }

  const recentTimestamp = eventTimestamps[0];
  const lastEvent = await queryVaultPreviousYieldEvents(chain, vault, recentTimestamp);
  const baseEventTime = lastEvent ? lastEvent.timestamp : vault.createdAt;

  const isInfluence = isInfluenceVault(vault.address);
  // this is a special case, bvecvx at some point had harvests and they must be ignored!
  const ignoreHarvests = vault.address === TOKENS.BVECVX;

  const yieldEvents: YieldEvent[] = [];
  let previousTimestamp = baseEventTime;
  for (let i = 0; i < eventTimestamps.length; i++) {
    const currentTimestamp = eventTimestamps[i];

    const duration = currentTimestamp - previousTimestamp;
    const timestampYieldItems = eventsByTimestamp.get(currentTimestamp);
    if (timestampYieldItems) {
      for (const item of timestampYieldItems) {
        if (ignoreHarvests && item.type === YieldType.Harvest) {
          continue;
        }

        const block = item.block;
        const token = await getFullToken(chain, item.token);
        const amount = formatBalance(item.amount, token.decimals);
        const { price } = await queryPriceAtTimestamp(token.address, item.timestamp * 1000);

        const tokenEarned = price * amount;

        const balance = await getVaultHarvestBalance(chain, vault, item.block);
        const { price: vaultPrice } = await queryPriceAtTimestamp(vault.address, item.timestamp * 1000);
        const vaultPrincipal = vaultPrice * balance;
        const strategyInfo = await getStrategyInfoRfw(chain, vault, { blockTag: item.block });
        const performanceScalar = 1 / (1 - strategyInfo.performanceFee / 10_000);

        let eventDuration = duration;
        if (isInfluence && isIncentiveDistribution(vault, item)) {
          // TODO: codify this into influence configs or smth
          eventDuration = 14 * ONE_DAY_MS;
        } else if (currentTimestamp !== previousTimestamp) {
          previousTimestamp = currentTimestamp;
        }

        const eventApr = calculateYield(vaultPrincipal, tokenEarned, eventDuration);
        const yieldEvent: YieldEvent = {
          block,
          timestamp: item.timestamp,
          amount,
          duration: eventDuration,
          token: token.address,
          type: item.type,
          value: vaultPrincipal,
          balance,
          earned: tokenEarned,
          apr: eventApr,
          grossApr: eventApr * performanceScalar,
          tx: item.tx,
        };

        yieldEvents.push(yieldEvent);
      }
    }
  }

  return yieldEvents;
}

/**
 *
 * @param chain
 * @param vault
 * @param cutoff
 * @returns
 */
async function loadGraphYieldData(
  chain: Chain,
  vault: VaultDefinitionModel,
  cutoff: number,
): Promise<VaultHarvestData[]> {
  const { graph } = await chain.getSdk();
  const { address } = vault;
  const [vaultHarvests, treeDistributions] = await Promise.all([
    graph.loadSettHarvests({
      first: 25,
      where: {
        sett: address.toLowerCase(),
        timestamp_gt: cutoff,
      },
      orderBy: SettHarvest_OrderBy.Timestamp,
      orderDirection: OrderDirection.Asc,
    }),
    graph.loadBadgerTreeDistributions({
      first: 25,
      where: {
        sett: address.toLowerCase(),
        timestamp_gt: cutoff,
      },
      orderBy: BadgerTreeDistribution_OrderBy.Timestamp,
      orderDirection: OrderDirection.Asc,
    }),
  ]);
  const { settHarvests } = vaultHarvests;
  const { badgerTreeDistributions } = treeDistributions;
  return constructGraphVaultData(vault, settHarvests, badgerTreeDistributions);
}

/**
 *
 * @param chain
 * @param vault
 * @param lastHarvestBlock
 * @param cutoff
 * @returns
 */
async function loadEventYieldData(
  chain: Chain,
  vault: VaultDefinitionModel,
  lastHarvestBlock: number,
  cutoff: number,
): Promise<VaultHarvestData[]> {
  const { vaults } = await chain.getSdk();
  const { address, version } = vault;
  try {
    const { data } = await vaults.listHarvests({
      address,
      timestamp_gte: cutoff,
      version,
      startBlock: lastHarvestBlock,
      endBlock: lastHarvestBlock + HARVEST_SCAN_BLOCK_INCREMENT,
    });
    return data;
  } catch {
    return loadGraphYieldData(chain, vault, cutoff);
  }
}

/**
 *
 * @param chain
 * @param vault
 * @param lastHarvestBlock
 * @returns
 */
export async function loadYieldEvents(
  chain: Chain,
  vault: VaultDefinitionModel,
  lastHarvestBlock: number,
): Promise<YieldEvent[]> {
  const { provider } = await chain.getSdk();
  const block = await provider.getBlock(lastHarvestBlock);
  const cutoff = block.timestamp;

  let data: VaultHarvestData[] = [];

  try {
    data = await loadGraphYieldData(chain, vault, cutoff);
  } catch (err) {
    if (isInfluenceVault(vault.address)) {
      console.error(err);
      throw new Error(`Unable to load ${vault.name} yield events from TheGraph`);
    } else {
      data = await loadEventYieldData(chain, vault, lastHarvestBlock, cutoff);
    }
  }

  const yieldItems = constructYieldItems(data);
  return evaluateYieldItems(chain, vault, yieldItems);
}

/**
 *
 * @param chain
 * @param vault
 * @returns
 */
export async function queryVaultYieldEvents(chain: Chain, vault: VaultDefinitionModel): Promise<VaultYieldEvent[]> {
  const mapper = getDataMapper();
  const chainAddress = getVaultEntityId(chain, vault);
  const cutoff = Date.now() - VAULT_TWAY_DURATION;

  const yieldEvents = [];
  for await (const yieldEvent of mapper.query(
    VaultYieldEvent,
    { chainAddress, timestamp: greaterThanOrEqualTo(cutoff) },
    { indexName: 'IndexYieldDataOnAddress', scanIndexForward: false },
  )) {
    yieldEvents.push(yieldEvent);
  }
  return yieldEvents;
}

/**
 *
 * @param chain
 * @param vault
 * @returns
 */
export async function queryVaultPreviousYieldEvents(
  chain: Chain,
  vault: VaultDefinitionModel,
  timestamp: number,
): Promise<Nullable<VaultYieldEvent>> {
  const mapper = getDataMapper();
  const chainAddress = getVaultEntityId(chain, vault);
  for await (const yieldEvent of mapper.query(
    VaultYieldEvent,
    { chainAddress, timestamp: lessThan(timestamp) },
    { indexName: 'IndexYieldDataOnAddress', limit: 1, scanIndexForward: false },
  )) {
    return yieldEvent;
  }
  return null;
}

/**
 *
 * @param chain
 * @param vault
 * @returns
 */
export async function queryVaultHistoricYieldEvents(
  chain: Chain,
  vault: VaultDefinitionModel,
): Promise<VaultYieldEvent[]> {
  // TODO: construct a new paginated 'all harvests' table
  // allow for page queries, timestamp based page queries
  // all pages will be the same size, new pages are only added after x entries to a given page
  // we can follow similar to the charting pattern with this data
  const mapper = getDataMapper();
  const chainAddress = getVaultEntityId(chain, vault);

  const yieldEvents = [];
  for await (const yieldEvent of mapper.query(
    VaultYieldEvent,
    { chainAddress },
    { indexName: 'IndexYieldDataOnAddress', scanIndexForward: false },
  )) {
    yieldEvents.push(yieldEvent);
  }
  return yieldEvents;
}
