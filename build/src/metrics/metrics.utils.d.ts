import { Chain } from '../chains/config/chain.config';
import { ProtocolSummary } from '../protocols/interfaces/protocol-summary.interface';
import { ProtocolMetrics, ProtocolSettsMetrics } from './interfaces/metrics.interface';
export declare const getProtocolMetrics: () => Promise<ProtocolMetrics>;
export declare function getProtocolTotalUsers(): Promise<number>;
export declare function getProtocolSettMetrics(): Promise<ProtocolSettsMetrics>;
export declare function getChainMetrics(chain: Chain): Promise<ProtocolSummary>;
