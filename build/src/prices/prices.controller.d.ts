import { Currency, Network } from '@badger-dao/sdk';
import { PriceSnapshots } from '../tokens/interfaces/price-snapshots.interface';
import { PriceSummary } from '../tokens/interfaces/price-summary.interface';
import { PricesService } from './prices.service';
export declare class PriceController {
    pricesService: PricesService;
    listPrices(tokens?: string, chain?: Network, currency?: Currency): Promise<PriceSummary>;
    getPriceSnapshots(tokens: string, timestamps: string, currency?: Currency): Promise<PriceSnapshots>;
}
