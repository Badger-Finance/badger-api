import { ProtocolMetrics } from './metrics.interface';
export declare class ProtocolMetricModel implements ProtocolMetrics {
    totalUsers: number;
    totalVaults: number;
    totalValueLocked: number;
    constructor(protocolMetrics: ProtocolMetrics);
}
