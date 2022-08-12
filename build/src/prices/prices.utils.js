"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPriceSnapshotsAtTimestamps = exports.fetchPrices = exports.convert = exports.getPrice = exports.updatePrice = void 0;
const dynamodb_expressions_1 = require("@aws/dynamodb-expressions");
const sdk_1 = require("@badger-dao/sdk");
const ethers_1 = require("ethers");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const token_price_snapshot_model_1 = require("../aws/models/token-price-snapshot.model");
const request_1 = require("../common/request");
const tokens_config_1 = require("../config/tokens.config");
const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple';
/**
 * Update pricing db entry using chain strategy.
 * @param chain Chain objects
 * @param token Target for price update.
 */
async function updatePrice({ address, price }) {
    try {
        if (Number.isNaN(price) || price === 0) {
            // TODO: add discord warning logs for errors on pricing
            throw new Error(`Attempting to update ${address} with bad price`);
        }
        const mapper = (0, dynamodb_utils_1.getDataMapper)();
        return mapper.put(Object.assign(new token_price_snapshot_model_1.TokenPriceSnapshot(), {
            address: ethers_1.ethers.utils.getAddress(address),
            price,
        }));
    }
    catch (err) {
        console.error(err);
        return { address, price: 0 };
    } // ignore issues to allow for price updates of other coins
}
exports.updatePrice = updatePrice;
/**
 * Load token price fromt he pricing database.
 * @param contract Address for the token price being requested.
 * @returns Most recent price data for the requested contract.
 */
async function getPrice(address, currency) {
    try {
        const mapper = (0, dynamodb_utils_1.getDataMapper)();
        for await (const item of mapper.query(token_price_snapshot_model_1.TokenPriceSnapshot, { address: ethers_1.ethers.utils.getAddress(address) }, { limit: 1, scanIndexForward: false })) {
            item.price = await convert(item.price, currency);
            return item;
        }
        return { address, price: 0 };
    }
    catch (err) {
        console.error(err);
        return { address, price: 0 };
    }
}
exports.getPrice = getPrice;
/**
 * Convert USD value to supported currencies.
 * @param value USD value
 * @param currency Target currency
 * @returns Converted value in target currency
 */
async function convert(value, currency) {
    if (!currency) {
        return value;
    }
    switch (currency) {
        case sdk_1.Currency.ETH:
            const wethPrice = await getPrice(tokens_config_1.TOKENS.WETH);
            return value / wethPrice.price;
        case sdk_1.Currency.AVAX:
            const wavaxPrice = await getPrice(tokens_config_1.TOKENS.AVAX_WAVAX);
            return value / wavaxPrice.price;
        case sdk_1.Currency.FTM:
            const wftmPrice = await getPrice(tokens_config_1.TOKENS.FTM_WFTM);
            return value / wftmPrice.price;
        case sdk_1.Currency.MATIC:
            const wmaticPrice = await getPrice(tokens_config_1.TOKENS.MATIC_WMATIC);
            return value / wmaticPrice.price;
        case sdk_1.Currency.USD:
        default:
            return value;
    }
}
exports.convert = convert;
async function fetchPrices(chain, inputs, lookupName = false) {
    if (inputs.length === 0) {
        return {};
    }
    let baseURL;
    let params;
    // utilize coingecko name look up api
    if (lookupName) {
        baseURL = `${COINGECKO_URL}/price`;
        params = {
            ids: inputs.join(','),
            vs_currencies: 'usd',
        };
    }
    else {
        baseURL = `${COINGECKO_URL}/token_price/${chain.network}`;
        params = {
            contract_addresses: inputs.join(','),
            vs_currencies: 'usd',
        };
    }
    return (0, request_1.request)(baseURL, params);
}
exports.fetchPrices = fetchPrices;
async function getPriceSnapshotsAtTimestamps(address, timestamps, currency) {
    var _a;
    try {
        const snapshots = [];
        const mapper = (0, dynamodb_utils_1.getDataMapper)();
        for (const timestamp of timestamps) {
            for await (const snapshot of mapper.query(token_price_snapshot_model_1.TokenPriceSnapshot, { address: ethers_1.ethers.utils.getAddress(address), updatedAt: (0, dynamodb_expressions_1.greaterThanOrEqualTo)(timestamp) }, { limit: 1 })) {
                snapshot.price = await convert((_a = snapshot.price) !== null && _a !== void 0 ? _a : snapshot.usd, currency);
                snapshot.updatedAt = timestamp;
                snapshots.push(snapshot);
            }
        }
        return snapshots;
    }
    catch (err) {
        console.error(err);
        return [];
    }
}
exports.getPriceSnapshotsAtTimestamps = getPriceSnapshotsAtTimestamps;
//# sourceMappingURL=prices.utils.js.map