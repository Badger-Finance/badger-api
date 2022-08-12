import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { YieldSource } from '../../aws/models/yield-source.model';
import { PairDayData } from '../interfaces/pair-day-data.interface';
export declare function getUniV2SwapValue(graphUrl: string, vault: VaultDefinitionModel): Promise<YieldSource>;
export declare function getSwapValue(vault: VaultDefinitionModel, tradeData: PairDayData[]): YieldSource;
