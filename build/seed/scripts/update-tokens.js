"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@badger-dao/sdk");
const fs_1 = require("fs");
const path_1 = require("path");
async function updatePrices() {
  let tokens = [];
  for (const network of Object.values(sdk_1.Network)) {
    try {
      const api = new sdk_1.BadgerAPI({ network, baseURL: "https://staging-api.badger.com/" });
      const networkTokens = await api.loadTokens();
      Object.entries(networkTokens).forEach((entry) => {
        const [_key, token] = entry;
        const { name, address, decimals, symbol } = token;
        tokens.push({ name, address, decimals, symbol });
      });
    } catch {}
  }
  (0, fs_1.writeFileSync)((0, path_1.resolve)(__dirname, "../token-info.json"), JSON.stringify(tokens, null, 2));
}
updatePrices();
//# sourceMappingURL=update-tokens.js.map
