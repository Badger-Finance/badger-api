import {
  BouncerType,
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
import { getStrategyInfoRfw } from '../vaults/vaults.utils';

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
    getStrategyInfoRfw(chain, vaultDefinition),
    sdk.rewards.getBoostWeight(vaultDefinition.address),
    VaultsService.loadVaultV3(chain, vaultDefinition),
  ]);

  const value = balance * tokenPriceData.price;
  const {
    yieldProjection: { yieldApr, harvestApr, nonHarvestApr },
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
    apr: cachedVault.apr.baseYield,
    grossApr: cachedVault.apr.grossYield,
    yieldApr: yieldApr + nonHarvestApr,
    harvestApr: harvestApr + nonHarvestApr,
  };
}

export async function constructVaultDefinition(
  chain: Chain,
  vault: RegistryVault,
  isProduction: boolean,
): Promise<Nullable<VaultDefinitionModel>> {
  const { address } = vault;

  const sdk = await chain.getSdk();
  const { sett } = await sdk.graph.loadSett({ id: address.toLowerCase() });

  if (!sett) {
    console.warn(`Can't fetch vault data from The Graph for chain ${chain.network}, ${address}`);
    return null;
  }

  const { createdAt, createdAtBlock, releasedAt, lastUpdatedAt } = sett;

  let lastHarvestIndexedBlock = Number(createdAtBlock);

  try {
    const existingDefinition = await chain.vaults.getVault(vault.address);
    if (existingDefinition.lastHarvestIndexedBlock && existingDefinition.lastHarvestIndexedBlock > createdAtBlock) {
      lastHarvestIndexedBlock = existingDefinition.lastHarvestIndexedBlock;
    }
  } catch {} // ignore errors for vaults who do not exist

  const definition: VaultDefinitionModel = {
    id: getVaultEntityId(chain, vault),
    address,
    // can be null for old from registryV1, legacy issue
    createdAt: !!createdAt ? Number(createdAt * 1000) : 0,
    chain: chain.network,
    isProduction: isProduction ? 1 : 0,
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
    lastHarvestIndexedBlock,
  };

  return Object.assign(new VaultDefinitionModel(), definition);
}
