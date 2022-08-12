"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSdk = exports.UniV2PairDocument = exports.UniPairDayDatasDocument = exports.UniV2PairFragmentDoc = exports.UniPairDayDataFragmentDoc = exports._SubgraphErrorPolicy_ = exports.User_OrderBy = exports.UniswapFactory_OrderBy = exports.UniswapDayData_OrderBy = exports.Transaction_OrderBy = exports.Token_OrderBy = exports.TokenDayData_OrderBy = exports.Swap_OrderBy = exports.Pair_OrderBy = exports.PairHourData_OrderBy = exports.PairDayData_OrderBy = exports.OrderDirection = exports.Mint_OrderBy = exports.LiquidityPosition_OrderBy = exports.LiquidityPositionSnapshot_OrderBy = exports.Burn_OrderBy = exports.Bundle_OrderBy = void 0;
const tslib_1 = require("tslib");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
var Bundle_OrderBy;
(function (Bundle_OrderBy) {
    Bundle_OrderBy["EthPrice"] = "ethPrice";
    Bundle_OrderBy["Id"] = "id";
})(Bundle_OrderBy = exports.Bundle_OrderBy || (exports.Bundle_OrderBy = {}));
var Burn_OrderBy;
(function (Burn_OrderBy) {
    Burn_OrderBy["Amount0"] = "amount0";
    Burn_OrderBy["Amount1"] = "amount1";
    Burn_OrderBy["AmountUsd"] = "amountUSD";
    Burn_OrderBy["FeeLiquidity"] = "feeLiquidity";
    Burn_OrderBy["FeeTo"] = "feeTo";
    Burn_OrderBy["Id"] = "id";
    Burn_OrderBy["Liquidity"] = "liquidity";
    Burn_OrderBy["LogIndex"] = "logIndex";
    Burn_OrderBy["NeedsComplete"] = "needsComplete";
    Burn_OrderBy["Pair"] = "pair";
    Burn_OrderBy["Sender"] = "sender";
    Burn_OrderBy["Timestamp"] = "timestamp";
    Burn_OrderBy["To"] = "to";
    Burn_OrderBy["Transaction"] = "transaction";
})(Burn_OrderBy = exports.Burn_OrderBy || (exports.Burn_OrderBy = {}));
var LiquidityPositionSnapshot_OrderBy;
(function (LiquidityPositionSnapshot_OrderBy) {
    LiquidityPositionSnapshot_OrderBy["Block"] = "block";
    LiquidityPositionSnapshot_OrderBy["Id"] = "id";
    LiquidityPositionSnapshot_OrderBy["LiquidityPosition"] = "liquidityPosition";
    LiquidityPositionSnapshot_OrderBy["LiquidityTokenBalance"] = "liquidityTokenBalance";
    LiquidityPositionSnapshot_OrderBy["LiquidityTokenTotalSupply"] = "liquidityTokenTotalSupply";
    LiquidityPositionSnapshot_OrderBy["Pair"] = "pair";
    LiquidityPositionSnapshot_OrderBy["Reserve0"] = "reserve0";
    LiquidityPositionSnapshot_OrderBy["Reserve1"] = "reserve1";
    LiquidityPositionSnapshot_OrderBy["ReserveUsd"] = "reserveUSD";
    LiquidityPositionSnapshot_OrderBy["Timestamp"] = "timestamp";
    LiquidityPositionSnapshot_OrderBy["Token0PriceUsd"] = "token0PriceUSD";
    LiquidityPositionSnapshot_OrderBy["Token1PriceUsd"] = "token1PriceUSD";
    LiquidityPositionSnapshot_OrderBy["User"] = "user";
})(LiquidityPositionSnapshot_OrderBy = exports.LiquidityPositionSnapshot_OrderBy || (exports.LiquidityPositionSnapshot_OrderBy = {}));
var LiquidityPosition_OrderBy;
(function (LiquidityPosition_OrderBy) {
    LiquidityPosition_OrderBy["Id"] = "id";
    LiquidityPosition_OrderBy["LiquidityTokenBalance"] = "liquidityTokenBalance";
    LiquidityPosition_OrderBy["Pair"] = "pair";
    LiquidityPosition_OrderBy["User"] = "user";
})(LiquidityPosition_OrderBy = exports.LiquidityPosition_OrderBy || (exports.LiquidityPosition_OrderBy = {}));
var Mint_OrderBy;
(function (Mint_OrderBy) {
    Mint_OrderBy["Amount0"] = "amount0";
    Mint_OrderBy["Amount1"] = "amount1";
    Mint_OrderBy["AmountUsd"] = "amountUSD";
    Mint_OrderBy["FeeLiquidity"] = "feeLiquidity";
    Mint_OrderBy["FeeTo"] = "feeTo";
    Mint_OrderBy["Id"] = "id";
    Mint_OrderBy["Liquidity"] = "liquidity";
    Mint_OrderBy["LogIndex"] = "logIndex";
    Mint_OrderBy["Pair"] = "pair";
    Mint_OrderBy["Sender"] = "sender";
    Mint_OrderBy["Timestamp"] = "timestamp";
    Mint_OrderBy["To"] = "to";
    Mint_OrderBy["Transaction"] = "transaction";
})(Mint_OrderBy = exports.Mint_OrderBy || (exports.Mint_OrderBy = {}));
/** Defines the order direction, either ascending or descending */
var OrderDirection;
(function (OrderDirection) {
    OrderDirection["Asc"] = "asc";
    OrderDirection["Desc"] = "desc";
})(OrderDirection = exports.OrderDirection || (exports.OrderDirection = {}));
var PairDayData_OrderBy;
(function (PairDayData_OrderBy) {
    PairDayData_OrderBy["DailyTxns"] = "dailyTxns";
    PairDayData_OrderBy["DailyVolumeToken0"] = "dailyVolumeToken0";
    PairDayData_OrderBy["DailyVolumeToken1"] = "dailyVolumeToken1";
    PairDayData_OrderBy["DailyVolumeUsd"] = "dailyVolumeUSD";
    PairDayData_OrderBy["Date"] = "date";
    PairDayData_OrderBy["Id"] = "id";
    PairDayData_OrderBy["PairAddress"] = "pairAddress";
    PairDayData_OrderBy["Reserve0"] = "reserve0";
    PairDayData_OrderBy["Reserve1"] = "reserve1";
    PairDayData_OrderBy["ReserveUsd"] = "reserveUSD";
    PairDayData_OrderBy["Token0"] = "token0";
    PairDayData_OrderBy["Token1"] = "token1";
    PairDayData_OrderBy["TotalSupply"] = "totalSupply";
})(PairDayData_OrderBy = exports.PairDayData_OrderBy || (exports.PairDayData_OrderBy = {}));
var PairHourData_OrderBy;
(function (PairHourData_OrderBy) {
    PairHourData_OrderBy["HourStartUnix"] = "hourStartUnix";
    PairHourData_OrderBy["HourlyTxns"] = "hourlyTxns";
    PairHourData_OrderBy["HourlyVolumeToken0"] = "hourlyVolumeToken0";
    PairHourData_OrderBy["HourlyVolumeToken1"] = "hourlyVolumeToken1";
    PairHourData_OrderBy["HourlyVolumeUsd"] = "hourlyVolumeUSD";
    PairHourData_OrderBy["Id"] = "id";
    PairHourData_OrderBy["Pair"] = "pair";
    PairHourData_OrderBy["Reserve0"] = "reserve0";
    PairHourData_OrderBy["Reserve1"] = "reserve1";
    PairHourData_OrderBy["ReserveUsd"] = "reserveUSD";
})(PairHourData_OrderBy = exports.PairHourData_OrderBy || (exports.PairHourData_OrderBy = {}));
var Pair_OrderBy;
(function (Pair_OrderBy) {
    Pair_OrderBy["CreatedAtBlockNumber"] = "createdAtBlockNumber";
    Pair_OrderBy["CreatedAtTimestamp"] = "createdAtTimestamp";
    Pair_OrderBy["Id"] = "id";
    Pair_OrderBy["LiquidityProviderCount"] = "liquidityProviderCount";
    Pair_OrderBy["Reserve0"] = "reserve0";
    Pair_OrderBy["Reserve1"] = "reserve1";
    Pair_OrderBy["ReserveEth"] = "reserveETH";
    Pair_OrderBy["ReserveUsd"] = "reserveUSD";
    Pair_OrderBy["Token0"] = "token0";
    Pair_OrderBy["Token0Price"] = "token0Price";
    Pair_OrderBy["Token1"] = "token1";
    Pair_OrderBy["Token1Price"] = "token1Price";
    Pair_OrderBy["TotalSupply"] = "totalSupply";
    Pair_OrderBy["TrackedReserveEth"] = "trackedReserveETH";
    Pair_OrderBy["TxCount"] = "txCount";
    Pair_OrderBy["UntrackedVolumeUsd"] = "untrackedVolumeUSD";
    Pair_OrderBy["VolumeToken0"] = "volumeToken0";
    Pair_OrderBy["VolumeToken1"] = "volumeToken1";
    Pair_OrderBy["VolumeUsd"] = "volumeUSD";
})(Pair_OrderBy = exports.Pair_OrderBy || (exports.Pair_OrderBy = {}));
var Swap_OrderBy;
(function (Swap_OrderBy) {
    Swap_OrderBy["Amount0In"] = "amount0In";
    Swap_OrderBy["Amount0Out"] = "amount0Out";
    Swap_OrderBy["Amount1In"] = "amount1In";
    Swap_OrderBy["Amount1Out"] = "amount1Out";
    Swap_OrderBy["AmountUsd"] = "amountUSD";
    Swap_OrderBy["Id"] = "id";
    Swap_OrderBy["LogIndex"] = "logIndex";
    Swap_OrderBy["Pair"] = "pair";
    Swap_OrderBy["Sender"] = "sender";
    Swap_OrderBy["Timestamp"] = "timestamp";
    Swap_OrderBy["To"] = "to";
    Swap_OrderBy["Transaction"] = "transaction";
})(Swap_OrderBy = exports.Swap_OrderBy || (exports.Swap_OrderBy = {}));
var TokenDayData_OrderBy;
(function (TokenDayData_OrderBy) {
    TokenDayData_OrderBy["DailyTxns"] = "dailyTxns";
    TokenDayData_OrderBy["DailyVolumeEth"] = "dailyVolumeETH";
    TokenDayData_OrderBy["DailyVolumeToken"] = "dailyVolumeToken";
    TokenDayData_OrderBy["DailyVolumeUsd"] = "dailyVolumeUSD";
    TokenDayData_OrderBy["Date"] = "date";
    TokenDayData_OrderBy["Id"] = "id";
    TokenDayData_OrderBy["MaxStored"] = "maxStored";
    TokenDayData_OrderBy["MostLiquidPairs"] = "mostLiquidPairs";
    TokenDayData_OrderBy["PriceUsd"] = "priceUSD";
    TokenDayData_OrderBy["Token"] = "token";
    TokenDayData_OrderBy["TotalLiquidityEth"] = "totalLiquidityETH";
    TokenDayData_OrderBy["TotalLiquidityToken"] = "totalLiquidityToken";
    TokenDayData_OrderBy["TotalLiquidityUsd"] = "totalLiquidityUSD";
})(TokenDayData_OrderBy = exports.TokenDayData_OrderBy || (exports.TokenDayData_OrderBy = {}));
var Token_OrderBy;
(function (Token_OrderBy) {
    Token_OrderBy["Decimals"] = "decimals";
    Token_OrderBy["DerivedEth"] = "derivedETH";
    Token_OrderBy["Id"] = "id";
    Token_OrderBy["MostLiquidPairs"] = "mostLiquidPairs";
    Token_OrderBy["Name"] = "name";
    Token_OrderBy["Symbol"] = "symbol";
    Token_OrderBy["TotalLiquidity"] = "totalLiquidity";
    Token_OrderBy["TotalSupply"] = "totalSupply";
    Token_OrderBy["TradeVolume"] = "tradeVolume";
    Token_OrderBy["TradeVolumeUsd"] = "tradeVolumeUSD";
    Token_OrderBy["TxCount"] = "txCount";
    Token_OrderBy["UntrackedVolumeUsd"] = "untrackedVolumeUSD";
})(Token_OrderBy = exports.Token_OrderBy || (exports.Token_OrderBy = {}));
var Transaction_OrderBy;
(function (Transaction_OrderBy) {
    Transaction_OrderBy["BlockNumber"] = "blockNumber";
    Transaction_OrderBy["Burns"] = "burns";
    Transaction_OrderBy["Id"] = "id";
    Transaction_OrderBy["Mints"] = "mints";
    Transaction_OrderBy["Swaps"] = "swaps";
    Transaction_OrderBy["Timestamp"] = "timestamp";
})(Transaction_OrderBy = exports.Transaction_OrderBy || (exports.Transaction_OrderBy = {}));
var UniswapDayData_OrderBy;
(function (UniswapDayData_OrderBy) {
    UniswapDayData_OrderBy["DailyVolumeEth"] = "dailyVolumeETH";
    UniswapDayData_OrderBy["DailyVolumeUsd"] = "dailyVolumeUSD";
    UniswapDayData_OrderBy["DailyVolumeUntracked"] = "dailyVolumeUntracked";
    UniswapDayData_OrderBy["Date"] = "date";
    UniswapDayData_OrderBy["Id"] = "id";
    UniswapDayData_OrderBy["MaxStored"] = "maxStored";
    UniswapDayData_OrderBy["MostLiquidTokens"] = "mostLiquidTokens";
    UniswapDayData_OrderBy["TotalLiquidityEth"] = "totalLiquidityETH";
    UniswapDayData_OrderBy["TotalLiquidityUsd"] = "totalLiquidityUSD";
    UniswapDayData_OrderBy["TotalVolumeEth"] = "totalVolumeETH";
    UniswapDayData_OrderBy["TotalVolumeUsd"] = "totalVolumeUSD";
    UniswapDayData_OrderBy["TxCount"] = "txCount";
})(UniswapDayData_OrderBy = exports.UniswapDayData_OrderBy || (exports.UniswapDayData_OrderBy = {}));
var UniswapFactory_OrderBy;
(function (UniswapFactory_OrderBy) {
    UniswapFactory_OrderBy["Id"] = "id";
    UniswapFactory_OrderBy["MostLiquidTokens"] = "mostLiquidTokens";
    UniswapFactory_OrderBy["PairCount"] = "pairCount";
    UniswapFactory_OrderBy["TotalLiquidityEth"] = "totalLiquidityETH";
    UniswapFactory_OrderBy["TotalLiquidityUsd"] = "totalLiquidityUSD";
    UniswapFactory_OrderBy["TotalVolumeEth"] = "totalVolumeETH";
    UniswapFactory_OrderBy["TotalVolumeUsd"] = "totalVolumeUSD";
    UniswapFactory_OrderBy["TxCount"] = "txCount";
    UniswapFactory_OrderBy["UntrackedVolumeUsd"] = "untrackedVolumeUSD";
})(UniswapFactory_OrderBy = exports.UniswapFactory_OrderBy || (exports.UniswapFactory_OrderBy = {}));
var User_OrderBy;
(function (User_OrderBy) {
    User_OrderBy["Id"] = "id";
    User_OrderBy["LiquidityPositions"] = "liquidityPositions";
    User_OrderBy["UsdSwapped"] = "usdSwapped";
})(User_OrderBy = exports.User_OrderBy || (exports.User_OrderBy = {}));
var _SubgraphErrorPolicy_;
(function (_SubgraphErrorPolicy_) {
    /** Data will be returned even if the subgraph has indexing errors */
    _SubgraphErrorPolicy_["Allow"] = "allow";
    /** If the subgraph has indexing errors, data will be omitted. The default. */
    _SubgraphErrorPolicy_["Deny"] = "deny";
})(_SubgraphErrorPolicy_ = exports._SubgraphErrorPolicy_ || (exports._SubgraphErrorPolicy_ = {}));
exports.UniPairDayDataFragmentDoc = (0, graphql_tag_1.default) `
  fragment UniPairDayData on PairDayData {
    token0 {
      id
    }
    token1 {
      id
    }
    reserve0
    reserve1
    reserveUSD
    dailyVolumeToken0
    dailyVolumeToken1
  }
`;
exports.UniV2PairFragmentDoc = (0, graphql_tag_1.default) `
  fragment UniV2Pair on Pair {
    id
    reserve0
    reserve1
    token0 {
      id
      symbol
      name
      decimals
    }
    token1 {
      id
      symbol
      name
      decimals
    }
    totalSupply
  }
`;
exports.UniPairDayDatasDocument = (0, graphql_tag_1.default) `
  query UniPairDayDatas(
    $first: Int
    $where: PairDayData_filter
    $orderBy: PairDayData_orderBy
    $orderDirection: OrderDirection
  ) {
    pairDayDatas(first: $first, where: $where, orderBy: $orderBy, orderDirection: $orderDirection) {
      ...UniPairDayData
    }
  }
  ${exports.UniPairDayDataFragmentDoc}
`;
exports.UniV2PairDocument = (0, graphql_tag_1.default) `
  query UniV2Pair($id: ID!, $block: Block_height) {
    pair(id: $id, block: $block) {
      ...UniV2Pair
    }
  }
  ${exports.UniV2PairFragmentDoc}
`;
const defaultWrapper = (action, _operationName, _operationType) => action();
function getSdk(client, withWrapper = defaultWrapper) {
    return {
        UniPairDayDatas(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.UniPairDayDatasDocument, variables, {
                ...requestHeaders,
                ...wrappedRequestHeaders,
            }), 'UniPairDayDatas', 'query');
        },
        UniV2Pair(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.UniV2PairDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), 'UniV2Pair', 'query');
        },
    };
}
exports.getSdk = getSdk;
//# sourceMappingURL=uniswap.js.map