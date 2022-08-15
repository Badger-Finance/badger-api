"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@badger-dao/sdk");
const fs_1 = require("fs");
const path_1 = require("path");
async function updatePrices() {
  let prices = [];
  for (const network of Object.values(sdk_1.Network)) {
    try {
      const api = new sdk_1.BadgerAPI({ network, baseURL: "https://staging-api.badger.com/" });
      const networkPrices = await api.loadPrices(sdk_1.Currency.USD);
      Object.entries(networkPrices).forEach((entry) => {
        const [token, price] = entry;
        prices.push({
          address: token,
          price,
          updatedAt: Date.now()
        });
      });
    } catch {}
  }
  (0, fs_1.writeFileSync)((0, path_1.resolve)(__dirname, "../prices.json"), JSON.stringify(prices, null, 2));
}
updatePrices();
//# sourceMappingURL=update-prices.js.map
