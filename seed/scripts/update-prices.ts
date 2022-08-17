import { BadgerAPI, Currency, Network } from '@badger-dao/sdk';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

async function updatePrices() {
  const prices: { address: string; price: number; updatedAt: number }[] = [];
  for (const network of Object.values(Network)) {
    try {
      const api = new BadgerAPI({ network, baseURL: 'https://staging-api.badger.com/' });
      const networkPrices = await api.loadPrices(Currency.USD);
      Object.entries(networkPrices).forEach((entry) => {
        const [token, price] = entry;
        prices.push({
          address: token,
          price,
          updatedAt: Date.now(),
        });
      });
    } catch {}
  }
  writeFileSync(resolve(__dirname, '../prices.json'), JSON.stringify(prices, null, 2));
}

updatePrices();
