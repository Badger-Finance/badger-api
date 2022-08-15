"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStrategy = void 0;
const exceptions_1 = require("@tsed/exceptions");
const pricing_type_enum_1 = require("../../prices/enums/pricing-type.enum");
const swap_utils_1 = require("../../protocols/common/swap.utils");
const balancer_strategy_1 = require("../../protocols/strategies/balancer.strategy");
const convex_strategy_1 = require("../../protocols/strategies/convex.strategy");
const tokens_utils_1 = require("../../tokens/tokens.utils");
const vaults_utils_1 = require("../../vaults/vaults.utils");
const chain_config_1 = require("../config/chain.config");
const chain_strategy_1 = require("./chain.strategy");
class BaseStrategy extends chain_strategy_1.ChainStrategy {
  constructor(network, tokens) {
    super();
    this.network = network;
    chain_strategy_1.ChainStrategy.register(this, tokens);
  }
  async getPrice(address) {
    const chain = chain_config_1.Chain.getChain(this.network);
    const token = await (0, tokens_utils_1.getFullToken)(chain, address);
    const tokenConfig = chain.tokens[address];
    switch (token.type) {
      case pricing_type_enum_1.PricingType.Custom:
        if (!token.getPrice) {
          throw new exceptions_1.UnprocessableEntity(`${token.name} requires custom price implementation`);
        }
        return token.getPrice(chain, token, tokenConfig.lookupName);
      case pricing_type_enum_1.PricingType.OnChainUniV2LP:
        if (!token.lookupName) {
          throw new exceptions_1.UnprocessableEntity(
            `${token.name} required lookupName to utilize OnChainUniV2LP pricing`
          );
        }
        return (0, swap_utils_1.resolveTokenPrice)(chain, token.address, token.lookupName);
      case pricing_type_enum_1.PricingType.BalancerLP:
        return (0, balancer_strategy_1.getBPTPrice)(chain, token.address);
      case pricing_type_enum_1.PricingType.CurveLP:
        return (0, convex_strategy_1.getCurveTokenPrice)(chain, token.address);
      case pricing_type_enum_1.PricingType.UniV2LP:
        return (0, swap_utils_1.getOnChainLiquidityPrice)(chain, token.address);
      case pricing_type_enum_1.PricingType.Vault:
        return (0, vaults_utils_1.getVaultTokenPrice)(chain, token.address);
      case pricing_type_enum_1.PricingType.Contract:
      case pricing_type_enum_1.PricingType.LookupName:
        throw new exceptions_1.UnprocessableEntity("CoinGecko pricing should utilize fetchPrices via utilities");
      default:
        throw new exceptions_1.UnprocessableEntity("Unsupported PricingType");
    }
  }
}
exports.BaseStrategy = BaseStrategy;
//# sourceMappingURL=base.strategy.js.map
