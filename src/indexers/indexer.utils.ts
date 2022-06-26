import { BadgerSDK, gqlGenT, RegistryVault, VaultSnapshot, VaultState, VaultVersion } from '@badger-dao/sdk';
import { NotFound } from '@tsed/exceptions';
import { ethers } from 'ethers';

import { VaultCompoundModel } from '../aws/models/vault-compound.model';
import { VaultTokenBalance } from '../aws/models/vault-token-balance.model';
import { Chain } from '../chains/config/chain.config';
import { getPrice } from '../prices/prices.utils';
import { getLiquidityData } from '../protocols/common/swap.utils';
import { SourceType } from '../rewards/enums/source-type.enum';
import { getFullTokens, toBalance } from '../tokens/tokens.utils';
import { Nullable } from '../utils/types.utils';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { VaultsService } from '../vaults/vaults.service';
import {
  getBoostWeight,
  getCachedVault,
  getStrategyInfo,
  getVaultCachedValueSources,
  getVaultPendingHarvest,
  VAULT_SOURCE,
} from '../vaults/vaults.utils';

export function chunkArray(addresses: string[], count: number): string[][] {
  const chunks: string[][] = [];
  const chunkSize = addresses.length / count;
  for (let i = 0; i < addresses.length; i += chunkSize) {
    chunks.push(addresses.slice(i, i + chunkSize));
  }
  return chunks;
}

export async function vaultToSnapshot(chain: Chain, vaultDefinition: VaultDefinition): Promise<VaultSnapshot> {
  const sdk = await chain.getSdk();
  const { address, totalSupply, balance, pricePerFullShare, available } = await sdk.vaults.loadVault({
    address: vaultDefinition.vaultToken,
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

export async function constructVaultModel(
  chain: Chain,
  sdk: BadgerSDK,
  vault: RegistryVault,
): Promise<Nullable<VaultCompoundModel>> {
  const { address, totalSupply, balance, pricePerFullShare, available } = vault;

  let vaultAddr;

  try {
    vaultAddr = ethers.utils.getAddress(address);
  } catch (_) {
    console.warn(`Invalid vault addr from onchain ${chain.name} registry`);
    return null;
  }

  const { sett } = await sdk.graph.loadSett({ id: vaultAddr.toLowerCase() });

  if (!sett) {
    console.warn(`Cant fetch vault data from The Graph for chain ${chain.name}, ${vaultAddr}`);
    return null;
  }

  let block = 0;
  try {
    block = await chain.provider.getBlockNumber();
  } catch (err) {} // block is not super important here - just continue on

  const vaultDefinition = {
    name: vault.name,
    version: vault.version,
    vaultToken: vault.address,
    depositToken: vault.token.address,
  };

  const [tokenPriceData, strategyInfo, boostWeight, sources, pendingHarvest] = await Promise.all([
    getPrice(vault.token.address),
    getStrategyInfo(chain, vaultDefinition),
    getBoostWeight(chain, vaultDefinition),
    getVaultCachedValueSources(vaultDefinition),
    getVaultPendingHarvest(vaultDefinition),
  ]);

  const baseSources = sources
    .filter((source) => source.apr >= 0.001)
    .filter((source) => {
      if (source.name !== VAULT_SOURCE) {
        return true;
      }
      return vault.state !== VaultState.Discontinued;
    });
  const sourcesApr = baseSources.filter(
    (source) => source.type !== SourceType.Compound && !source.type.includes('derivative'),
  );

  const apr = sourcesApr.map((s) => s.apr).reduce((total, apr) => (total += apr), 0);

  const value = balance * tokenPriceData.price;

  const vaultDTO = {
    value,
    balance,
    available,
    lastHarvest: pendingHarvest.lastHarvestedAt,
  };

  const { yieldApr, harvestApr } = VaultsService.getVaultYieldProjection(vaultDTO, pendingHarvest);

  return Object.assign(new VaultCompoundModel(), {
    address: vaultAddr,
    createdAt: sett.createdAt,
    chain: chain.network,
    isProduction: 1,
    verstion: vault.version,
    state: vault.state,
    name: vault.name,
    protocol: vault.metadata?.protocol || '',
    behavior: vault.metadata?.behavior || '',
    client: vault.metadata?.client || '',
    depositToken: vault.token,
    available,
    block,
    balance,
    strategyBalance: balance - available,
    totalSupply,
    pricePerFullShare,
    strategy: strategyInfo,
    boost: {
      enabled: boostWeight.toNumber() > 0,
      weight: boostWeight.toNumber(),
    },
    value: parseFloat(value.toFixed(2)),
    apr,
    yieldApr,
    harvestApr,
    updatedAt: sett.lastUpdatedAt,
    releasedAt: sett.releasedAt,
  });
}

export async function getLpTokenBalances(chain: Chain, vaultDefinition: VaultDefinition): Promise<VaultTokenBalance> {
  const { depositToken, vaultToken } = vaultDefinition;
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
      vault: vaultToken,
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
