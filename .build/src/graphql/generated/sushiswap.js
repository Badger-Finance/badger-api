"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSdk = exports.SushiPairDayDatasDocument = exports.SushiPairDayDataFragmentDoc = exports._SubgraphErrorPolicy_ = exports.User_OrderBy = exports.Transaction_OrderBy = exports.Token_OrderBy = exports.TokenHourData_OrderBy = exports.TokenDayData_OrderBy = exports.Swap_OrderBy = exports.Pair_OrderBy = exports.PairHourData_OrderBy = exports.PairDayData_OrderBy = exports.OrderDirection = exports.Mint_OrderBy = exports.LiquidityPosition_OrderBy = exports.LiquidityPositionSnapshot_OrderBy = exports.HourData_OrderBy = exports.Factory_OrderBy = exports.DayData_OrderBy = exports.Burn_OrderBy = exports.Bundle_OrderBy = void 0;
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
    Burn_OrderBy["Complete"] = "complete";
    Burn_OrderBy["FeeLiquidity"] = "feeLiquidity";
    Burn_OrderBy["FeeTo"] = "feeTo";
    Burn_OrderBy["Id"] = "id";
    Burn_OrderBy["Liquidity"] = "liquidity";
    Burn_OrderBy["LogIndex"] = "logIndex";
    Burn_OrderBy["Pair"] = "pair";
    Burn_OrderBy["Sender"] = "sender";
    Burn_OrderBy["Timestamp"] = "timestamp";
    Burn_OrderBy["To"] = "to";
    Burn_OrderBy["Transaction"] = "transaction";
})(Burn_OrderBy = exports.Burn_OrderBy || (exports.Burn_OrderBy = {}));
var DayData_OrderBy;
(function (DayData_OrderBy) {
    DayData_OrderBy["Date"] = "date";
    DayData_OrderBy["Factory"] = "factory";
    DayData_OrderBy["Id"] = "id";
    DayData_OrderBy["LiquidityEth"] = "liquidityETH";
    DayData_OrderBy["LiquidityUsd"] = "liquidityUSD";
    DayData_OrderBy["TxCount"] = "txCount";
    DayData_OrderBy["UntrackedVolume"] = "untrackedVolume";
    DayData_OrderBy["VolumeEth"] = "volumeETH";
    DayData_OrderBy["VolumeUsd"] = "volumeUSD";
})(DayData_OrderBy = exports.DayData_OrderBy || (exports.DayData_OrderBy = {}));
var Factory_OrderBy;
(function (Factory_OrderBy) {
    Factory_OrderBy["DayData"] = "dayData";
    Factory_OrderBy["HourData"] = "hourData";
    Factory_OrderBy["Id"] = "id";
    Factory_OrderBy["LiquidityEth"] = "liquidityETH";
    Factory_OrderBy["LiquidityUsd"] = "liquidityUSD";
    Factory_OrderBy["PairCount"] = "pairCount";
    Factory_OrderBy["Pairs"] = "pairs";
    Factory_OrderBy["TokenCount"] = "tokenCount";
    Factory_OrderBy["Tokens"] = "tokens";
    Factory_OrderBy["TxCount"] = "txCount";
    Factory_OrderBy["UntrackedVolumeUsd"] = "untrackedVolumeUSD";
    Factory_OrderBy["UserCount"] = "userCount";
    Factory_OrderBy["VolumeEth"] = "volumeETH";
    Factory_OrderBy["VolumeUsd"] = "volumeUSD";
})(Factory_OrderBy = exports.Factory_OrderBy || (exports.Factory_OrderBy = {}));
var HourData_OrderBy;
(function (HourData_OrderBy) {
    HourData_OrderBy["Date"] = "date";
    HourData_OrderBy["Factory"] = "factory";
    HourData_OrderBy["Id"] = "id";
    HourData_OrderBy["LiquidityEth"] = "liquidityETH";
    HourData_OrderBy["LiquidityUsd"] = "liquidityUSD";
    HourData_OrderBy["TxCount"] = "txCount";
    HourData_OrderBy["UntrackedVolume"] = "untrackedVolume";
    HourData_OrderBy["VolumeEth"] = "volumeETH";
    HourData_OrderBy["VolumeUsd"] = "volumeUSD";
})(HourData_OrderBy = exports.HourData_OrderBy || (exports.HourData_OrderBy = {}));
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
    LiquidityPosition_OrderBy["Block"] = "block";
    LiquidityPosition_OrderBy["Id"] = "id";
    LiquidityPosition_OrderBy["LiquidityTokenBalance"] = "liquidityTokenBalance";
    LiquidityPosition_OrderBy["Pair"] = "pair";
    LiquidityPosition_OrderBy["Snapshots"] = "snapshots";
    LiquidityPosition_OrderBy["Timestamp"] = "timestamp";
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
    PairDayData_OrderBy["Date"] = "date";
    PairDayData_OrderBy["Id"] = "id";
    PairDayData_OrderBy["Pair"] = "pair";
    PairDayData_OrderBy["Reserve0"] = "reserve0";
    PairDayData_OrderBy["Reserve1"] = "reserve1";
    PairDayData_OrderBy["ReserveUsd"] = "reserveUSD";
    PairDayData_OrderBy["Token0"] = "token0";
    PairDayData_OrderBy["Token1"] = "token1";
    PairDayData_OrderBy["TotalSupply"] = "totalSupply";
    PairDayData_OrderBy["TxCount"] = "txCount";
    PairDayData_OrderBy["VolumeToken0"] = "volumeToken0";
    PairDayData_OrderBy["VolumeToken1"] = "volumeToken1";
    PairDayData_OrderBy["VolumeUsd"] = "volumeUSD";
})(PairDayData_OrderBy = exports.PairDayData_OrderBy || (exports.PairDayData_OrderBy = {}));
var PairHourData_OrderBy;
(function (PairHourData_OrderBy) {
    PairHourData_OrderBy["Date"] = "date";
    PairHourData_OrderBy["Id"] = "id";
    PairHourData_OrderBy["Pair"] = "pair";
    PairHourData_OrderBy["Reserve0"] = "reserve0";
    PairHourData_OrderBy["Reserve1"] = "reserve1";
    PairHourData_OrderBy["ReserveUsd"] = "reserveUSD";
    PairHourData_OrderBy["TxCount"] = "txCount";
    PairHourData_OrderBy["VolumeToken0"] = "volumeToken0";
    PairHourData_OrderBy["VolumeToken1"] = "volumeToken1";
    PairHourData_OrderBy["VolumeUsd"] = "volumeUSD";
})(PairHourData_OrderBy = exports.PairHourData_OrderBy || (exports.PairHourData_OrderBy = {}));
var Pair_OrderBy;
(function (Pair_OrderBy) {
    Pair_OrderBy["Block"] = "block";
    Pair_OrderBy["Burns"] = "burns";
    Pair_OrderBy["DayData"] = "dayData";
    Pair_OrderBy["Factory"] = "factory";
    Pair_OrderBy["HourData"] = "hourData";
    Pair_OrderBy["Id"] = "id";
    Pair_OrderBy["LiquidityPositionSnapshots"] = "liquidityPositionSnapshots";
    Pair_OrderBy["LiquidityPositions"] = "liquidityPositions";
    Pair_OrderBy["LiquidityProviderCount"] = "liquidityProviderCount";
    Pair_OrderBy["Mints"] = "mints";
    Pair_OrderBy["Name"] = "name";
    Pair_OrderBy["Reserve0"] = "reserve0";
    Pair_OrderBy["Reserve1"] = "reserve1";
    Pair_OrderBy["ReserveEth"] = "reserveETH";
    Pair_OrderBy["ReserveUsd"] = "reserveUSD";
    Pair_OrderBy["Swaps"] = "swaps";
    Pair_OrderBy["Timestamp"] = "timestamp";
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
    TokenDayData_OrderBy["Date"] = "date";
    TokenDayData_OrderBy["Id"] = "id";
    TokenDayData_OrderBy["Liquidity"] = "liquidity";
    TokenDayData_OrderBy["LiquidityEth"] = "liquidityETH";
    TokenDayData_OrderBy["LiquidityUsd"] = "liquidityUSD";
    TokenDayData_OrderBy["PriceUsd"] = "priceUSD";
    TokenDayData_OrderBy["Token"] = "token";
    TokenDayData_OrderBy["TxCount"] = "txCount";
    TokenDayData_OrderBy["Volume"] = "volume";
    TokenDayData_OrderBy["VolumeEth"] = "volumeETH";
    TokenDayData_OrderBy["VolumeUsd"] = "volumeUSD";
})(TokenDayData_OrderBy = exports.TokenDayData_OrderBy || (exports.TokenDayData_OrderBy = {}));
var TokenHourData_OrderBy;
(function (TokenHourData_OrderBy) {
    TokenHourData_OrderBy["Date"] = "date";
    TokenHourData_OrderBy["Id"] = "id";
    TokenHourData_OrderBy["Liquidity"] = "liquidity";
    TokenHourData_OrderBy["LiquidityEth"] = "liquidityETH";
    TokenHourData_OrderBy["LiquidityUsd"] = "liquidityUSD";
    TokenHourData_OrderBy["PriceUsd"] = "priceUSD";
    TokenHourData_OrderBy["Token"] = "token";
    TokenHourData_OrderBy["TxCount"] = "txCount";
    TokenHourData_OrderBy["Volume"] = "volume";
    TokenHourData_OrderBy["VolumeEth"] = "volumeETH";
    TokenHourData_OrderBy["VolumeUsd"] = "volumeUSD";
})(TokenHourData_OrderBy = exports.TokenHourData_OrderBy || (exports.TokenHourData_OrderBy = {}));
var Token_OrderBy;
(function (Token_OrderBy) {
    Token_OrderBy["BasePairs"] = "basePairs";
    Token_OrderBy["BasePairsDayData"] = "basePairsDayData";
    Token_OrderBy["DayData"] = "dayData";
    Token_OrderBy["Decimals"] = "decimals";
    Token_OrderBy["DerivedEth"] = "derivedETH";
    Token_OrderBy["Factory"] = "factory";
    Token_OrderBy["HourData"] = "hourData";
    Token_OrderBy["Id"] = "id";
    Token_OrderBy["Liquidity"] = "liquidity";
    Token_OrderBy["Name"] = "name";
    Token_OrderBy["QuotePairs"] = "quotePairs";
    Token_OrderBy["QuotePairsDayData"] = "quotePairsDayData";
    Token_OrderBy["Symbol"] = "symbol";
    Token_OrderBy["TotalSupply"] = "totalSupply";
    Token_OrderBy["TxCount"] = "txCount";
    Token_OrderBy["UntrackedVolumeUsd"] = "untrackedVolumeUSD";
    Token_OrderBy["Volume"] = "volume";
    Token_OrderBy["VolumeUsd"] = "volumeUSD";
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
var User_OrderBy;
(function (User_OrderBy) {
    User_OrderBy["Id"] = "id";
    User_OrderBy["LiquidityPositions"] = "liquidityPositions";
})(User_OrderBy = exports.User_OrderBy || (exports.User_OrderBy = {}));
var _SubgraphErrorPolicy_;
(function (_SubgraphErrorPolicy_) {
    /** Data will be returned even if the subgraph has indexing errors */
    _SubgraphErrorPolicy_["Allow"] = "allow";
    /** If the subgraph has indexing errors, data will be omitted. The default. */
    _SubgraphErrorPolicy_["Deny"] = "deny";
})(_SubgraphErrorPolicy_ = exports._SubgraphErrorPolicy_ || (exports._SubgraphErrorPolicy_ = {}));
exports.SushiPairDayDataFragmentDoc = (0, graphql_tag_1.default) `
  fragment SushiPairDayData on PairDayData {
    reserveUSD
    volumeUSD
    date
  }
`;
exports.SushiPairDayDatasDocument = (0, graphql_tag_1.default) `
  query SushiPairDayDatas(
    $first: Int
    $where: PairDayData_filter
    $orderBy: PairDayData_orderBy
    $orderDirection: OrderDirection
  ) {
    pairDayDatas(first: $first, where: $where, orderBy: $orderBy, orderDirection: $orderDirection) {
      ...SushiPairDayData
    }
  }
  ${exports.SushiPairDayDataFragmentDoc}
`;
const defaultWrapper = (action, _operationName, _operationType) => action();
function getSdk(client, withWrapper = defaultWrapper) {
    return {
        SushiPairDayDatas(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.SushiPairDayDatasDocument, variables, {
                ...requestHeaders,
                ...wrappedRequestHeaders,
            }), 'SushiPairDayDatas', 'query');
        },
    };
}
exports.getSdk = getSdk;
//# sourceMappingURL=sushiswap.js.map