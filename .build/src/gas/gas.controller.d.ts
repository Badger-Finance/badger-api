import { Network } from "@badger-dao/sdk";
import { GasService } from "./gas.service";
import { GasPrices } from "./interfaces/gas-prices.interface";
export declare class GasController {
  gasService: GasService;
  getGasPrices(chain?: Network): Promise<GasPrices>;
}
