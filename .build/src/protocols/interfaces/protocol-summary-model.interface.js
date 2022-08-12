"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolSummaryModel = void 0;
const tslib_1 = require("tslib");
const schema_1 = require("@tsed/schema");
class ProtocolSummaryModel {
    constructor(protocolSummary) {
        this.totalValue = protocolSummary.totalValue;
        this.setts = protocolSummary.setts;
    }
}
tslib_1.__decorate([
    (0, schema_1.Title)('totalValue'),
    (0, schema_1.Description)('Total currency value locked on requested chain'),
    (0, schema_1.Example)(756231.32),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
], ProtocolSummaryModel.prototype, "totalValue", void 0);
tslib_1.__decorate([
    (0, schema_1.Title)('setts'),
    (0, schema_1.Description)('Minimal summaries of setts on requested chain'),
    (0, schema_1.Example)([
        { name: 'Badger', balance: 10, value: 60 },
        { name: 'Digg', balance: 12.32, value: 91345 },
    ]),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Array)
], ProtocolSummaryModel.prototype, "setts", void 0);
exports.ProtocolSummaryModel = ProtocolSummaryModel;
//# sourceMappingURL=protocol-summary-model.interface.js.map