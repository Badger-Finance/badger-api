"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = void 0;
// free rpc provider for local development
var Provider;
(function (Provider) {
  Provider["Cloudflare"] = "https://cloudflare-eth.com";
  Provider["Binance"] = "https://bsc-dataseed.binance.org";
  Provider["Quicknode"] = "https://rpc-mainnet.matic.quiknode.pro";
  Provider["xDai"] = "https://rpc.xdaichain.com";
  Provider["Arbitrum"] = "https://arb1.arbitrum.io/rpc";
  Provider["Avalanche"] = "https://api.avax.network/ext/bc/C/rpc";
  Provider["Fantom"] = "https://rpc.ftm.tools/";
  Provider["Optimism"] = "https://optimism-mainnet.public.blastapi.io/";
})((Provider = exports.Provider || (exports.Provider = {})));
//# sourceMappingURL=provider.enum.js.map
