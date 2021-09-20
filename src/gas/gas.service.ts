import { Service } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import NodeCache from 'node-cache';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { ChainGasPrices, GasPrices } from './interfaces/gas-prices.interface';

@Service()
export class GasService {
  private s3Cache = new NodeCache({ stdTTL: 100, checkperiod: 101 });

  /**
   * Attempt to retrieve the prices for a chain from the cache
   * if no value is in the cache, refresh prices for all chains
   * @param chain Gas price chain
   * @returns object of gas speeds and prices
   */
  async getGasPrices(chain: Chain): Promise<GasPrices> {
    let gasPricesCache: ChainGasPrices = {};
    try {
      const cacheObject = this.s3Cache.get('gasPrices') as AWS.S3.GetObjectOutput;
      if (!cacheObject || !cacheObject.Body) {
        console.log('cache miss');
        gasPricesCache = await this.loadGasPrices();
        this.s3Cache.set('gasPrices', gasPricesCache);
      } else {
        gasPricesCache = JSON.parse(cacheObject.Body.toString('utf-8'));
      }
      return gasPricesCache[chain.network];
    } catch (error) {
      console.error(error);
      throw new NotFound(`Gas price for ${chain.name} not available`);
    }
  }

  async loadGasPrices(): Promise<ChainGasPrices> {
    const chains = loadChains();
    const gasReturn: ChainGasPrices = {};
    await Promise.all(chains.flatMap(async (c) => (gasReturn[c.network] = await c.getGasPrices())));
    return gasReturn;
  }
}
