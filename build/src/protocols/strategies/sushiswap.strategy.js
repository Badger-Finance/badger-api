"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSushiSwapValue = exports.SushiswapStrategy = void 0;
const sdk_1 = require("@badger-dao/sdk");
const graphql_request_1 = require("graphql-request");
const constants_1 = require("../../config/constants");
const sushiswap_1 = require("../../graphql/generated/sushiswap");
const strategy_utils_1 = require("./strategy.utils");
class SushiswapStrategy {
  static async getValueSources(chain, vaultDefinition) {
    return Promise.all([getSushiswapSwapValue(chain, vaultDefinition)]);
  }
}
exports.SushiswapStrategy = SushiswapStrategy;
async function getSushiswapSwapValue(chain, vaultDefinition) {
  let graphUrl;
  switch (chain.network) {
    case sdk_1.Network.Polygon:
      graphUrl = constants_1.SUSHISWAP_MATIC_URL;
      break;
    case sdk_1.Network.Arbitrum:
      graphUrl = constants_1.SUSHISWAP_ARBITRUM_URL;
      break;
    default:
      graphUrl = constants_1.SUSHISWAP_URL;
  }
  return getSushiSwapValue(vaultDefinition, graphUrl);
}
async function getSushiSwapValue(vaultDefinition, graphUrl) {
  const client = new graphql_request_1.GraphQLClient(graphUrl);
  const sdk = (0, sushiswap_1.getSdk)(client);
  const { pairDayDatas } = await sdk.SushiPairDayDatas({
    first: 30,
    orderBy: sushiswap_1.PairDayData_OrderBy.Date,
    orderDirection: sushiswap_1.OrderDirection.Desc,
    where: {
      pair: vaultDefinition.depositToken.toLowerCase()
    }
  });
  const converted = pairDayDatas.map((d) => ({ reserveUSD: d.reserveUSD, dailyVolumeUSD: d.volumeUSD }));
  return (0, strategy_utils_1.getSwapValue)(vaultDefinition, converted);
}
exports.getSushiSwapValue = getSushiSwapValue;
//# sourceMappingURL=sushiswap.strategy.js.map
