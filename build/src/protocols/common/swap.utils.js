"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTokenPrice = exports.getOnChainLiquidityPrice = exports.getLiquidityData = void 0;
const sdk_1 = require("@badger-dao/sdk");
const exceptions_1 = require("@tsed/exceptions");
const contracts_1 = require("../../contracts");
const prices_utils_1 = require("../../prices/prices.utils");
const tokens_utils_1 = require("../../tokens/tokens.utils");
async function getLiquidityData(chain, contract) {
  const sdk = await chain.getSdk();
  const pairContract = contracts_1.UniV2__factory.connect(contract, sdk.provider);
  const [totalPairSupply, token0, token1, reserves] = await Promise.all([
    pairContract.totalSupply(),
    pairContract.token0(),
    pairContract.token1(),
    pairContract.getReserves()
  ]);
  const totalSupply = (0, sdk_1.formatBalance)(totalPairSupply);
  const tokenData = await sdk.tokens.loadTokens([token0, token1]);
  const reserve0 = (0, sdk_1.formatBalance)(reserves._reserve0, tokenData[token0].decimals);
  const reserve1 = (0, sdk_1.formatBalance)(reserves._reserve1, tokenData[token1].decimals);
  return {
    contract: contract,
    token0: token0,
    token1: token1,
    reserve0: reserve0,
    reserve1: reserve1,
    totalSupply: totalSupply
  };
}
exports.getLiquidityData = getLiquidityData;
const getOnChainLiquidityPrice = async (chain, contract) => {
  try {
    const liquidityData = await getLiquidityData(chain, contract);
    if (liquidityData.totalSupply === 0) {
      const token = await (0, tokens_utils_1.getFullToken)(chain, contract);
      return {
        address: token.address,
        price: 0
      };
    }
    return resolveLiquidityPrice(chain, liquidityData);
  } catch (err) {
    console.log(err);
    throw new exceptions_1.NotFound(`No pair found for ${contract}`);
  }
};
exports.getOnChainLiquidityPrice = getOnChainLiquidityPrice;
const resolveLiquidityPrice = async (chain, liquidityData) => {
  const { contract, token0, token1, reserve0, reserve1, totalSupply } = liquidityData;
  let [t0Price, t1Price] = await Promise.all([
    (0, prices_utils_1.getPrice)(token0),
    (0, prices_utils_1.getPrice)(token1)
  ]);
  if (!t0Price && !t1Price) {
    throw new exceptions_1.UnprocessableEntity(`Token pair ${contract} cannot be priced`);
  }
  if (!t0Price) {
    const t1Scalar = reserve0 / reserve1;
    const t0Info = await (0, tokens_utils_1.getFullToken)(chain, token0);
    t0Price = {
      address: t0Info.address,
      price: t1Price.price * t1Scalar
    };
  }
  if (!t1Price) {
    const t0Scalar = reserve1 / reserve0;
    const t1Info = await (0, tokens_utils_1.getFullToken)(chain, token1);
    t1Price = {
      address: t1Info.address,
      price: t0Price.price * t0Scalar
    };
  }
  const token = await (0, tokens_utils_1.getFullToken)(chain, contract);
  const price = (t0Price.price * reserve0 + t1Price.price * reserve1) / totalSupply;
  return {
    address: token.address,
    price
  };
};
async function resolveTokenPrice(chain, token, contract) {
  const { token0, token1, reserve0, reserve1 } = await getLiquidityData(chain, contract);
  const sdk = await chain.getSdk();
  const pricingToken = await sdk.tokens.loadToken(token);
  const isToken0 = pricingToken.address === token0;
  const knownToken = isToken0 ? token1 : token0;
  const [divisor, dividend] = isToken0 ? [reserve1, reserve0] : [reserve0, reserve1];
  const knownTokenPrice = await (0, prices_utils_1.getPrice)(knownToken);
  if (!knownTokenPrice) {
    throw new exceptions_1.UnprocessableEntity(`Token ${pricingToken.name} cannot be priced`);
  }
  const scalar = divisor / dividend;
  const price = knownTokenPrice.price * scalar;
  return {
    address: pricingToken.address,
    price
  };
}
exports.resolveTokenPrice = resolveTokenPrice;
//# sourceMappingURL=swap.utils.js.map
