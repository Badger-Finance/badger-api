import { formatBalance, Vault__factory, VaultHarvestData } from '@badger-dao/sdk';
import { BadgerTreeDistribution_OrderBy, SettHarvest_OrderBy } from '@badger-dao/sdk/lib/graphql/generated/badger';
import { BigNumber, ethers } from 'ethers';

import { getDataMapper, getVaultEntityId } from '../aws/dynamodb.utils';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { VaultYieldEvent } from '../aws/models/vault-yield-event.model';
import { Chain } from '../chains/config/chain.config';
import { OrderDirection } from '../graphql/generated/balancer';
import { queryPriceAtTimestamp } from '../prices/prices.utils';
import { getFullToken } from '../tokens/tokens.utils';
import { YieldType } from './enums/yield-type.enum';
import { filterPerformanceItems, getInfuelnceVaultYieldBalance, isInfluenceVault } from './influence.utils';
import { YieldEvent } from './interfaces/yield-event';
import { VAULT_TWAY_DURATION } from './vaults.config';
import { calculateYield, constructGraphVaultData } from './yields.utils';

/**
 * Evaluate yield events to derivate base apr, and apy as well as apr of any emitted tokens.
 * @param chain network the vault is deployed on
 * @param vault vault requested yield event evaluation
 * @param yieldEvents events sourced from either on chain or the graph
 * @returns yield summary providing the base information for construction of yield sources
 */
async function evaluateHarvestData(
  chain: Chain,
  vault: VaultDefinitionModel,
  data: VaultHarvestData[],
): Promise<YieldEvent[]> {
  const sdk = await chain.getSdk();

  const recentHarvests = data.sort((a, b) => b.timestamp - a.timestamp);
  const allHarvests = recentHarvests.flatMap((h) => h.harvests.map((h) => ({ ...h, type: YieldType.Harvest })));
  const allDistributions = recentHarvests.flatMap((h) =>
    h.treeDistributions.map((d) => ({ ...d, type: YieldType.Distribution })),
  );
  const allEvents = allHarvests
    .concat(allDistributions)
    .filter((e) => BigNumber.from(e.amount).gt(ethers.constants.Zero))
    .sort((a, b) => b.timestamp - a.timestamp);

  const relevantPerformanceItems = filterPerformanceItems(vault, allEvents);

  const yieldEvents: YieldEvent[] = [];
  const tokenEmissionAprs = new Map<string, number>();
  for (const event of relevantPerformanceItems) {
    const block = event.block;
    const token = await getFullToken(chain, event.token);
    const amount = formatBalance(event.amount, token.decimals);
    const { price } = await queryPriceAtTimestamp(token.address, event.timestamp * 1000);

    const tokenEarned = price * amount;

    let balance = 0;
    if (isInfluenceVault(vault.address)) {
      balance = await getInfuelnceVaultYieldBalance(chain, vault, event.block);
    } else {
      const vaultContract = Vault__factory.connect(vault.address, sdk.provider);
      const totalSupply = await vaultContract.totalSupply({ blockTag: event.block });
      balance = formatBalance(totalSupply);
    }
    const { price: vaultPrice } = await queryPriceAtTimestamp(vault.address, event.timestamp * 1000);
    const vaultPrincipal = vaultPrice * balance;

    const eventApr = calculateYield(vaultPrincipal, tokenEarned, VAULT_TWAY_DURATION);
    const yieldEvent: YieldEvent = {
      block,
      timestamp: event.timestamp * 1000,
      amount,
      token: token.symbol,
      type: event.type,
      value: vaultPrincipal,
      balance,
      earned: tokenEarned,
      apr: eventApr,
    };
    yieldEvents.push(yieldEvent);

    if (event.type === YieldType.Distribution) {
      const entry = tokenEmissionAprs.get(token.address) ?? 0;
      tokenEmissionAprs.set(token.address, entry + eventApr);
    }
  }

  return yieldEvents;
}

async function loadGraphYieldData(
  chain: Chain,
  vault: VaultDefinitionModel,
  cutoff: number,
): Promise<VaultHarvestData[]> {
  const { graph } = await chain.getSdk();
  const { address } = vault;
  const [vaultHarvests, treeDistributions] = await Promise.all([
    graph.loadSettHarvests({
      first: 100,
      where: {
        sett: address.toLowerCase(),
        timestamp_gt: cutoff,
      },
      orderBy: SettHarvest_OrderBy.Timestamp,
      orderDirection: OrderDirection.Asc,
    }),
    graph.loadBadgerTreeDistributions({
      first: 100,
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
    });
    return data;
  } catch {
    return loadGraphYieldData(chain, vault, cutoff);
  }
}

export async function loadYieldEvents(
  chain: Chain,
  vault: VaultDefinitionModel,
  lastHarvestBlock: number,
): Promise<YieldEvent[]> {
  const { provider } = await chain.getSdk();
  const block = await provider.getBlock(lastHarvestBlock);
  const cutoff = block.timestamp;

  let data: VaultHarvestData[] = [];
  if (isInfluenceVault(vault.address)) {
    data = await loadGraphYieldData(chain, vault, cutoff);
  } else {
    data = await loadEventYieldData(chain, vault, lastHarvestBlock, cutoff);
  }

  return evaluateHarvestData(chain, vault, data);
}

export async function queryLastHarvestBlock(chain: Chain, vault: VaultDefinitionModel): Promise<number> {
  const mapper = getDataMapper();
  const id = getVaultEntityId(chain, vault);
  for await (const yieldEvent of mapper.query(VaultYieldEvent, { id }, { limit: 1, scanIndexForward: false })) {
    return yieldEvent.block;
  }
  return 0;
}

export async function queryVaultYieldEvents(chain: Chain, vault: VaultDefinitionModel): Promise<VaultYieldEvent[]> {
  const mapper = getDataMapper();
  const id = getVaultEntityId(chain, vault);
  const yieldEvents = [];
  for await (const yieldEvent of mapper.query(VaultYieldEvent, { id }, { limit: 1, scanIndexForward: false })) {
    yieldEvents.push(yieldEvent);
  }
  return yieldEvents;
}
