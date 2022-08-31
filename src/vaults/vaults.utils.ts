import {
  Currency,
  Protocol,
  Strategy__factory,
  VaultDTO,
  VaultType,
  VaultV15__factory,
  VaultVersion,
  VaultYieldProjection,
} from '@badger-dao/sdk';
import { BadRequest, UnprocessableEntity } from '@tsed/exceptions';
import { BigNumber, ethers } from 'ethers';

import { getDataMapper, getVaultEntityId } from '../aws/dynamodb.utils';
import { CachedYieldProjection } from '../aws/models/cached-yield-projection.model';
import { CurrentVaultSnapshotModel } from '../aws/models/current-vault-snapshot.model';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { YieldEstimate } from '../aws/models/yield-estimate.model';
import { YieldSource } from '../aws/models/yield-source.model';
import { getOrCreateChain } from '../chains/chains.utils';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { PricingType } from '../prices/enums/pricing-type.enum';
import { TokenPrice } from '../prices/interface/token-price.interface';
import { convert, queryPrice } from '../prices/prices.utils';
import { getProtocolValueSources, getRewardEmission } from '../rewards/rewards.utils';
import { getFullToken, getVaultTokens } from '../tokens/tokens.utils';
import { VaultStrategy } from './interfaces/vault-strategy.interface';
import { aggregateSources, queryVaultYieldSources } from './yields.utils';

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
  } catch (err) {
    console.error(err);
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
    const { version, address } = vault;
    const strategyAddress = await sdk.vaults.getVaultStrategy({
      address,
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
      if (address === TOKENS.BVECVX) {
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
      const vaultContract = VaultV15__factory.connect(address, sdk.provider);
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
  const targetChain = isCrossChainVault ? getOrCreateChain(vaultToken.network) : chain;
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
  const [rewardEmissions, protocol, vaultSources] = await Promise.all([
    getRewardEmission(chain, vault),
    getProtocolValueSources(chain, vault),
    queryVaultYieldSources(chain, vault),
  ]);
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

/**
 * Query a vault yield sources.
 * @param vault requested vault definition
 * @returns cached yield sources
 */
export async function queryYieldSources(vault: VaultDefinitionModel): Promise<YieldSource[]> {
  const valueSources = [];
  try {
    const mapper = getDataMapper();
    for await (const source of mapper.query(
      YieldSource,
      { chainAddress: vault.id },
      { indexName: 'IndexApySnapshotsOnAddress' },
    )) {
      valueSources.push(source);
    }
  } catch (err) {
    console.error(err);
  }
  return valueSources;
}

/**
 * Query a vault yield estimate. Only exist for v1.5 vaults.
 * @param vault requested vault definition
 * @returns cached yield estimate, or a default if none exists
 */
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

export async function queryYieldProjection(vault: VaultDefinitionModel): Promise<VaultYieldProjection> {
  const yieldProjection: VaultYieldProjection = {
    harvestValue: 0,
    harvestApr: 0,
    harvestTokens: [],
    harvestPeriodApr: 0,
    harvestPeriodApy: 0,
    harvestPeriodSources: [],
    harvestPeriodSourcesApy: [],
    yieldValue: 0,
    yieldApr: 0,
    yieldTokens: [],
    yieldPeriodApr: 0,
    yieldPeriodSources: [],
    nonHarvestApr: 0,
    nonHarvestApy: 0,
    nonHarvestSources: [],
    nonHarvestSourcesApy: [],
  };
  try {
    const mapper = getDataMapper();
    const id = getVaultEntityId({ network: vault.chain }, vault);
    for await (const projection of mapper.query(CachedYieldProjection, { id }, { limit: 1 })) {
      return projection;
    }
    return yieldProjection;
  } catch (err) {
    console.error(err);
    return yieldProjection;
  }
}
