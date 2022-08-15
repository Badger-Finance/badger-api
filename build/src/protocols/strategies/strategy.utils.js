"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSwapValue = exports.getUniV2SwapValue = void 0;
const graphql_request_1 = require("graphql-request");
const uniswap_1 = require("../../graphql/generated/uniswap");
const prices_utils_1 = require("../../prices/prices.utils");
const source_type_enum_1 = require("../../rewards/enums/source-type.enum");
const yields_utils_1 = require("../../vaults/yields.utils");
async function getUniV2SwapValue(graphUrl, vault) {
  const client = new graphql_request_1.GraphQLClient(graphUrl);
  const sdk = (0, uniswap_1.getSdk)(client);
  const { pairDayDatas } = await sdk.UniPairDayDatas({
    first: 30,
    orderBy: uniswap_1.PairDayData_OrderBy.Date,
    orderDirection: uniswap_1.OrderDirection.Desc,
    where: {
      pairAddress: vault.depositToken.toLowerCase()
    }
  });
  return getUniSwapValue(vault, pairDayDatas);
}
exports.getUniV2SwapValue = getUniV2SwapValue;
async function getUniSwapValue(vault, tradeData) {
  const name = `${vault.protocol} LP Fees`;
  if (!tradeData || tradeData.length === 0) {
    return (0, yields_utils_1.createYieldSource)(vault, source_type_enum_1.SourceType.TradeFee, name, 0);
  }
  const [token0Price, token1Price] = await Promise.all([
    (0, prices_utils_1.getPrice)(tradeData[0].token0.id),
    (0, prices_utils_1.getPrice)(tradeData[0].token1.id)
  ]);
  let totalApy = 0;
  let currentApy = 0;
  for (let i = 0; i < tradeData.length; i++) {
    const token0Volume = Number(tradeData[i].dailyVolumeToken0) * token0Price.price;
    const token1Volume = Number(tradeData[i].dailyVolumeToken1) * token1Price.price;
    const poolReserve = Number(tradeData[i].reserveUSD);
    const fees = (token0Volume + token1Volume) * 0.003;
    totalApy += (fees / poolReserve) * 365 * 100;
    currentApy = totalApy / (i + 1);
  }
  return (0, yields_utils_1.createYieldSource)(vault, source_type_enum_1.SourceType.TradeFee, name, currentApy);
}
function getSwapValue(vault, tradeData) {
  const name = `${vault.protocol} LP Fees`;
  if (!tradeData || tradeData.length === 0) {
    return (0, yields_utils_1.createYieldSource)(vault, source_type_enum_1.SourceType.TradeFee, name, 0);
  }
  let totalApy = 0;
  let currentApy = 0;
  for (let i = 0; i < tradeData.length; i++) {
    const volume = Number(tradeData[i].dailyVolumeUSD);
    const poolReserve = Number(tradeData[i].reserveUSD);
    const fees = volume * 0.0025;
    totalApy += (fees / poolReserve) * 365 * 100;
    currentApy = totalApy / (i + 1);
  }
  return (0, yields_utils_1.createYieldSource)(vault, source_type_enum_1.SourceType.TradeFee, name, currentApy);
}
exports.getSwapValue = getSwapValue;
//# sourceMappingURL=strategy.utils.js.map
