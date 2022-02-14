import { BadgerAPI, Currency, Network } from '@badger-dao/sdk';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

async function updatePrices() {
  const api = new BadgerAPI();
  let prices: { address: string; price: number; updatedAt: number }[] = [];
  for (const network of Object.values(Network)) {
    try {
      const networkPrices = await api.loadPrices(Currency.USD, network);
      prices = prices.concat(
        Object.entries(networkPrices).map((entry) => {
          const [token, price] = entry;
          return {
            address: token,
            price,
            updatedAt: Date.now(),
          };
        }),
      );
    } catch {}
  }
  writeFileSync(resolve(__dirname, '../prices.json'), JSON.stringify(prices, null, 2));
}

updatePrices();
