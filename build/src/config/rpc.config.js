"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@badger-dao/sdk");
const provider_enum_1 = require("../chains/enums/provider.enum");
const rpc = {
    [sdk_1.Network.Ethereum]: process.env.ETH_RPC || provider_enum_1.Provider.Cloudflare,
    [sdk_1.Network.BinanceSmartChain]: process.env.BSC_RPC || provider_enum_1.Provider.Binance,
    [sdk_1.Network.Polygon]: process.env.MATIC_RPC || provider_enum_1.Provider.Quicknode,
    [sdk_1.Network.Arbitrum]: process.env.ARBITRUM_RPC || provider_enum_1.Provider.Arbitrum,
    [sdk_1.Network.Avalanche]: process.env.AVALANCHE_RPC || provider_enum_1.Provider.Avalanche,
    [sdk_1.Network.Fantom]: process.env.FANTOM_RPC || provider_enum_1.Provider.Fantom,
    [sdk_1.Network.Optimism]: process.env.OPTIMISM_RPC || provider_enum_1.Provider.Optimism,
};
exports.default = rpc;
//# sourceMappingURL=rpc.config.js.map