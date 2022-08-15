"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastCompoundHarvest =
  exports.getVaultHarvestsOnChain =
  exports.queryYieldEstimate =
  exports.queryYieldSources =
  exports.estimateVaultPerformance =
  exports.estimateHarvestEventApr =
  exports.loadVaultGraphPerformances =
  exports.estimateDerivativeEmission =
  exports.loadVaultEventPerformances =
  exports.getVaultPerformance =
  exports.getVaultTokenPrice =
  exports.getBoostWeight =
  exports.getStrategyInfo =
  exports.getCachedVault =
  exports.defaultVault =
  exports.VAULT_SOURCE =
    void 0;
const sdk_1 = require("@badger-dao/sdk");
const exceptions_1 = require("@tsed/exceptions");
const ethers_1 = require("ethers");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const current_vault_snapshot_model_1 = require("../aws/models/current-vault-snapshot.model");
const harvest_compound_model_1 = require("../aws/models/harvest-compound.model");
const yield_estimate_model_1 = require("../aws/models/yield-estimate.model");
const yield_source_model_1 = require("../aws/models/yield-source.model");
const chain_config_1 = require("../chains/config/chain.config");
const constants_1 = require("../config/constants");
const tokens_config_1 = require("../config/tokens.config");
const contracts_1 = require("../contracts");
const indexer_utils_1 = require("../indexers/indexer.utils");
const pricing_type_enum_1 = require("../prices/enums/pricing-type.enum");
const prices_utils_1 = require("../prices/prices.utils");
const source_type_enum_1 = require("../rewards/enums/source-type.enum");
const rewards_utils_1 = require("../rewards/rewards.utils");
const tokens_utils_1 = require("../tokens/tokens.utils");
const harvest_enum_1 = require("./enums/harvest.enum");
const yields_utils_1 = require("./yields.utils");
exports.VAULT_SOURCE = "Vault Compounding";
const VAULT_TWAY_PERIOD = 15;
async function defaultVault(chain, vault) {
  const { state, bouncer, behavior, version, protocol, name, depositToken, address } = vault;
  const [assetToken, vaultToken] = await Promise.all([
    (0, tokens_utils_1.getFullToken)(chain, depositToken),
    (0, tokens_utils_1.getFullToken)(chain, address)
  ]);
  const type = protocol === sdk_1.Protocol.Badger ? sdk_1.VaultType.Native : sdk_1.VaultType.Standard;
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
      weight: 0
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
      address: ethers_1.ethers.constants.AddressZero,
      withdrawFee: 0,
      performanceFee: 0,
      strategistFee: 0,
      aumFee: 0
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
      nonHarvestSourcesApy: []
    },
    lastHarvest: 0,
    version
  };
}
exports.defaultVault = defaultVault;
// TODO: vault should migration from address -> id where id = chain.network-vault.address
async function getCachedVault(chain, vaultDefinition, currency = sdk_1.Currency.USD) {
  const vault = await defaultVault(chain, vaultDefinition);
  try {
    const mapper = (0, dynamodb_utils_1.getDataMapper)();
    for await (const item of mapper.query(
      current_vault_snapshot_model_1.CurrentVaultSnapshotModel,
      { address: vaultDefinition.address },
      { limit: 1, scanIndexForward: false }
    )) {
      vault.available = item.available;
      vault.balance = item.balance;
      vault.value = item.value;
      if (item.balance === 0 || item.totalSupply === 0) {
        vault.pricePerFullShare = 1;
      } else if (vaultDefinition.address === tokens_config_1.TOKENS.BDIGG) {
        vault.pricePerFullShare = item.balance / item.totalSupply;
      } else {
        vault.pricePerFullShare = item.pricePerFullShare;
      }
      vault.strategy = item.strategy;
      vault.boost = {
        enabled: item.boostWeight > 0,
        weight: item.boostWeight
      };
      const [tokens, convertedValue] = await Promise.all([
        (0, tokens_utils_1.getVaultTokens)(chain, vault, currency),
        (0, prices_utils_1.convert)(item.value, currency)
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
exports.getCachedVault = getCachedVault;
async function getStrategyInfo(chain, vault) {
  var _a;
  const defaultStrategyInfo = {
    address: ethers_1.ethers.constants.AddressZero,
    withdrawFee: 0,
    performanceFee: 0,
    strategistFee: 0,
    aumFee: 0
  };
  try {
    const sdk = await chain.getSdk();
    const version = (_a = vault.version) !== null && _a !== void 0 ? _a : sdk_1.VaultVersion.v1;
    const strategyAddress = await sdk.vaults.getVaultStrategy({
      address: vault.address,
      version
    });
    if (version === sdk_1.VaultVersion.v1) {
      const strategy = sdk_1.Strategy__factory.connect(strategyAddress, sdk.provider);
      // you know, these things happen...
      // eslint-disable-next-line prefer-const
      let [withdrawFee, performanceFee, strategistFee] = await Promise.all([
        strategy.withdrawalFee(),
        strategy.performanceFeeGovernance(),
        strategy.performanceFeeStrategist()
      ]);
      // bveCVX does not have a way to capture materially its performance fee
      if (vault.address === tokens_config_1.TOKENS.BVECVX) {
        performanceFee = ethers_1.BigNumber.from("1500"); // set performance fee to 15%
      }
      return {
        address: strategyAddress,
        withdrawFee: withdrawFee.toNumber(),
        performanceFee: performanceFee.toNumber(),
        strategistFee: strategistFee.toNumber(),
        aumFee: 0
      };
    } else {
      const vaultContract = sdk_1.VaultV15__factory.connect(vault.address, sdk.provider);
      const [withdrawFee, performanceFee, strategistFee, aumFee] = await Promise.all([
        vaultContract.withdrawalFee(),
        vaultContract.performanceFeeGovernance(),
        vaultContract.performanceFeeStrategist(),
        vaultContract.managementFee()
      ]);
      return {
        address: strategyAddress,
        withdrawFee: withdrawFee.toNumber(),
        performanceFee: performanceFee.toNumber(),
        strategistFee: strategistFee.toNumber(),
        aumFee: aumFee.toNumber()
      };
    }
  } catch (err) {
    console.error(err);
    return defaultStrategyInfo;
  }
}
exports.getStrategyInfo = getStrategyInfo;
async function getBoostWeight(chain, vault) {
  if (!chain.emissionControl) {
    return ethers_1.ethers.constants.Zero;
  }
  try {
    const emissionControl = contracts_1.EmissionControl__factory.connect(chain.emissionControl, chain.provider);
    return emissionControl.boostedEmissionRate(vault.address);
  } catch (err) {
    console.error(err);
    return ethers_1.ethers.constants.Zero;
  }
}
exports.getBoostWeight = getBoostWeight;
/**
 * Get pricing information for a vault token.
 * @param chain Block chain instance
 * @param address Address for vault token.
 * @returns Pricing data for the given vault token based on the pricePerFullShare.
 */
async function getVaultTokenPrice(chain, address) {
  const token = await (0, tokens_utils_1.getFullToken)(chain, address);
  if (token.type !== pricing_type_enum_1.PricingType.Vault) {
    throw new exceptions_1.BadRequest(`${token.name} is not a vault token`);
  }
  const { vaultToken } = token;
  if (!vaultToken) {
    throw new exceptions_1.UnprocessableEntity(`${token.name} vault token missing`);
  }
  const isCrossChainVault = chain.network !== vaultToken.network;
  const targetChain = isCrossChainVault ? chain_config_1.Chain.getChain(vaultToken.network) : chain;
  const targetVault = isCrossChainVault ? vaultToken.address : token.address;
  const vault = await targetChain.vaults.getVault(targetVault);
  const [underlyingTokenPrice, vaultTokenSnapshot] = await Promise.all([
    (0, prices_utils_1.getPrice)(vaultToken.address),
    getCachedVault(chain, vault)
  ]);
  return {
    address: token.address,
    price: underlyingTokenPrice.price * vaultTokenSnapshot.pricePerFullShare
  };
}
exports.getVaultTokenPrice = getVaultTokenPrice;
const vaultLookupMethod = {};
/**
 * Load a Badger vault measured performance.
 * @param chain Chain vault is deployed on
 * @param vault Vault definition of requested vault
 * @returns Value source array describing vault performance
 */
async function getVaultPerformance(chain, vault) {
  const [rewardEmissions, protocol] = await Promise.all([
    (0, rewards_utils_1.getRewardEmission)(chain, vault),
    (0, rewards_utils_1.getProtocolValueSources)(chain, vault)
  ]);
  let vaultSources = [];
  try {
    vaultSources = await loadVaultEventPerformances(chain, vault);
  } catch {
    vaultSources = await loadVaultGraphPerformances(chain, vault);
  }
  console.log(`${vault.name}: ${vaultLookupMethod[vault.address]}`);
  // handle aggregation of various sources - this unfortunately loses the ddb schemas and need to be reassigned
  const aggregatedSources = (0, yields_utils_1.aggregateSources)(
    [...vaultSources, ...rewardEmissions, ...protocol],
    (s) => s.id
  );
  return aggregatedSources.map((s) => Object.assign(new yield_source_model_1.YieldSource(), s));
}
exports.getVaultPerformance = getVaultPerformance;
async function loadVaultEventPerformances(chain, vault) {
  var _a;
  const incompatibleNetworks = new Set([
    sdk_1.Network.BinanceSmartChain,
    sdk_1.Network.Polygon,
    sdk_1.Network.Arbitrum
  ]);
  if (incompatibleNetworks.has(chain.network)) {
    throw new Error("Network does not have standardized vaults!");
  }
  // TODO: refactor this to a known list of any external harvest processor vaults
  if (vault.address === tokens_config_1.TOKENS.BVECVX) {
    throw new Error("Vault utilizes external harvest processor, not compatible with event lookup");
  }
  const sdk = await chain.getSdk();
  const cutoffPeriod = VAULT_TWAY_PERIOD * constants_1.ONE_DAY_SECONDS;
  const cutoff = Date.now() / 1000 - cutoffPeriod;
  const startBlock = (await sdk.provider.getBlockNumber()) - Math.floor(cutoffPeriod / 13);
  const { data } = await sdk.vaults.listHarvests({
    address: vault.address,
    timestamp_gte: cutoff,
    version: (_a = vault.version) !== null && _a !== void 0 ? _a : sdk_1.VaultVersion.v1,
    startBlock
  });
  vaultLookupMethod[vault.address] = "EventAPR";
  return estimateVaultPerformance(chain, vault, data);
}
exports.loadVaultEventPerformances = loadVaultEventPerformances;
/**
 * Extrapolates a one-year APR for a given vault based on compounding and emissions based on $100 deposit.
 * @param compoundApr Base compound APR of vault
 * @param emissionApr Emission APR of the emitted vault
 * @param emissionCompoundApr Derivative compound APR of the tmitted vault
 * @returns Extraposedat one year APR given current yields continue
 */
function estimateDerivativeEmission(
  compoundApr,
  emissionApr,
  emissionCompoundApr,
  compoundingStep = 1,
  emissionStep = 1
) {
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
exports.estimateDerivativeEmission = estimateDerivativeEmission;
// subgraph based emissions retrieval
// should we put this into the sdk?
async function loadVaultGraphPerformances(chain, vault) {
  const { address } = vault;
  // TODO: bruh wtf bls what do, need to fix / remove this probably
  // digg does not play well with this accounting
  if (address === tokens_config_1.TOKENS.DIGG) {
    return [];
  }
  const { graph } = chain.sdk;
  const now = Math.floor(Date.now() / 1000);
  const cutoff = Math.floor(now - VAULT_TWAY_PERIOD * constants_1.ONE_DAY_SECONDS);
  let [vaultHarvests, treeDistributions] = await Promise.all([
    graph.loadSettHarvests({
      where: {
        sett: address.toLowerCase(),
        timestamp_gte: cutoff
      }
    }),
    graph.loadBadgerTreeDistributions({
      where: {
        sett: address.toLowerCase(),
        timestamp_gte: cutoff
      }
    })
  ]);
  let { settHarvests } = vaultHarvests;
  let { badgerTreeDistributions } = treeDistributions;
  vaultLookupMethod[address] = "GraphAPR";
  let data = constructGraphVaultData(vault, settHarvests, badgerTreeDistributions);
  // if there are no recent viable options, attempt to use the full vault history
  if (data.length <= 1) {
    // take the last 6 weeks as the "full graph" to avoid really old data
    const cutoff = Number(((Date.now() - sdk_1.ONE_DAY_MS * 42) / 1000).toFixed());
    [vaultHarvests, treeDistributions] = await Promise.all([
      graph.loadSettHarvests({
        where: {
          sett: address.toLowerCase(),
          timestamp_gte: cutoff
        }
      }),
      graph.loadBadgerTreeDistributions({
        where: {
          sett: address.toLowerCase(),
          timestamp_gte: cutoff
        }
      })
    ]);
    settHarvests = vaultHarvests.settHarvests;
    badgerTreeDistributions = treeDistributions.badgerTreeDistributions;
    vaultLookupMethod[address] = "FullGraphAPR";
    data = constructGraphVaultData(vault, settHarvests, badgerTreeDistributions);
  }
  // if we still don't have harvests or distributions - don't bother there is nothing to compute
  if (data.length <= 1) {
    return [];
  }
  return estimateVaultPerformance(chain, vault, data);
}
exports.loadVaultGraphPerformances = loadVaultGraphPerformances;
function constructGraphVaultData(vault, settHarvests, badgerTreeDistributions) {
  const harvestsByTimestamp = (0, sdk_1.keyBy)(settHarvests, (harvest) => harvest.timestamp);
  const treeDistributionsByTimestamp = (0, sdk_1.keyBy)(
    badgerTreeDistributions,
    (distribution) => distribution.timestamp
  );
  const timestamps = Array.from(
    new Set([...harvestsByTimestamp.keys(), ...treeDistributionsByTimestamp.keys()]).values()
  );
  return timestamps.map((t) => {
    var _a, _b;
    const timestamp = Number(t);
    const currentHarvests = (_a = harvestsByTimestamp.get(timestamp)) !== null && _a !== void 0 ? _a : [];
    const currentDistributions = (_b = treeDistributionsByTimestamp.get(timestamp)) !== null && _b !== void 0 ? _b : [];
    return {
      timestamp,
      harvests: currentHarvests.map((h) => ({
        timestamp,
        block: Number(h.blockNumber),
        token: vault.depositToken,
        amount: h.amount
      })),
      treeDistributions: currentDistributions.map((d) => {
        const tokenAddress = d.token.id.startsWith("0x0x") ? d.token.id.slice(2) : d.token.id;
        return {
          timestamp,
          block: Number(d.blockNumber),
          token: tokenAddress,
          amount: d.amount
        };
      })
    };
  });
}
async function estimateHarvestEventApr(chain, token, start, end, amount, balance) {
  const duration = end - start;
  const depositToken = await (0, tokens_utils_1.getFullToken)(chain, token);
  const fmtBalance = (0, sdk_1.formatBalance)(balance, depositToken.decimals);
  const totalHarvestedTokens = (0, sdk_1.formatBalance)(amount || ethers_1.BigNumber.from(0), depositToken.decimals);
  const durationScalar = constants_1.ONE_YEAR_SECONDS / duration;
  const compoundApr = (totalHarvestedTokens / fmtBalance) * durationScalar * 100;
  return parseFloat(compoundApr.toFixed(2));
}
exports.estimateHarvestEventApr = estimateHarvestEventApr;
async function estimateVaultPerformance(chain, vault, data) {
  var _a, _b;
  const recentHarvests = data.sort((a, b) => b.timestamp - a.timestamp);
  if (recentHarvests.length <= 1) {
    throw new Error(`${vault.name} does not have adequate harvest history`);
  }
  let totalDuration;
  // TODO: generalize this for voting vaults + look up their voting periods
  if (vault.address === tokens_config_1.TOKENS.BVECVX) {
    totalDuration = constants_1.ONE_DAY_SECONDS * 14;
  } else {
    totalDuration = recentHarvests[0].timestamp - recentHarvests[data.length - 1].timestamp;
  }
  const cachedVault = await getCachedVault(chain, vault);
  let measuredHarvests;
  if (vault.address === tokens_config_1.TOKENS.BVECVX) {
    const cutoff = recentHarvests[0].timestamp - totalDuration;
    measuredHarvests = recentHarvests.filter((h) => h.timestamp > cutoff).slice(0, recentHarvests.length - 1);
  } else {
    measuredHarvests = recentHarvests.slice(0, recentHarvests.length - 1);
  }
  const valueSources = [];
  const harvests = measuredHarvests.flatMap((h) => h.harvests);
  const totalHarvested = harvests
    .map((h) => h.amount)
    .reduce((total, harvested) => total.add(harvested), ethers_1.BigNumber.from(0));
  let weightedBalance = 0;
  const depositToken = await (0, tokens_utils_1.getFullToken)(chain, vault.depositToken);
  // this will probably need more generalization, quickly becoming a huge pain in the ass
  if (vault.address === tokens_config_1.TOKENS.BVECVX) {
    const sdk = await chain.getSdk();
    const targetBlock = recentHarvests[0].treeDistributions[0].block;
    const vaultContract = sdk_1.Vault__factory.connect(vault.address, sdk.provider);
    const strategyBalance = await vaultContract.totalSupply({ blockTag: targetBlock });
    weightedBalance = (0, sdk_1.formatBalance)(strategyBalance);
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
      const { sett } = await (0, indexer_utils_1.getVault)(chain, vault.address, end.block);
      if (sett) {
        const balance =
          (_b = (_a = sett.strategy) === null || _a === void 0 ? void 0 : _a.balance) !== null && _b !== void 0
            ? _b
            : sett.balance;
        weightedBalance += duration * (0, sdk_1.formatBalance)(balance, depositToken.decimals);
      } else {
        weightedBalance += duration * cachedVault.balance;
      }
    }
  }
  // TODO: generalize or combine weighted balance calculation and distribution timestamp aggregation
  if (weightedBalance === 0) {
    weightedBalance = cachedVault.balance * totalDuration;
  }
  const { price } = await (0, prices_utils_1.getPrice)(vault.depositToken);
  const measuredBalance = weightedBalance / totalDuration;
  // lord, forgive me for my sins... we will generalize this shortly I hope
  const measuredValue = (vault.address === tokens_config_1.TOKENS.BVECVX ? weightedBalance : measuredBalance) * price;
  const totalHarvestedTokens = (0, sdk_1.formatBalance)(totalHarvested, depositToken.decimals);
  // count of harvests is exclusive of the 0th element
  const durationScalar = constants_1.ONE_YEAR_SECONDS / totalDuration;
  // take the less frequent period, the actual harvest frequency or daily
  const periods = Math.min(365, durationScalar * measuredHarvests.length);
  // create the apr source for harvests
  const compoundApr = (totalHarvestedTokens / measuredBalance) * durationScalar;
  const compoundYieldSource = (0, yields_utils_1.createYieldSource)(
    vault,
    source_type_enum_1.SourceType.PreCompound,
    exports.VAULT_SOURCE,
    compoundApr * 100
  );
  valueSources.push(compoundYieldSource);
  // create the apy source for harvests
  const compoundApy = (1 + compoundApr / periods) ** periods - 1;
  const compoundedYieldSource = (0, yields_utils_1.createYieldSource)(
    vault,
    source_type_enum_1.SourceType.Compound,
    exports.VAULT_SOURCE,
    compoundApy * 100
  );
  valueSources.push(compoundedYieldSource);
  const treeDistributions = measuredHarvests.flatMap((h) => h.treeDistributions);
  const tokensEmitted = new Map();
  for (const distribution of treeDistributions) {
    const { token, amount } = distribution;
    let entry = tokensEmitted.get(token);
    if (!entry) {
      entry = ethers_1.BigNumber.from(0);
      tokensEmitted.set(token, entry);
    }
    tokensEmitted.set(token, entry.add(amount));
  }
  let flywheelCompounding = 0;
  for (const [token, amount] of tokensEmitted.entries()) {
    const { price } = await (0, prices_utils_1.getPrice)(token);
    if (price === 0) {
      continue;
    }
    const tokenEmitted = await (0, tokens_utils_1.getFullToken)(chain, token);
    const tokensEmitted = (0, sdk_1.formatBalance)(amount, tokenEmitted.decimals);
    const valueEmitted = tokensEmitted * price;
    const emissionApr = (valueEmitted / measuredValue) * durationScalar;
    const emissionYieldSource = (0, yields_utils_1.createYieldSource)(
      vault,
      source_type_enum_1.SourceType.Distribution,
      tokenEmitted.name,
      emissionApr * 100
    );
    valueSources.push(emissionYieldSource);
    // try to add underlying emitted vault value sources if applicable
    try {
      const emittedVault = await chain.vaults.getVault(tokenEmitted.address);
      const vaultValueSources = await queryYieldSources(emittedVault);
      // search for the persisted apr variant of the compounding vault source, if any
      const compoundingSource = vaultValueSources.find(
        (source) => source.type === source_type_enum_1.SourceType.PreCompound
      );
      if (compoundingSource) {
        flywheelCompounding += estimateDerivativeEmission(compoundApr, emissionApr, compoundingSource.apr / 100);
      }
    } catch {} // ignore error for non vaults
  }
  if (flywheelCompounding > 0) {
    const sourceName = `Vault Flywheel`;
    const flywheelYieldSource = (0, yields_utils_1.createYieldSource)(
      vault,
      source_type_enum_1.SourceType.Flywheel,
      sourceName,
      flywheelCompounding
    );
    valueSources.push(flywheelYieldSource);
  }
  return valueSources;
}
exports.estimateVaultPerformance = estimateVaultPerformance;
async function queryYieldSources(vault) {
  const valueSources = [];
  const mapper = (0, dynamodb_utils_1.getDataMapper)();
  for await (const source of mapper.query(
    yield_source_model_1.YieldSource,
    { chainAddress: vault.id },
    { indexName: "IndexApySnapshotsOnAddress" }
  )) {
    valueSources.push(source);
  }
  return valueSources;
}
exports.queryYieldSources = queryYieldSources;
async function queryYieldEstimate(vault) {
  const yieldEstimate = {
    vault: vault.address,
    yieldTokens: [],
    harvestTokens: [],
    lastHarvestedAt: 0,
    previousYieldTokens: [],
    previousHarvestTokens: [],
    lastMeasuredAt: 0,
    duration: 0,
    lastReportedAt: 0
  };
  try {
    const mapper = (0, dynamodb_utils_1.getDataMapper)();
    for await (const item of mapper.query(
      yield_estimate_model_1.YieldEstimate,
      { vault: vault.address },
      { limit: 1 }
    )) {
      return item;
    }
    return yieldEstimate;
  } catch (err) {
    console.error(err);
    return yieldEstimate;
  }
}
exports.queryYieldEstimate = queryYieldEstimate;
async function getVaultHarvestsOnChain(chain, address, startFromBlock = null) {
  var _a;
  const vaultHarvests = [];
  const sdk = await chain.getSdk();
  const { version, depositToken } = await chain.vaults.getVault(address);
  let sdkVaultHarvestsResp = { data: [] };
  try {
    const listHarvestsArgs = {
      address,
      version
    };
    if (startFromBlock) listHarvestsArgs.startBlock = startFromBlock;
    sdkVaultHarvestsResp = await sdk.vaults.listHarvests(listHarvestsArgs);
  } catch (e) {
    console.warn(`Failed to get harvests list ${e}`);
  }
  if (
    !sdkVaultHarvestsResp ||
    ((_a = sdkVaultHarvestsResp === null || sdkVaultHarvestsResp === void 0 ? void 0 : sdkVaultHarvestsResp.data) ===
      null || _a === void 0
      ? void 0
      : _a.length) === 0
  ) {
    return vaultHarvests;
  }
  const sdkVaultHarvests = sdkVaultHarvestsResp.data;
  const harvestsStartEndMap = {};
  const _extend_harvests_data = async (harvestsList, eventType) => {
    var _a, _b;
    if (!harvestsList || (harvestsList === null || harvestsList === void 0 ? void 0 : harvestsList.length) === 0)
      return;
    for (let i = 0; i < harvestsList.length; i++) {
      const harvest = harvestsList[i];
      const vaultGraph = await sdk.graph.loadSett({
        id: address.toLowerCase(),
        block: { number: harvest.block }
      });
      const harvestToken = harvest.token || depositToken;
      const depositTokenInfo = await (0, tokens_utils_1.getFullToken)(chain, harvestToken);
      const harvestAmount = (0, sdk_1.formatBalance)(
        harvest.amount || ethers_1.BigNumber.from(0),
        depositTokenInfo.decimals
      );
      const extendedHarvest = {
        ...harvest,
        token: harvestToken,
        amount: harvestAmount,
        eventType,
        strategyBalance: 0,
        estimatedApr: 0
      };
      if (vaultGraph === null || vaultGraph === void 0 ? void 0 : vaultGraph.sett) {
        const balance = ethers_1.BigNumber.from(
          ((_b = (_a = vaultGraph.sett) === null || _a === void 0 ? void 0 : _a.strategy) === null || _b === void 0
            ? void 0
            : _b.balance) ||
            vaultGraph.sett.balance ||
            0
        );
        extendedHarvest.strategyBalance = (0, sdk_1.formatBalance)(balance, depositTokenInfo.decimals);
        if (i === harvestsList.length - 1 && eventType === harvest_enum_1.HarvestType.Harvest) {
          vaultHarvests.push(extendedHarvest);
          continue;
        }
        const startOfHarvest = harvest.timestamp;
        let endOfCurrentHarvest;
        if (eventType === harvest_enum_1.HarvestType.Harvest) {
          endOfCurrentHarvest = harvestsList[i + 1].timestamp;
          harvestsStartEndMap[`${startOfHarvest}`] = endOfCurrentHarvest;
        } else if (eventType === harvest_enum_1.HarvestType.TreeDistribution) {
          endOfCurrentHarvest = harvestsStartEndMap[`${harvest.timestamp}`];
        }
        if (endOfCurrentHarvest) {
          extendedHarvest.estimatedApr = await estimateHarvestEventApr(
            chain,
            harvestToken,
            startOfHarvest,
            endOfCurrentHarvest,
            harvest.amount,
            balance
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
  await _extend_harvests_data(allHarvests, harvest_enum_1.HarvestType.Harvest);
  await _extend_harvests_data(allTreeDistributions, harvest_enum_1.HarvestType.TreeDistribution);
  return vaultHarvests;
}
exports.getVaultHarvestsOnChain = getVaultHarvestsOnChain;
async function getLastCompoundHarvest(vault) {
  const mapper = (0, dynamodb_utils_1.getDataMapper)();
  const query = mapper.query(
    harvest_compound_model_1.HarvestCompoundData,
    { vault },
    { limit: 1, scanIndexForward: false }
  );
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
exports.getLastCompoundHarvest = getLastCompoundHarvest;
//# sourceMappingURL=vaults.utils.js.map
