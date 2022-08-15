import { Chain } from "../chains/config/chain.config";
import { GasPrices } from "./interfaces/gas-prices.interface";
export declare class GasService {
  /**
   * Attempt to retrieve the prices for a chain from the cache
   * if no value is in the cache, refresh prices for all chains
   * @param chain Gas price chain
   * @returns object of gas speeds and prices
   */
  getGasPrices(chain: Chain): Promise<GasPrices>;
}
