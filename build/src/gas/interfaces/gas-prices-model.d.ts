import { EIP1559GasPrices, GasPrices } from './gas-prices.interface';
/**
 * Mapping of speed selections to gas pricing
 */
export declare class GasPricesModel implements GasPrices {
    [speed: string]: number | EIP1559GasPrices;
}
