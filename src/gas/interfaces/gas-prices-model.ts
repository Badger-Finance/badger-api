import { Description, Example } from '@tsed/schema';
import { EIP1559GasPrices, GasPrices } from './gas-prices.interface';

/**
 * Mapping of speed selections to gas pricing
 */
@Description('Mapping of speed selections to gas pricing')
@Example({
  rapid: { maxFeePerGas: 175, maxPriorityFeePerGas: 2.5 },
  fast: { maxFeePerGas: 174, maxPriorityFeePerGas: 2.0 },
  standard: { maxFeePerGas: 172, maxPriorityFeePerGas: 1.5 },
  slow: { maxFeePerGas: 172, maxPriorityFeePerGas: 1.0 },
})
export class GasPricesModel implements GasPrices {
  [speed: string]: number | EIP1559GasPrices;
}
