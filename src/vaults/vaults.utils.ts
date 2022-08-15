import {
  Currency,
  formatBalance,
  ListHarvestOptions,
  ONE_DAY_SECONDS,
  ONE_YEAR_SECONDS,
  Protocol,
  Strategy__factory,
  Vault__factory,
  VaultDTO,
  VaultPerformanceEvent,
  VaultType,
  VaultV15__factory,
  VaultVersion,
} from '@badger-dao/sdk';
import { BadRequest, UnprocessableEntity } from '@tsed/exceptions';
import { BigNumber, ethers } from 'ethers';

import { getDataMapper } from '../aws/dynamodb.utils';
import { CurrentVaultSnapshotModel } from '../aws/models/current-vault-snapshot.model';
import { HarvestCompoundData } from '../aws/models/harvest-compound.model';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { YieldEstimate } from '../aws/models/yield-estimate.model';
import { YieldSource } from '../aws/models/yield-source.model';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { EmissionControl__factory } from '../contracts';
import { getVault } from '../indexers/indexer.utils';
import { PricingType } from '../prices/enums/pricing-type.enum';
import { TokenPrice } from '../prices/interface/token-price.interface';
import { convert, queryPrice } from '../prices/prices.utils';
import { SourceType } from '../rewards/enums/source-type.enum';
import { getProtocolValueSources, getRewardEmission } from '../rewards/rewards.utils';
import { getFullToken, getVaultTokens } from '../tokens/tokens.utils';
import { Nullable } from '../utils/types.utils';
import { HarvestType } from './enums/harvest.enum';
import { VaultHarvestData } from './interfaces/vault-harvest-data.interface';
import { VaultHarvestsExtendedResp } from './interfaces/vault-harvest-extended-resp.interface';
import { VaultStrategy } from './interfaces/vault-strategy.interface';
import {
  aggregateSources,
  createYieldSource,
  loadVaultEventPerformances,
  loadVaultGraphPerformances,
} from './yields.utils';

export const VAULT_SOURCE = 'Vault Compounding';

export async function defaultVault(chain: Chain, vault: VaultDefinitionModel): Promise<VaultDTO> {
  const { state, bouncer, behavior, version, protocol, name, depositToken, address } = vault;
  const [assetToken, vaultToken] = await Promise.all([getFullToken(chain, depositToken), getFullToken(chain, address)]);

  const type = protocol === Protocol.Badger ? VaultType.Native : VaultType.Standard;

  return {
    apr: 0,
    apy: 0,
    minApr: 0,
    maxApr: 0,
    minApy: 0,
    maxApy: 0,
    asset: assetToken.symbol,
    available: 0,
    balance: 0,
    behavior,
    boost: {
      enabled: false,
      weight: 0,
    },
    bouncer,
    name,
    pricePerFullShare: 1,
    protocol: vault.protocol,
    sources: [],
    sourcesApy: [],
    state,
    tokens: [],
    strategy: {
      address: ethers.constants.AddressZero,
      withdrawFee: 0,
      performanceFee: 0,
      strategistFee: 0,
      aumFee: 0,
    },
    type,
    underlyingToken: depositToken,
    value: 0,
    vaultAsset: vaultToken.symbol,
    vaultToken: address,
    yieldProjection: {
      yieldApr: 0,
      yieldTokens: [],
      yieldPeriodApr: 0,
      yieldPeriodSources: [],
      yieldValue: 0,
      harvestApr: 0,
      harvestPeriodApr: 0,
      harvestPeriodApy: 0,
      harvestTokens: [],
      harvestPeriodSources: [],
      harvestPeriodSourcesApy: [],
      harvestValue: 0,
      nonHarvestApr: 0,
      nonHarvestSources: [],
      nonHarvestApy: 0,
      nonHarvestSourcesApy: [],
    },
    lastHarvest: 0,
    version,
  };
}

// TODO: vault should migration from address -> id where id = chain.network-vault.address
export async function getCachedVault(
  chain: Chain,
  vaultDefinition: VaultDefinitionModel,
  currency = Currency.USD,
): Promise<VaultDTO> {
  const vault = await defaultVault(chain, vaultDefinition);
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(
      CurrentVaultSnapshotModel,
      { address: vaultDefinition.address },
      { limit: 1, scanIndexForward: false },
    )) {
      vault.available = item.available;
      vault.balance = item.balance;
      vault.value = item.value;
      if (item.balance === 0 || item.totalSupply === 0) {
        vault.pricePerFullShare = 1;
      } else if (vaultDefinition.address === TOKENS.BDIGG) {
        vault.pricePerFullShare = item.balance / item.totalSupply;
      } else {
        vault.pricePerFullShare = item.pricePerFullShare;
      }
      vault.strategy = item.strategy;
      vault.boost = {
        enabled: item.boostWeight > 0,
        weight: item.boostWeight,
      };
      const [tokens, convertedValue] = await Promise.all([
        getVaultTokens(chain, vault, currency),
        convert(item.value, currency),
      ]);
      vault.tokens = tokens;
      vault.value = convertedValue;
      return vault;
    }
    return vault;
  } catch {
    return vault;
  }
}

export async function getStrategyInfo(chain: Chain, vault: VaultDefinitionModel): Promise<VaultStrategy> {
  const defaultStrategyInfo: VaultStrategy = {
    address: ethers.constants.AddressZero,
    withdrawFee: 0,
    performanceFee: 0,
    strategistFee: 0,
    aumFee: 0,
  };
  try {
    const sdk = await chain.getSdk();
    const version = vault.version ?? VaultVersion.v1;
    const strategyAddress = await sdk.vaults.getVaultStrategy({
      address: vault.address,
      version,
    });
    if (version === VaultVersion.v1) {
      const strategy = Strategy__factory.connect(strategyAddress, sdk.provider);
      // you know, these things happen...
      // eslint-disable-next-line prefer-const
      let [withdrawFee, performanceFee, strategistFee] = await Promise.all([
        strategy.withdrawalFee(),
        strategy.performanceFeeGovernance(),
        strategy.performanceFeeStrategist(),
      ]);
      // bveCVX does not have a way to capture materially its performance fee
      if (vault.address === TOKENS.BVECVX) {
        performanceFee = BigNumber.from('1500'); // set performance fee to 15%
      }
      return {
        address: strategyAddress,
        withdrawFee: withdrawFee.toNumber(),
        performanceFee: performanceFee.toNumber(),
        strategistFee: strategistFee.toNumber(),
        aumFee: 0,
      };
    } else {
      const vaultContract = VaultV15__factory.connect(vault.address, sdk.provider);
      const [withdrawFee, performanceFee, strategistFee, aumFee] = await Promise.all([
        vaultContract.withdrawalFee(),
        vaultContract.performanceFeeGovernance(),
        vaultContract.performanceFeeStrategist(),
        vaultContract.managementFee(),
      ]);
      return {
        address: strategyAddress,
        withdrawFee: withdrawFee.toNumber(),
        performanceFee: performanceFee.toNumber(),
        strategistFee: strategistFee.toNumber(),
        aumFee: aumFee.toNumber(),
      };
    }
  } catch (err) {
    console.error(err);
    return defaultStrategyInfo;
  }
}

export async function getBoostWeight(chain: Chain, vault: VaultDefinitionModel): Promise<BigNumber> {
  if (!chain.emissionControl) {
    return ethers.constants.Zero;
  }
  try {
    const emissionControl = EmissionControl__factory.connect(chain.emissionControl, chain.provider);
    return emissionControl.boostedEmissionRate(vault.address);
  } catch (err) {
    console.error(err);
    return ethers.constants.Zero;
  }
}

/**
 * Get pricing information for a vault token.
 * @param chain Block chain instance
 * @param address Address for vault token.
 * @returns Pricing data for the given vault token based on the pricePerFullShare.
 */
export async function getVaultTokenPrice(chain: Chain, address: string): Promise<TokenPrice> {
  const token = await getFullToken(chain, address);
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
  const vault = await targetChain.vaults.getVault(targetVault);
  const [underlyingTokenPrice, vaultTokenSnapshot] = await Promise.all([
    queryPrice(vaultToken.address),
    getCachedVault(chain, vault),
  ]);
  return {
    address: token.address,
    price: underlyingTokenPrice.price * vaultTokenSnapshot.pricePerFullShare,
  };
}

/**
 * Load a Badger vault measured performance.
 * @param chain Chain vault is deployed on
 * @param vault Vault definition of requested vault
 * @returns Value source array describing vault performance
 */
export async function getVaultPerformance(chain: Chain, vault: VaultDefinitionModel): Promise<YieldSource[]> {
  const [rewardEmissions, protocol] = await Promise.all([
    getRewardEmission(chain, vault),
    getProtocolValueSources(chain, vault),
  ]);
  let vaultSources: YieldSource[] = [];
  try {
    vaultSources = await loadVaultEventPerformances(chain, vault);
  } catch {
    vaultSources = await loadVaultGraphPerformances(chain, vault);
  }
  // handle aggregation of various sources - this unfortunately loses the ddb schemas and need to be reassigned
  const aggregatedSources = aggregateSources([...vaultSources, ...rewardEmissions, ...protocol], (s) => s.id);
  return aggregatedSources.map((s) => Object.assign(new YieldSource(), s));
}

/**
 * Extrapolates a one-year APR for a given vault based on compounding and emissions based on $100 deposit.
 * @param compoundApr Base compound APR of vault
 * @param emissionApr Emission APR of the emitted vault
 * @param emissionCompoundApr Derivative compound APR of the tmitted vault
 * @returns Extraposedat one year APR given current yields continue
 */
export function estimateDerivativeEmission(
  compoundApr: number,
  emissionApr: number,
  emissionCompoundApr: number,
  compoundingStep = 1,
  emissionStep = 1,
): number {
  // start with $100 deposited into the vault
  let currentValueCompounded = 100;
  let currentValueEmitted = 0;
  let currentValueEmittedCompounded = 0;
  let lastEmissionTime = 0;
  const emissionsDivisor = 365 / emissionStep;
  const compoundingDivisor = 365 / compoundingStep;
  for (let i = 0; i < 365; i += compoundingStep) {
    currentValueCompounded += currentValueCompounded * (compoundApr / compoundingDivisor);
    // accrue compounded yield from emitted tokens
    const emittedCompounded = currentValueEmitted * (emissionCompoundApr / compoundingDivisor);

    // We only accrue emissions if there was an emissions event
    if (lastEmissionTime + emissionStep >= i) {
      // accrue emitted yield from emissionApr
      const emitted = currentValueCompounded * (emissionApr / emissionsDivisor);
      // account for total yield emitted
      currentValueEmitted += emitted;
      lastEmissionTime = i;
    }

    // account for the actual compounding portion on the emitted yield (what we are looking for)
    currentValueEmittedCompounded += emittedCompounded;
    // account for the compounded yield
    currentValueEmitted += emittedCompounded;
  }

  const total = currentValueCompounded + currentValueEmitted;
  return (currentValueEmittedCompounded / total) * 100;
}

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

export async function estimateVaultPerformance(
  chain: Chain,
  vault: VaultDefinitionModel,
  data: VaultHarvestData[],
): Promise<YieldSource[]> {
  const recentHarvests = data.sort((a, b) => b.timestamp - a.timestamp);

  if (recentHarvests.length <= 1) {
    throw new Error(`${vault.name} does not have adequate harvest history`);
  }

  let totalDuration;

  // TODO: generalize this for voting vaults + look up their voting periods
  if (vault.address === TOKENS.BVECVX) {
    totalDuration = ONE_DAY_SECONDS * 14;
  } else {
    totalDuration = recentHarvests[0].timestamp - recentHarvests[data.length - 1].timestamp;
  }

  const cachedVault = await getCachedVault(chain, vault);

  let measuredHarvests;

  if (vault.address === TOKENS.BVECVX) {
    const cutoff = recentHarvests[0].timestamp - totalDuration;
    measuredHarvests = recentHarvests.filter((h) => h.timestamp > cutoff).slice(0, recentHarvests.length - 1);
  } else {
    measuredHarvests = recentHarvests.slice(0, recentHarvests.length - 1);
  }

  const valueSources = [];

  const harvests = measuredHarvests.flatMap((h) => h.harvests);
  const totalHarvested = harvests
    .map((h) => h.amount)
    .reduce((total, harvested) => total.add(harvested), BigNumber.from(0));

  let weightedBalance = 0;
  const depositToken = await getFullToken(chain, vault.depositToken);

  // this will probably need more generalization, quickly becoming a huge pain in the ass
  if (vault.address === TOKENS.BVECVX) {
    const sdk = await chain.getSdk();
    const targetBlock = recentHarvests[0].treeDistributions[0].block;
    const vaultContract = Vault__factory.connect(vault.address, sdk.provider);
    const strategyBalance = await vaultContract.totalSupply({ blockTag: targetBlock });
    weightedBalance = formatBalance(strategyBalance);
  } else {
    const allHarvests = recentHarvests.flatMap((h) => h.harvests);
    // use the full harvests to construct all intervals for durations, nth element is ignored for distributions
    for (let i = 0; i < allHarvests.length - 1; i++) {
      const end = allHarvests[i];
      const start = allHarvests[i + 1];
      const duration = end.timestamp - start.timestamp;
      if (duration === 0) {
        continue;
      }
      // TODO: replace with snapshot based lookup
      const { sett } = await getVault(chain, vault.address, end.block);
      if (sett) {
        const balance = sett.strategy?.balance ?? sett.balance;
        weightedBalance += duration * formatBalance(balance, depositToken.decimals);
      } else {
        weightedBalance += duration * cachedVault.balance;
      }
    }
  }

  // TODO: generalize or combine weighted balance calculation and distribution timestamp aggregation
  if (weightedBalance === 0) {
    weightedBalance = cachedVault.balance * totalDuration;
  }

  const { price } = await queryPrice(vault.depositToken);
  const measuredBalance = weightedBalance / totalDuration;
  // lord, forgive me for my sins... we will generalize this shortly I hope
  const measuredValue = (vault.address === TOKENS.BVECVX ? weightedBalance : measuredBalance) * price;
  const totalHarvestedTokens = formatBalance(totalHarvested, depositToken.decimals);
  // count of harvests is exclusive of the 0th element
  const durationScalar = ONE_YEAR_SECONDS / totalDuration;
  // take the less frequent period, the actual harvest frequency or daily
  const periods = Math.min(365, durationScalar * measuredHarvests.length);

  // create the apr source for harvests
  const compoundApr = (totalHarvestedTokens / measuredBalance) * durationScalar;
  const compoundYieldSource = createYieldSource(vault, SourceType.PreCompound, VAULT_SOURCE, compoundApr * 100);
  valueSources.push(compoundYieldSource);

  // create the apy source for harvests
  const compoundApy = (1 + compoundApr / periods) ** periods - 1;
  const compoundedYieldSource = createYieldSource(vault, SourceType.Compound, VAULT_SOURCE, compoundApy * 100);
  valueSources.push(compoundedYieldSource);

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

  let flywheelCompounding = 0;

  for (const [token, amount] of tokensEmitted.entries()) {
    const { price } = await queryPrice(token);
    if (price === 0) {
      continue;
    }
    const tokenEmitted = await getFullToken(chain, token);
    const tokensEmitted = formatBalance(amount, tokenEmitted.decimals);
    const valueEmitted = tokensEmitted * price;
    const emissionApr = (valueEmitted / measuredValue) * durationScalar;
    const emissionYieldSource = createYieldSource(vault, SourceType.Distribution, tokenEmitted.name, emissionApr * 100);
    valueSources.push(emissionYieldSource);

    // try to add underlying emitted vault value sources if applicable
    try {
      const emittedVault = await chain.vaults.getVault(tokenEmitted.address);
      const vaultValueSources = await queryYieldSources(emittedVault);
      // search for the persisted apr variant of the compounding vault source, if any
      const compoundingSource = vaultValueSources.find((source) => source.type === SourceType.PreCompound);
      if (compoundingSource) {
        flywheelCompounding += estimateDerivativeEmission(compoundApr, emissionApr, compoundingSource.apr / 100);
      }
    } catch {} // ignore error for non vaults
  }

  if (flywheelCompounding > 0) {
    const sourceName = `Vault Flywheel`;
    const flywheelYieldSource = createYieldSource(vault, SourceType.Flywheel, sourceName, flywheelCompounding);
    valueSources.push(flywheelYieldSource);
  }

  return valueSources;
}

export async function queryYieldSources(vault: VaultDefinitionModel): Promise<YieldSource[]> {
  const valueSources = [];
  const mapper = getDataMapper();
  for await (const source of mapper.query(
    YieldSource,
    { chainAddress: vault.id },
    { indexName: 'IndexApySnapshotsOnAddress' },
  )) {
    valueSources.push(source);
  }
  return valueSources;
}

export async function queryYieldEstimate(vault: VaultDefinitionModel): Promise<YieldEstimate> {
  const yieldEstimate: YieldEstimate = {
    vault: vault.address,
    yieldTokens: [],
    harvestTokens: [],
    lastHarvestedAt: 0,
    previousYieldTokens: [],
    previousHarvestTokens: [],
    lastMeasuredAt: 0,
    duration: 0,
    lastReportedAt: 0,
  };
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(YieldEstimate, { vault: vault.address }, { limit: 1 })) {
      return item;
    }
    return yieldEstimate;
  } catch (err) {
    console.error(err);
    return yieldEstimate;
  }
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
