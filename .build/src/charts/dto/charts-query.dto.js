"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsQueryDto = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const chart_granularity_enum_1 = require("../enums/chart-granularity.enum");
class ChartsQueryDto {}
tslib_1.__decorate(
  [(0, class_validator_1.IsEthereumAddress)(), tslib_1.__metadata("design:type", String)],
  ChartsQueryDto.prototype,
  "id",
  void 0
);
tslib_1.__decorate(
  [
    (0, class_validator_1.IsEnum)(sdk_1.Network),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
  ],
  ChartsQueryDto.prototype,
  "chain",
  void 0
);
tslib_1.__decorate(
  [
    (0, class_validator_1.ValidateIf)((o) => Boolean(o.end)),
    (0, class_validator_1.IsISO8601)(),
    tslib_1.__metadata("design:type", Date)
  ],
  ChartsQueryDto.prototype,
  "start",
  void 0
);
tslib_1.__decorate(
  [
    (0, class_validator_1.ValidateIf)((o) => Boolean(o.start)),
    (0, class_validator_1.IsISO8601)(),
    tslib_1.__metadata("design:type", Date)
  ],
  ChartsQueryDto.prototype,
  "end",
  void 0
);
tslib_1.__decorate(
  [
    (0, class_validator_1.IsEnum)(chart_granularity_enum_1.ChartGranularity),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
  ],
  ChartsQueryDto.prototype,
  "granularity",
  void 0
);
tslib_1.__decorate(
  [
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    tslib_1.__metadata("design:type", Number)
  ],
  ChartsQueryDto.prototype,
  "period",
  void 0
);
exports.ChartsQueryDto = ChartsQueryDto;
//# sourceMappingURL=charts-query.dto.js.map
