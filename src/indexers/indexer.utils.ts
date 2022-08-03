import {
  BouncerType,
  gqlGenT,
  Protocol,
  RegistryVault,
  VaultBehavior,
  VaultSnapshot,
  VaultState,
  VaultVersion,
} from '@badger-dao/sdk';
import { NotFound } from '@tsed/exceptions';

import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { VaultTokenBalance } from '../aws/models/vault-token-balance.model';
import { Chain } from '../chains/config/chain.config';
import { ONE_WEEK_SECONDS } from '../config/constants';
import { Stage } from '../config/enums/stage.enum';
import { getPrice } from '../prices/prices.utils';
import { getLiquidityData } from '../protocols/common/swap.utils';
import { getFullTokens, toBalance } from '../tokens/tokens.utils';
import { Nullable } from '../utils/types.utils';
import { VaultsService } from '../vaults/vaults.service';
import { getBoostWeight, getCachedVault, getStrategyInfo } from '../vaults/vaults.utils';

export async function vaultToSnapshot(chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<VaultSnapshot> {
  const sdk = await chain.getSdk();
  const { address, totalSupply, balance, pricePerFullShare, available } = await sdk.vaults.loadVault({
    address: vaultDefinition.address,
    requireRegistry: false,
    state: VaultState.Open,
    version: vaultDefinition.version ?? VaultVersion.v1,
    update: true,
  });

  let block = 0;
  try {
    block = await chain.provider.getBlockNumber();
  } catch (err) {} // block is not super important here - just continue on

  const [tokenPriceData, strategyInfo, boostWeight, cachedVault] = await Promise.all([
    getPrice(vaultDefinition.depositToken),
    getStrategyInfo(chain, vaultDefinition),
    getBoostWeight(chain, vaultDefinition),
    VaultsService.loadVault(chain, vaultDefinition),
  ]);
  const value = balance * tokenPriceData.price;
  const {
    yieldProjection: { yieldApr, harvestApr },
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
    yieldApr,
    harvestApr,
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
    console.warn(`Cant fetch vault data from The Graph for chain ${chain.name}, ${address}`);
    return null;
  }

  let currentDefinition: Nullable<VaultDefinitionModel>;
  try {
    currentDefinition = await chain.vaults.getVault(vault.address);
  } catch {}

  const { createdAt, releasedAt, lastUpdatedAt } = sett;

  return Object.assign(new VaultDefinitionModel(), {
    id: `${chain.network}-${address}`,
    address,
    createdAt: Number(createdAt),
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
    isMigrating: currentDefinition ? currentDefinition.isMigrating : true,
    isNew: Date.now() / 1000 - Number(releasedAt) <= ONE_WEEK_SECONDS * 2,
  });
}

export async function getLpTokenBalances(
  chain: Chain,
  vaultDefinition: VaultDefinitionModel,
): Promise<VaultTokenBalance> {
  const { depositToken, address } = vaultDefinition;
  try {
    const liquidityData = await getLiquidityData(chain, depositToken);
    const { token0, token1, reserve0, reserve1, totalSupply } = liquidityData;
    const tokenData = await getFullTokens(chain, [token0, token1]);
    const t0Token = tokenData[token0];
    const t1Token = tokenData[token1];

    // poolData returns the full liquidity pool, valueScalar acts to calculate the portion within the sett
    const settSnapshot = await getCachedVault(chain, vaultDefinition);
    const valueScalar = totalSupply > 0 ? settSnapshot.balance / totalSupply : 0;
    const t0TokenBalance = reserve0 * valueScalar;
    const t1TokenBalance = reserve1 * valueScalar;
    const tokenBalances = await Promise.all([toBalance(t0Token, t0TokenBalance), toBalance(t1Token, t1TokenBalance)]);

    return Object.assign(new VaultTokenBalance(), {
      vault: address,
      tokenBalances,
    });
  } catch (err) {
    throw new NotFound(`${vaultDefinition.protocol} pool pair ${depositToken} does not exist`);
  }
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
