"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const exceptions_1 = require("@tsed/exceptions");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const protocol_metric_snapshot_model_1 = require("../aws/models/protocol-metric-snapshot.model");
const metric_type_1 = require("./enums/metric-type");
let MetricsService = class MetricsService {
  async getProtocolMetrics() {
    const mapper = (0, dynamodb_utils_1.getDataMapper)();
    let result;
    try {
      for await (const metric of mapper.query(
        protocol_metric_snapshot_model_1.ProtocolMetricSnapshot,
        { type: metric_type_1.MetricType.protocol },
        { scanIndexForward: false, limit: 1 }
      )) {
        result = metric;
      }
    } catch (error) {
      console.error(error);
      throw new exceptions_1.NotFound("Protocol metrics not available");
    }
    if (!result) {
      throw new exceptions_1.NotFound("Protocol metrics not available");
    }
    return result;
  }
};
MetricsService = tslib_1.__decorate([(0, common_1.Service)()], MetricsService);
exports.MetricsService = MetricsService;
//# sourceMappingURL=metrics.service.js.map
