import { between } from '@aws/dynamodb-expressions';
import { BadRequest, NotFound, UnprocessableEntity } from '@tsed/exceptions';
import { BigNumber, ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { CURRENT, ONE_DAY_MS, ONE_YEAR_MS, ONE_YEAR_SECONDS, SAMPLE_DAYS } from '../config/constants';
import { getSdk, SettQuery } from '../graphql/generated/badger';
import { BouncerType } from '../rewards/enums/bouncer-type.enum';
import { formatBalance, getToken } from '../tokens/tokens.utils';
import { CachedSettSnapshot } from './interfaces/cached-sett-snapshot.interface';
import { VaultDefinition } from './interfaces/vault-definition.interface';
import { VaultSnapshot } from './interfaces/vault-snapshot.interface';
import { Sett__factory, Controller__factory, Strategy__factory, EmissionControl__factory } from '../contracts';
import { VaultStrategy } from './interfaces/vault-strategy.interface';
import { TOKENS } from '../config/tokens.config';
import { Protocol, Vault, VaultState, VaultType } from '@badger-dao/sdk';
import { getPrice } from '../prices/prices.utils';
import { TokenPrice } from '../prices/interface/token-price.interface';
import { PricingType } from '../prices/enums/pricing-type.enum';
import { CachedValueSource } from '../protocols/interfaces/cached-value-source.interface';
import { createValueSource } from '../protocols/interfaces/value-source.interface';
import { uniformPerformance } from '../protocols/interfaces/performance.interface';
import { getProtocolValueSources, getRewardEmission, valueSourceToCachedValueSource } from '../rewards/rewards.utils';
import { SourceType } from '../rewards/enums/source-type.enum';
import { tokenEmission } from '../protocols/protocols.utils';
import { SOURCE_TIME_FRAMES, updatePerformance } from '../rewards/enums/source-timeframe.enum';

export const VAULT_SOURCE = 'Vault Compounding';

export function defaultVault(vaultDefinition: VaultDefinition): Vault {
  const assetToken = getToken(vaultDefinition.depositToken);
  const vaultToken = getToken(vaultDefinition.vaultToken);
  return {
    asset: assetToken.symbol,
    apr: 0,
    available: 0,
    balance: 0,
    boost: {
      enabled: false,
      weight: 0,
    },
    bouncer: vaultDefinition.bouncer ?? BouncerType.None,
    name: vaultDefinition.name,
    protocol: Protocol.Badger,
    pricePerFullShare: 1,
    sources: [],
    state: vaultDefinition.state ? vaultDefinition.state : vaultDefinition.newVault ? VaultState.New : VaultState.Open,
    tokens: [],
    underlyingToken: vaultDefinition.depositToken,
    value: 0,
    vaultAsset: vaultToken.symbol,
    vaultToken: vaultDefinition.vaultToken,
    strategy: {
      address: ethers.constants.AddressZero,
      withdrawFee: 50,
      performanceFee: 20,
      strategistFee: 10,
    },
    type: vaultDefinition.protocol === Protocol.Badger ? VaultType.Native : VaultType.Standard,
  };
}

// TODO: kill this function
export async function getVault(graphUrl: string, contract: string, block?: number): Promise<SettQuery> {
  const badgerGraphqlClient = new GraphQLClient(graphUrl);
  const badgerGraphqlSdk = getSdk(badgerGraphqlClient);
  const settId = contract.toLowerCase();
  const vars = { id: settId };
  if (block) {
    return badgerGraphqlSdk.SettSnapshot({ ...vars, block: { number: block } });
  }
  return badgerGraphqlSdk.Sett(vars);
}

export async function getCachedVault(vaultDefinition: VaultDefinition): Promise<Vault> {
  const sett = defaultVault(vaultDefinition);
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(
      CachedSettSnapshot,
      { address: vaultDefinition.vaultToken },
      { limit: 1, scanIndexForward: false },
    )) {
      sett.balance = item.balance;
      sett.value = item.value;
      if (item.balance === 0 || item.supply === 0) {
        sett.pricePerFullShare = 1;
      } else if (vaultDefinition.vaultToken === TOKENS.BDIGG) {
        sett.pricePerFullShare = item.balance / item.supply;
      } else {
        sett.pricePerFullShare = item.ratio;
      }
      sett.strategy = item.strategy;
      sett.boost = {
        enabled: item.boostWeight > 0,
        weight: item.boostWeight,
      };
    }
    return sett;
  } catch (err) {
    console.error(err);
    return sett;
  }
}

export async function getVaultSnapshotsInRange(
  vaultDefinition: VaultDefinition,
  start: Date,
  end: Date,
): Promise<VaultSnapshot[]> {
  try {
    const snapshots = [];
    const mapper = getDataMapper();
    const assetToken = getToken(vaultDefinition.vaultToken);

    for await (const snapshot of mapper.query(
      VaultSnapshot,
      { address: assetToken.address, timestamp: between(new Date(start).getTime(), new Date(end).getTime()) },
      { scanIndexForward: false },
    )) {
      snapshots.push(snapshot);
    }
    return snapshots;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export const getPerformance = (current: VaultSnapshot, initial: VaultSnapshot): number => {
  const ratioDiff = current.ratio - initial.ratio;
  const timestampDiff = current.timestamp - initial.timestamp;
  if (timestampDiff === 0 || ratioDiff === 0) {
    return 0;
  }
  const scalar = ONE_YEAR_MS / timestampDiff;
  const finalRatio = initial.ratio + scalar * ratioDiff;
  return ((finalRatio - initial.ratio) / initial.ratio) * 100;
};

export function getVaultDefinition(chain: Chain, contract: string): VaultDefinition {
  const contractAddress = ethers.utils.getAddress(contract);
  const vaultDefinition = chain.vaults.find((v) => v.vaultToken === contractAddress);
  if (!vaultDefinition) {
    throw new NotFound(`${contract} is not a valid sett`);
  }
  return vaultDefinition;
}

// TODO: migration to SDK is probably the best option here
export async function getStrategyInfo(chain: Chain, vaultDefinition: VaultDefinition): Promise<VaultStrategy> {
  const defaultStrategyInfo = {
    address: ethers.constants.AddressZero,
    withdrawFee: 0,
    performanceFee: 0,
    strategistFee: 0,
  };
  try {
    const contract = Sett__factory.connect(vaultDefinition.vaultToken, chain.provider);
    const controllerAddr = await contract.controller();
    if (controllerAddr === ethers.constants.AddressZero) {
      return defaultStrategyInfo;
    }
    const controller = Controller__factory.connect(controllerAddr, chain.provider);
    const strategyAddr = await controller.strategies(vaultDefinition.depositToken);
    if (strategyAddr === ethers.constants.AddressZero) {
      return defaultStrategyInfo;
    }
    const strategy = Strategy__factory.connect(strategyAddr, chain.provider);
    const [withdrawFee, performanceFee, strategistFee] = await Promise.all([
      strategy.withdrawalFee(),
      strategy.performanceFeeGovernance(),
      strategy.performanceFeeStrategist(),
    ]);
    return {
      address: strategy.address,
      withdrawFee: withdrawFee.toNumber(),
      performanceFee: performanceFee.toNumber(),
      strategistFee: strategistFee.toNumber(),
    };
  } catch (err) {
    return defaultStrategyInfo;
  }
}

// TODO: align this weird piece (result of non-updating ppfs for updates from graph)
// either remove or consolidate this kind of functionality
export const getPricePerShare = async (
  chain: Chain,
  pricePerShare: BigNumber,
  vaultDefinition: VaultDefinition,
  block?: number,
): Promise<number> => {
  const token = getToken(vaultDefinition.vaultToken);
  try {
    let ppfs: BigNumber;
    const contract = Sett__factory.connect(vaultDefinition.vaultToken, chain.provider);
    if (block) {
      ppfs = await contract.getPricePerFullShare({ blockTag: block });
    } else {
      ppfs = await contract.getPricePerFullShare();
    }
    return formatBalance(ppfs, token.decimals);
  } catch (err) {
    return formatBalance(pricePerShare, token.decimals);
  }
};

export async function getBoostWeight(chain: Chain, vaultDefinition: VaultDefinition): Promise<BigNumber> {
  if (!chain.emissionControl) {
    return ethers.constants.Zero;
  }
  const emissionControl = EmissionControl__factory.connect(chain.emissionControl, chain.provider);
  return emissionControl.boostedEmissionRate(vaultDefinition.vaultToken);
}

/**
 * Get pricing information for a vault token.
 * @param address Address for vault token.
 * @returns Pricing data for the given vault token based on the pricePerFullShare.
 */
export async function getVaultTokenPrice(chain: Chain, address: string): Promise<TokenPrice> {
  const token = getToken(address);
  if (token.type !== PricingType.Vault) {
    throw new BadRequest(`${token.name} is not a vault token`);
  }
  const { vaultToken } = token;
  if (!vaultToken) {
    throw new UnprocessableEntity(`${token.name} vault token missing`);
  }
  const isCrossChainVault = chain.network !== vaultToken.network;
  const targetChain = isCrossChainVault ? Chain.getChain(vaultToken.network) : chain;
  const targetVault = isCrossChainVault ? vaultToken.address : token.address;
  const vaultDefintion = getVaultDefinition(targetChain, targetVault);
  const [underlyingTokenPrice, vaultTokenSnapshot] = await Promise.all([
    getPrice(vaultToken.address),
    getCachedVault(vaultDefintion),
  ]);
  return {
    address: token.address,
    price: underlyingTokenPrice.price * vaultTokenSnapshot.pricePerFullShare,
  };
}

// TODO: probably break this up
export async function getVaultPerformance(
  chain: Chain,
  vaultDefinition: VaultDefinition,
): Promise<CachedValueSource[]> {
  const rewardEmissions = await getRewardEmission(chain, vaultDefinition);
  try {
    const sdk = await chain.getSdk();
    const cutoff = (Date.now() - ONE_DAY_MS * 21) / 1000;
    const { data } = await sdk.vaults.listHarvests({ address: vaultDefinition.vaultToken, timestamp_gte: cutoff });

    const recentHarvests = data.sort((a, b) => b.timestamp - a.timestamp);

    if (recentHarvests.length <= 1) {
      console.log(`[${vaultDefinition.name}]: skipping performances, not enough harvests`);
      return [];
    }

    const duration = recentHarvests[0].timestamp - recentHarvests[recentHarvests.length - 1].timestamp;
    const measuredHarvests = recentHarvests.slice(1);
    const valueSources = [];

    const totalHarvested = measuredHarvests
      .flatMap((h) => h.harvests)
      .map((h) => h.harvested)
      .reduce((total, harvested) => total.add(harvested), BigNumber.from(0));

    const vault = await getCachedVault(vaultDefinition);
    const depositToken = getToken(vaultDefinition.depositToken);
    const totalHarvestedTokens = formatBalance(totalHarvested, depositToken.decimals);
    const compoundApr = (((totalHarvestedTokens / vault.balance) * ONE_YEAR_SECONDS) / duration) * 100;
    const compoundSource = createValueSource(VAULT_SOURCE, uniformPerformance(compoundApr));
    const cachedCompoundSource = valueSourceToCachedValueSource(compoundSource, vaultDefinition, SourceType.Compound);
    valueSources.push(cachedCompoundSource);

    const treeDistributions = measuredHarvests.flatMap((h) => h.treeDistributions);
    const tokensEmitted = new Map<string, BigNumber>();
    for (const distribution of treeDistributions) {
      const { token, amount } = distribution;
      let entry = tokensEmitted.get(token);
      if (!entry) {
        entry = BigNumber.from(0);
        tokensEmitted.set(token, entry);
      }
      tokensEmitted.set(token, entry.add(amount));
    }

    for (const [token, amount] of tokensEmitted.entries()) {
      const [tokenEmitted, tokenPrice] = await Promise.all([sdk.tokens.loadToken(token), getPrice(token)]);
      if (tokenPrice.price === 0) {
        console.error(`[${vault.vaultToken}] Ignoring ${tokenEmitted.name} emission as no price is available`);
        continue;
      }
      const tokensEmitted = formatBalance(amount, tokenEmitted.decimals);
      const valueEmitted = tokensEmitted * tokenPrice.price;
      const emissionApr = (((valueEmitted / vault.value) * ONE_YEAR_SECONDS) / duration) * 100;
      const emissionSource = createValueSource(`${tokenEmitted.name} Rewards`, uniformPerformance(emissionApr));
      const cachedEmissionSource = valueSourceToCachedValueSource(
        emissionSource,
        vaultDefinition,
        tokenEmission(tokenEmitted),
      );
      valueSources.push(cachedEmissionSource);
    }

    return [...valueSources, ...rewardEmissions];
  } catch (err) {
    const [underlying, protocol] = await Promise.all([
      getVaultUnderlying(vaultDefinition),
      getProtocolValueSources(chain, vaultDefinition),
    ]);
    return [underlying, ...protocol, ...rewardEmissions];
  }
}

export async function getVaultUnderlying(vaultDefinition: VaultDefinition): Promise<CachedValueSource> {
  const rangeEnd = Date.now();
  const rangeStart = rangeEnd - ONE_DAY_MS * SAMPLE_DAYS;
  const snapshots = await getVaultSnapshotsInRange(vaultDefinition, new Date(rangeStart), new Date(rangeEnd));
  const current = snapshots[CURRENT];
  if (current === undefined) {
    return valueSourceToCachedValueSource(
      createValueSource(VAULT_SOURCE, uniformPerformance(0)),
      vaultDefinition,
      SourceType.Compound,
    );
  }
  const start = Date.now();
  const performance = uniformPerformance(0);

  let timeframeIndex = 0;
  for (let i = 0; i < snapshots.length; i++) {
    const currentTimeFrame = SOURCE_TIME_FRAMES[timeframeIndex];
    const currentCutoff = start - currentTimeFrame * ONE_DAY_MS;
    const currentSnapshot = snapshots[i];
    if (currentSnapshot.timestamp <= currentCutoff) {
      updatePerformance(performance, currentTimeFrame, getPerformance(current, currentSnapshot));
      timeframeIndex += 1;
      if (timeframeIndex >= SOURCE_TIME_FRAMES.length) {
        break;
      }
    }
  }

  // handle no valid measurements, measure available data
  while (timeframeIndex < SOURCE_TIME_FRAMES.length) {
    updatePerformance(
      performance,
      SOURCE_TIME_FRAMES[timeframeIndex],
      getPerformance(current, snapshots[snapshots.length - 1]),
    );
    timeframeIndex += 1;
  }

  const vaultSource = createValueSource(VAULT_SOURCE, performance);
  return valueSourceToCachedValueSource(vaultSource, vaultDefinition, SourceType.Compound);
}
