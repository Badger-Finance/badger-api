import { ProtocolMetrics } from '../../metrics/interfaces/metrics.interface';
export declare class ProtocolMetricSnapshot implements ProtocolMetrics {
    type: string;
    timestamp: number;
    totalUsers: number;
    totalVaults: number;
    totalValueLocked: number;
}
