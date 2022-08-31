import {
  BouncerType,
  gqlGenT,
  ONE_WEEK_SECONDS,
  Protocol,
  RegistryVault,
  VaultBehavior,
  VaultSnapshot,
  VaultState,
  VaultVersion,
} from '@badger-dao/sdk';

import { getVaultEntityId } from '../aws/dynamodb.utils';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { Chain } from '../chains/config/chain.config';
import { Stage } from '../config/enums/stage.enum';
import { queryPrice } from '../prices/prices.utils';
import { Nullable } from '../utils/types.utils';
import { VaultsService } from '../vaults/vaults.service';
import { getStrategyInfo } from '../vaults/vaults.utils';

export async function vaultToSnapshot(chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<VaultSnapshot> {
  const sdk = await chain.getSdk();
  const { address, totalSupply, balance, pricePerFullShare, available } = await sdk.vaults.loadVault({
    address: vaultDefinition.address,
    requireRegistry: false,
    state: VaultState.Open,
    version: vaultDefinition.version,
    update: true,
  });

  let block = 0;
  try {
    block = await chain.provider.getBlockNumber();
  } catch (err) {} // block is not super important here - just continue on

  const [tokenPriceData, strategyInfo, boostWeight, cachedVault] = await Promise.all([
    queryPrice(vaultDefinition.depositToken),
    getStrategyInfo(chain, vaultDefinition),
    sdk.rewards.getBoostWeight(vaultDefinition.address),
    VaultsService.loadVault(chain, vaultDefinition),
  ]);

  const value = balance * tokenPriceData.price;
  const {
    yieldProjection: { yieldPeriodApr, harvestPeriodApr, nonHarvestApr },
  } = cachedVault;

  return {
    block,
    timestamp: Date.now(),
    address,
    balance,
    strategyBalance: balance - available,
    pricePerFullShare,
    value: parseFloat(value.toFixed(2)),
    totalSupply,
    available,
    strategy: strategyInfo,
    boostWeight: boostWeight.toNumber(),
    apr: cachedVault.apr,
    yieldApr: yieldPeriodApr + nonHarvestApr,
    harvestApr: harvestPeriodApr + nonHarvestApr,
  };
}

export async function constructVaultDefinition(
  chain: Chain,
  vault: RegistryVault,
): Promise<Nullable<VaultDefinitionModel>> {
  const { address } = vault;

  const sdk = await chain.getSdk();
  const { sett } = await sdk.graph.loadSett({ id: address.toLowerCase() });

  if (!sett) {
    console.warn(`Cant fetch vault data from The Graph for chain ${chain.network}, ${address}`);
    return null;
  }

  const { createdAt, releasedAt, lastUpdatedAt } = sett;

  return Object.assign(new VaultDefinitionModel(), {
    id: getVaultEntityId(chain, vault),
    address,
    // can be null for old from registryV1, legacy issue
    createdAt: !!createdAt ? Number(createdAt) : null,
    chain: chain.network,
    isProduction: 1,
    version: vault.version as VaultVersion,
    state: vault.state,
    name: vault.metadata?.name || vault.name,
    protocol: (vault.metadata?.protocol as Protocol) || Protocol.Badger,
    behavior: (vault.metadata?.behavior as VaultBehavior) || VaultBehavior.None,
    client: vault.metadata?.client || '',
    depositToken: vault.token.address,
    updatedAt: Number(lastUpdatedAt),
    releasedAt: Number(releasedAt),
    stage: vault.state === VaultState.Experimental ? Stage.Staging : Stage.Production,
    bouncer: BouncerType.None,
    isNew: Date.now() / 1000 - Number(releasedAt) <= ONE_WEEK_SECONDS * 2,
  });
}

export async function getVault(chain: Chain, contract: string, block?: number): Promise<gqlGenT.SettQuery> {
  const sdk = await chain.getSdk();
  const settId = contract.toLowerCase();
  const vars = { id: settId };
  if (block) {
    return sdk.graph.loadSett({ ...vars, block: { number: block } });
  }
  return sdk.graph.loadSett(vars);
}
