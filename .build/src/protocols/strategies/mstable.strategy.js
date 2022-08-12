"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMhBtcPrice = exports.getImBtcPrice = void 0;
const sdk_1 = require("@badger-dao/sdk");
const tokens_config_1 = require("../../config/tokens.config");
const contracts_1 = require("../../contracts");
const prices_utils_1 = require("../../prices/prices.utils");
async function getImBtcPrice(chain, token) {
    const imbtc = contracts_1.Imbtc__factory.connect(token.address, chain.provider);
    const [exchangeRate, mbtcPrice] = await Promise.all([imbtc.exchangeRate(), (0, prices_utils_1.getPrice)(tokens_config_1.TOKENS.MBTC)]);
    const exchangeRateScalar = (0, sdk_1.formatBalance)(exchangeRate);
    return {
        address: token.address,
        price: mbtcPrice.price * exchangeRateScalar,
    };
}
exports.getImBtcPrice = getImBtcPrice;
async function getMhBtcPrice(chain, token) {
    const mhbtc = contracts_1.Mhbtc__factory.connect(token.address, chain.provider);
    const [mbtcPrice, mhbtcPrice, totalSupply] = await Promise.all([
        (0, prices_utils_1.getPrice)(tokens_config_1.TOKENS.MBTC),
        mhbtc.getPrice(),
        mhbtc.totalSupply(),
    ]);
    const mbtcBalance = (0, sdk_1.formatBalance)(mhbtcPrice.k);
    const mhbtcBalance = (0, sdk_1.formatBalance)(totalSupply);
    const exchangeRateScalar = mbtcBalance / mhbtcBalance;
    return {
        address: token.address,
        price: mbtcPrice.price * exchangeRateScalar,
    };
}
exports.getMhBtcPrice = getMhBtcPrice;
//# sourceMappingURL=mstable.strategy.js.map