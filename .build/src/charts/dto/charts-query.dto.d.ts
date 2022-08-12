import { Network } from '@badger-dao/sdk';
import { ChartGranularity } from '../enums/chart-granularity.enum';
export declare class ChartsQueryDto {
    readonly id: string;
    readonly chain?: Network;
    readonly start?: Date;
    readonly end?: Date;
    readonly granularity?: ChartGranularity;
    readonly period?: number;
}
