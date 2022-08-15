"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const schema_1 = require("@tsed/schema");
const protocol_metric_model_1 = require("./interfaces/protocol-metric-model");
const metrics_service_1 = require("./metrics.service");
let MetricsController = class MetricsController {
  async getProtocolMetrics() {
    return this.metricsService.getProtocolMetrics();
  }
};
tslib_1.__decorate(
  [(0, common_1.Inject)(), tslib_1.__metadata("design:type", metrics_service_1.MetricsService)],
  MetricsController.prototype,
  "metricsService",
  void 0
);
tslib_1.__decorate(
  [
    (0, common_1.Get)(""),
    (0, schema_1.ContentType)("json"),
    (0, schema_1.Summary)("Get a metric of the protocol across all chains"),
    (0, schema_1.Description)(
      "Returns the total amount of users, total amount of vaults and total value locked across all chains"
    ),
    (0, schema_1.Returns)(200, protocol_metric_model_1.ProtocolMetricModel),
    (0, schema_1.Returns)(404).Description("Protocol metrics not available"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
  ],
  MetricsController.prototype,
  "getProtocolMetrics",
  null
);
MetricsController = tslib_1.__decorate([(0, common_1.Controller)("/metrics")], MetricsController);
exports.MetricsController = MetricsController;
//# sourceMappingURL=metrics.controller.js.map
