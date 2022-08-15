"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProtocolValueSources =
  exports.getVaultValueSources =
  exports.getRewardEmission =
  exports.getClaimableRewards =
  exports.getTreeDistribution =
  exports.DIGG_SHARE_PER_FRAGMENT =
    void 0;
const sdk_1 = require("@badger-dao/sdk");
const ethers_1 = require("ethers");
const accounts_utils_1 = require("../accounts/accounts.utils");
const s3_utils_1 = require("../aws/s3.utils");
const constants_1 = require("../config/constants");
const tokens_config_1 = require("../config/tokens.config");
const prices_utils_1 = require("../prices/prices.utils");
const balancer_strategy_1 = require("../protocols/strategies/balancer.strategy");
const convex_strategy_1 = require("../protocols/strategies/convex.strategy");
const oxdao_strategy_1 = require("../protocols/strategies/oxdao.strategy");
const sushiswap_strategy_1 = require("../protocols/strategies/sushiswap.strategy");
const swapr_strategy_1 = require("../protocols/strategies/swapr.strategy");
const uniswap_strategy_1 = require("../protocols/strategies/uniswap.strategy");
const tokens_utils_1 = require("../tokens/tokens.utils");
const vaults_utils_1 = require("../vaults/vaults.utils");
const yields_utils_1 = require("../vaults/yields.utils");
const source_type_enum_1 = require("./enums/source-type.enum");
exports.DIGG_SHARE_PER_FRAGMENT = "222256308823765331027878635805365830922307440079959220679625904457";
async function getTreeDistribution(chain) {
  try {
    const fileName = `badger-tree-${chain.chainId}.json`;
    const rewardFile = await (0, s3_utils_1.getObject)(constants_1.REWARD_DATA, fileName);
    return JSON.parse(rewardFile.toString("utf-8"));
  } catch (err) {
    console.error({ message: `Missing expected badger tree file for ${chain.network}`, err });
    return null;
  }
}
exports.getTreeDistribution = getTreeDistribution;
async function getClaimableRewards(chain, chainUsers, distribution, blockNumber) {
  const { rewards } = await chain.getSdk();
  const { badgerTree } = rewards;
  const requests = chainUsers.map(async (user) => {
    const proof = distribution.claims[user];
    if (!proof) {
      return [user, [[], []]];
    }
    let attempt = 0;
    while (attempt < 3) {
      try {
        const result = await badgerTree.getClaimableFor(user, proof.tokens, proof.cumulativeAmounts, {
          blockTag: blockNumber
        });
        return [user, result];
      } catch (err) {
        for (let i = 0; i < proof.tokens.length; i++) {
          const token = proof.tokens[i];
          const amount = await badgerTree.claimed(user, token);
          if (ethers_1.BigNumber.from(proof.cumulativeAmounts[i]).lt(amount))
            proof.cumulativeAmounts[i] = amount.toString();
        }
        attempt++;
        // report a recurring issue for claimable
        if (attempt === 3) {
          console.error(err);
        }
      }
    }
    return [user, [[], []]];
  });
  return Promise.all(requests);
}
exports.getClaimableRewards = getClaimableRewards;
async function getRewardEmission(chain, vault) {
  var _a;
  const boostFile = await (0, accounts_utils_1.getBoostFile)(chain);
  const sdk = await chain.getSdk();
  if (!sdk.rewards.hasRewardsLogger() || vault.depositToken === tokens_config_1.TOKENS.DIGG || !boostFile) {
    return [];
  }
  const { address } = vault;
  const cachedVault = await (0, vaults_utils_1.getCachedVault)(chain, vault);
  if (address === tokens_config_1.TOKENS.BVECVX) {
    delete boostFile.multiplierData[address];
  }
  const boostRange = (_a = boostFile.multiplierData[address]) !== null && _a !== void 0 ? _a : { min: 1, max: 1 };
  const activeSchedules = await sdk.rewards.loadActiveSchedules(address);
  // Badger controlled addresses are blacklisted from receiving rewards. We only dogfood on ETH
  let ignoredTVL = 0;
  if (chain.network === sdk_1.Network.Ethereum) {
    const blacklistedAccounts = await Promise.all([
      (0, accounts_utils_1.getCachedAccount)(chain, "0xB65cef03b9B89f99517643226d76e286ee999e77"),
      (0, accounts_utils_1.getCachedAccount)(chain, "0x86cbD0ce0c087b482782c181dA8d191De18C8275"),
      (0, accounts_utils_1.getCachedAccount)(chain, "0x042B32Ac6b453485e357938bdC38e0340d4b9276"),
      (0, accounts_utils_1.getCachedAccount)(chain, "0xD0A7A8B98957b9CD3cFB9c0425AbE44551158e9e"),
      (0, accounts_utils_1.getCachedAccount)(chain, "0xA9ed98B5Fb8428d68664f3C5027c62A10d45826b") // treasury bveCVX voting multisig
    ]);
    ignoredTVL = blacklistedAccounts
      .map((a) => a.data[vault.address])
      .map((s) => (s ? s.value : 0))
      .reduce((total, value) => total + value, 0);
  }
  /**
   * Calculate rewards emission percentages:
   *   - P: Price of Token
   *   - A: Amount of Token Emitted
   *   - D: Duration of Token Emission in Seconds
   *   - S: Number of Seconds Per Year
   *   - L: Amount of Value Locked in Sett
   *
   * Reward APR is determined by the extrapolated one year value emitted
   * from the unlock schedues as a percentage of the current locked value.
   *
   * APR = (P * A * (S / D)) / L * 100
   *
   * This vaule is calculated for all tokens emitted for any given sett
   * and persisted against that sett. There is a 20 minute grace period for
   * emission that have since ended, and only the latest active emission
   * will be used for yield calcuation.
   */
  const emissionSources = [];
  for (const schedule of activeSchedules) {
    const tokenPrice = await (0, prices_utils_1.getPrice)(schedule.token);
    const token = await (0, tokens_utils_1.getFullToken)(chain, schedule.token);
    const durationScalar = constants_1.ONE_YEAR_SECONDS / (schedule.end - schedule.start);
    const yearlyEmission = tokenPrice.price * schedule.amount * durationScalar;
    const apr = (yearlyEmission / (cachedVault.value - ignoredTVL)) * 100;
    let proRataApr = apr;
    if (cachedVault.boost.enabled && token.address === chain.getBadgerTokenAddress()) {
      const boostedApr = (cachedVault.boost.weight / 10000) * proRataApr;
      proRataApr = proRataApr - boostedApr;
      const boostedName = `Boosted ${token.name}`;
      const boostYieldSource = (0, yields_utils_1.createYieldSource)(
        vault,
        source_type_enum_1.SourceType.Emission,
        boostedName,
        boostedApr,
        boostRange
      );
      emissionSources.push(boostYieldSource);
    }
    const proRataYieldSource = (0, yields_utils_1.createYieldSource)(
      vault,
      source_type_enum_1.SourceType.Emission,
      token.name,
      proRataApr
    );
    emissionSources.push(proRataYieldSource);
  }
  return emissionSources;
}
exports.getRewardEmission = getRewardEmission;
async function getVaultValueSources(chain, vaultDefinition) {
  // manual over ride for removed compounding of vaults - this can be empty
  const NO_COMPOUND_VAULTS = new Set([
    tokens_config_1.TOKENS.BREMBADGER,
    tokens_config_1.TOKENS.BVECVX,
    tokens_config_1.TOKENS.BCVX
  ]);
  let sources = [];
  try {
    sources = await (0, vaults_utils_1.getVaultPerformance)(chain, vaultDefinition);
    const hasNoUnderlying = NO_COMPOUND_VAULTS.has(vaultDefinition.address);
    if (hasNoUnderlying) {
      sources = sources.filter(
        (s) => s.type !== source_type_enum_1.SourceType.Compound && s.type !== source_type_enum_1.SourceType.PreCompound
      );
    }
    return sources;
  } catch (err) {
    console.log({ vaultDefinition, err, sources });
    return [];
  }
}
exports.getVaultValueSources = getVaultValueSources;
async function getProtocolValueSources(chain, vaultDefinition) {
  try {
    switch (vaultDefinition.protocol) {
      case sdk_1.Protocol.Sushiswap:
        return sushiswap_strategy_1.SushiswapStrategy.getValueSources(chain, vaultDefinition);
      case sdk_1.Protocol.Curve:
      case sdk_1.Protocol.Convex:
        return convex_strategy_1.ConvexStrategy.getValueSources(chain, vaultDefinition);
      case sdk_1.Protocol.Uniswap:
        return uniswap_strategy_1.UniswapStrategy.getValueSources(vaultDefinition);
      case sdk_1.Protocol.Swapr:
        return swapr_strategy_1.SwaprStrategy.getValueSources(chain, vaultDefinition);
      case sdk_1.Protocol.OxDAO:
        return oxdao_strategy_1.OxDaoStrategy.getValueSources(chain, vaultDefinition);
      case sdk_1.Protocol.Aura:
      case sdk_1.Protocol.Balancer:
        return balancer_strategy_1.BalancerStrategy.getValueSources(vaultDefinition);
      default: {
        return [];
      }
    }
  } catch (error) {
    console.log({ error, message: `Failed to update value sources for ${vaultDefinition.protocol}` });
    return [];
  }
}
exports.getProtocolValueSources = getProtocolValueSources;
//# sourceMappingURL=rewards.utils.js.map
