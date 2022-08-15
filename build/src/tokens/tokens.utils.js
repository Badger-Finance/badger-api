"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockBalance =
  exports.lookUpAddrByTokenName =
  exports.mergeTokensFullData =
  exports.cacheTokensInfo =
  exports.getCachedTokesInfo =
  exports.getFullTokens =
  exports.getFullToken =
  exports.getVaultTokens =
  exports.toBalance =
    void 0;
const sdk_1 = require("@badger-dao/sdk");
const ethers_1 = require("ethers");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const token_information_snapshot_model_1 = require("../aws/models/token-information-snapshot.model");
const vault_token_balance_model_1 = require("../aws/models/vault-token-balance.model");
const prices_utils_1 = require("../prices/prices.utils");
const token_error_1 = require("./errors/token.error");
async function toBalance(token, balance, currency) {
  const { price } = await (0, prices_utils_1.getPrice)(token.address, currency);
  return {
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    balance: balance,
    value: balance * price
  };
}
exports.toBalance = toBalance;
async function getVaultTokens(chain, vault, currency) {
  let tokens = [];
  const mapper = (0, dynamodb_utils_1.getDataMapper)();
  for await (const record of mapper.query(
    vault_token_balance_model_1.VaultTokenBalance,
    { vault: vault.vaultToken },
    { limit: 1 }
  )) {
    tokens = await Promise.all(
      record.tokenBalances.map(async (b) => ({
        ...b,
        value: await (0, prices_utils_1.convert)(b.value, currency)
      }))
    );
  }
  return tokens;
}
exports.getVaultTokens = getVaultTokens;
async function getFullToken(chain, tokenAddr) {
  const address = ethers_1.ethers.utils.getAddress(tokenAddr);
  const fullTokenMap = await getFullTokens(chain, [address]);
  if (!fullTokenMap[address]) {
    throw new token_error_1.TokenNotFound(address);
  }
  return fullTokenMap[address];
}
exports.getFullToken = getFullToken;
async function getFullTokens(chain, tokensAddr) {
  const cachedTokens = await getCachedTokesInfo(tokensAddr);
  const requestedTokenAddresses = new Set(tokensAddr);
  const validToken = (t) => t.name.length > 0 && t.symbol.length > 0;
  cachedTokens
    .filter((t) => requestedTokenAddresses.has(t.address) || !validToken(t))
    .map((t) => t.address)
    .forEach((t) => requestedTokenAddresses.delete(t));
  const tokensCacheMissMatch = [...requestedTokenAddresses];
  if (tokensCacheMissMatch.length === 0) {
    return mergeTokensFullData(chain.tokens, cachedTokens);
  }
  const sdk = await chain.getSdk();
  const sdkTokensInfo = await sdk.tokens.loadTokens(tokensCacheMissMatch);
  const tokensInfo = Object.values(sdkTokensInfo).filter((t) => validToken(t));
  if (tokensInfo.length > 0) {
    await cacheTokensInfo(tokensInfo);
  }
  const tokensList = tokensInfo.concat(cachedTokens);
  return mergeTokensFullData(chain.tokens, tokensList);
}
exports.getFullTokens = getFullTokens;
async function getCachedTokesInfo(tokensAddr) {
  const mapper = (0, dynamodb_utils_1.getDataMapper)();
  const tokensToGet = tokensAddr.map((addr) =>
    Object.assign(new token_information_snapshot_model_1.TokenInformationSnapshot(), {
      address: ethers_1.ethers.utils.getAddress(addr)
    })
  );
  const tokensInfo = [];
  try {
    for await (const token of mapper.batchGet(tokensToGet)) {
      tokensInfo.push(token);
    }
  } catch (e) {
    console.warn(`Failed to fetch cached tokens info ${e}`);
  }
  return tokensInfo;
}
exports.getCachedTokesInfo = getCachedTokesInfo;
async function cacheTokensInfo(tokens) {
  const mapper = (0, dynamodb_utils_1.getDataMapper)();
  const tokensInfoMeta = tokens.map((token) =>
    Object.assign(new token_information_snapshot_model_1.TokenInformationSnapshot(), token)
  );
  try {
    for await (const persisted of mapper.batchPut(tokensInfoMeta)) {
      if (!persisted) console.warn("Failed to save token info");
    }
  } catch (e) {
    console.warn(`Failed to save tokens info ${e}`);
  }
}
exports.cacheTokensInfo = cacheTokensInfo;
function mergeTokensFullData(chainTokens, tokens) {
  const mergedTokensFullData = {};
  for (const token of tokens) {
    mergedTokensFullData[token.address] = {
      ...token,
      ...(chainTokens[token.address] || {})
    };
  }
  return mergedTokensFullData;
}
exports.mergeTokensFullData = mergeTokensFullData;
function lookUpAddrByTokenName(chain, name) {
  var _a;
  const tokensWithAddr = Object.keys(chain.tokens).map((address) => ({
    ...chain.tokens[address],
    address
  }));
  return (_a = Object.values(tokensWithAddr).find((token) => token.lookupName === name)) === null || _a === void 0
    ? void 0
    : _a.address;
}
exports.lookUpAddrByTokenName = lookUpAddrByTokenName;
function mockBalance(token, balance, currency) {
  let price = parseInt(token.address.slice(0, 5), 16);
  if (currency && currency !== sdk_1.Currency.USD) {
    price /= 2;
  }
  return {
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    balance: balance,
    value: balance * price
  };
}
exports.mockBalance = mockBalance;
//# sourceMappingURL=tokens.utils.js.map
