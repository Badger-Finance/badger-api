"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_CHAINS = void 0;
const arbitrum_config_1 = require("./config/arbitrum.config");
const bsc_config_1 = require("./config/bsc.config");
const eth_config_1 = require("./config/eth.config");
const fantom_config_1 = require("./config/fantom.config");
const optimism_config_1 = require("./config/optimism.config");
const polygon_config_1 = require("./config/polygon.config");
exports.SUPPORTED_CHAINS = [
    new eth_config_1.Ethereum(),
    new bsc_config_1.BinanceSmartChain(),
    new polygon_config_1.Polygon(),
    new arbitrum_config_1.Arbitrum(),
    new fantom_config_1.Fantom(),
    new optimism_config_1.Optimism(),
];
//# sourceMappingURL=chain.js.map