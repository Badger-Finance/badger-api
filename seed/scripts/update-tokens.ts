import { BadgerAPI, Network, Token } from "@badger-dao/sdk";
import { writeFileSync } from "fs";
import { resolve } from "path";

async function updatePrices() {
  const tokens: Token[] = [];
  for (const network of Object.values(Network)) {
    try {
      const api = new BadgerAPI({ network, baseURL: "https://staging-api.badger.com/" });
      const networkTokens = await api.loadTokens();
      Object.entries(networkTokens).forEach((entry) => {
        const [_key, token] = entry;
        const { name, address, decimals, symbol } = token;
        tokens.push({ name, address, decimals, symbol });
      });
    } catch {}
  }
  writeFileSync(resolve(__dirname, "../token-info.json"), JSON.stringify(tokens, null, 2));
}

updatePrices();
