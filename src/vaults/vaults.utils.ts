import {
  Protocol,
  Strategy__factory,
  VaultDTO,
  VaultDTOV2,
  VaultDTOV3,
  VaultType,
  VaultV15__factory,
  VaultVersion,
  VaultYieldProjectionV3,
} from '@badger-dao/sdk';
import { BadRequest, UnprocessableEntity } from '@tsed/exceptions';
import { BigNumber, CallOverrides, ethers } from 'ethers';

import { getDataMapper, getVaultEntityId } from '../aws/dynamodb.utils';
import { CachedYieldProjection } from '../aws/models/cached-yield-projection.model';
import { CachedYieldSource } from '../aws/models/cached-yield-source.interface';
import { CurrentVaultSnapshotModel } from '../aws/models/current-vault-snapshot.model';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { YieldEstimate } from '../aws/models/yield-estimate.model';
import { getOrCreateChain } from '../chains/chains.utils';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { PricingType } from '../prices/enums/pricing-type.enum';
import { TokenPrice } from '../prices/interface/token-price.interface';
import { queryPrice } from '../prices/prices.utils';
import { getProtocolValueSources, getRewardEmission } from '../rewards/rewards.utils';
import { getFullToken } from '../tokens/tokens.utils';
import { rfw } from '../utils/retry.utils';
import { VaultStrategy } from './interfaces/vault-strategy.interface';
import { aggregateSources, queryVaultYieldSources } from './yields.utils';

const defaultYieldProjection = {
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
};

export async function defaultVaultDto(chain: Chain, vault: VaultDefinitionModel): Promise<VaultDTO> {
  const { state, bouncer, behavior, version, protocol, name, depositToken, address } = vault;
  const [assetToken, vaultToken] = await Promise.all([getFullToken(chain, depositToken), getFullToken(chain, address)]);

  const type = protocol === Protocol.Badger ? VaultType.Native : VaultType.Standard;

  return {
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
    lastHarvest: 0,
    version,
  };
}

export async function defaultVault(chain: Chain, vault: VaultDefinitionModel): Promise<VaultDTOV2> {
  const baseVault = await defaultVaultDto(chain, vault);
  return {
    ...baseVault,
    apr: 0,
    apy: 0,
    minApr: 0,
    maxApr: 0,
    minApy: 0,
    maxApy: 0,
    sources: [],
    sourcesApy: [],
    yieldProjection: defaultYieldProjection,
  };
}

export async function defaultVaultV3(chain: Chain, vault: VaultDefinitionModel): Promise<VaultDTOV3> {
  const baseVault = await defaultVaultDto(chain, vault);
  return {
    ...baseVault,
    address: vault.address,
    apr: {
      baseYield: 0,
      minYield: 0,
      maxYield: 0,
      grossYield: 0,
      minGrossYield: 0,
      maxGrossYield: 0,
      sources: [],
    },
    apy: {
      baseYield: 0,
      minYield: 0,
      maxYield: 0,
      grossYield: 0,
      minGrossYield: 0,
      maxGrossYield: 0,
      sources: [],
    },
    yieldProjection: defaultYieldProjection,
  };
}

/**
 *
 * @param chain
 * @param vault
 * @returns
 */
export async function getCachedVault(chain: Chain, vault: VaultDefinitionModel): Promise<CurrentVaultSnapshotModel> {
  const id = getVaultEntityId(chain, vault);
  const defaultSnapshot: CurrentVaultSnapshotModel = {
    id,
    address: vault.address,
    chain: chain.network,
    block: 0,
    timestamp: 0,
    balance: 0,
    strategy: {
      address: ethers.constants.AddressZero,
      aumFee: 0,
      performanceFee: 0,
      strategistFee: 0,
      withdrawFee: 0,
    },
    strategyBalance: 0,
    available: 0,
    pricePerFullShare: 1,
    totalSupply: 0,
    boostWeight: 0,
    apr: 0,
    grossApr: 0,
    value: 0,
    yieldApr: 0,
    harvestApr: 0,
  };
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(CurrentVaultSnapshotModel, { id }, { limit: 1, scanIndexForward: false })) {
      return item;
    }
    return defaultSnapshot;
  } catch (err) {
    console.error(err);
    return defaultSnapshot;
  }
}

export async function getStrategyInfo(
  chain: Chain,
  vault: VaultDefinitionModel,
  overrides?: CallOverrides,
): Promise<VaultStrategy> {
  const sdk = await chain.getSdk();
  const { version, address } = vault;
  const strategyAddress = await sdk.vaults.getVaultStrategy(
    {
      address,
      version,
    },
    overrides,
  );
  if (version === VaultVersion.v1) {
    const strategy = Strategy__factory.connect(strategyAddress, sdk.provider);
    // you know, these things happen...
    // eslint-disable-next-line prefer-const
    let [withdrawFee, performanceFee, strategistFee] = await Promise.all([
      strategy.withdrawalFee({ ...overrides }),
      strategy.performanceFeeGovernance({ ...overrides }),
      strategy.performanceFeeStrategist({ ...overrides }),
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
      vaultContract.withdrawalFee({ ...overrides }),
      vaultContract.performanceFeeGovernance({ ...overrides }),
      vaultContract.performanceFeeStrategist({ ...overrides }),
      vaultContract.managementFee({ ...overrides }),
    ]);
    return {
      address: strategyAddress,
      withdrawFee: withdrawFee.toNumber(),
      performanceFee: performanceFee.toNumber(),
      strategistFee: strategistFee.toNumber(),
      aumFee: aumFee.toNumber(),
    };
  }
}

export async function getStrategyInfoRfw(...args: Parameters<typeof getStrategyInfo>): Promise<VaultStrategy> {
  const defaultStrategyInfo: VaultStrategy = {
    address: ethers.constants.AddressZero,
    withdrawFee: 0,
    performanceFee: 0,
    strategistFee: 0,
    aumFee: 0,
  };

  try {
    return rfw(getStrategyInfo)(...args);
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
  const pricePerFullShare = vaultTokenSnapshot ? vaultTokenSnapshot.pricePerFullShare : 1;
  return {
    address: token.address,
    price: underlyingTokenPrice.price * pricePerFullShare,
  };
}

/**
 * Load a Badger vault measured performance.
 * @param chain Chain vault is deployed on
 * @param vault Vault definition of requested vault
 * @returns Value source array describing vault performance
 */
export async function getVaultPerformance(chain: Chain, vault: VaultDefinitionModel): Promise<CachedYieldSource[]> {
  const [rewardEmissions, protocol, vaultSources] = await Promise.all([
    getRewardEmission(chain, vault),
    getProtocolValueSources(chain, vault),
    queryVaultYieldSources(chain, vault),
  ]);
  // handle aggregation of various sources - this unfortunately loses the ddb schemas and need to be reassigned
  const aggregatedSources = aggregateSources([...vaultSources, ...rewardEmissions, ...protocol], (s) => s.id);
  return aggregatedSources.map((s) => Object.assign(new CachedYieldSource(), s));
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
export async function queryYieldSources(vault: VaultDefinitionModel): Promise<CachedYieldSource[]> {
  const valueSources = [];
  try {
    const mapper = getDataMapper();
    for await (const source of mapper.query(
      CachedYieldSource,
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
    id: getVaultEntityId({ network: vault.chain }, vault),
    chain: vault.chain,
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

export async function queryYieldProjection(vault: VaultDefinitionModel): Promise<VaultYieldProjectionV3> {
  try {
    const mapper = getDataMapper();
    const id = getVaultEntityId({ network: vault.chain }, vault);
    for await (const projection of mapper.query(CachedYieldProjection, { id }, { limit: 1 })) {
      return projection;
    }
    return defaultYieldProjection;
  } catch (err) {
    console.error(err);
    return defaultYieldProjection;
  }
}
