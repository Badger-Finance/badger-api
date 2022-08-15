"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexProtocolMetrics = void 0;
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const protocol_metric_snapshot_model_1 = require("../aws/models/protocol-metric-snapshot.model");
const metric_type_1 = require("../metrics/enums/metric-type");
const metrics_utils_1 = require("../metrics/metrics.utils");
const indexProtocolMetrics = async () => {
  const mapper = (0, dynamodb_utils_1.getDataMapper)();
  const metric = await (0, metrics_utils_1.getProtocolMetrics)();
  const metricSnapshot = Object.assign(new protocol_metric_snapshot_model_1.ProtocolMetricSnapshot(), {
    ...metric,
    type: metric_type_1.MetricType.protocol
  });
  try {
    await mapper.put(metricSnapshot);
  } catch (err) {
    console.error({ err, metricSnapshot });
  }
  return "done";
};
exports.indexProtocolMetrics = indexProtocolMetrics;
//# sourceMappingURL=protocol-metric-indexer.js.map
