import { ProtocolMetrics } from './interfaces/metrics.interface';
import { MetricsService } from './metrics.service';
export declare class MetricsController {
    metricsService: MetricsService;
    getProtocolMetrics(): Promise<ProtocolMetrics>;
}
