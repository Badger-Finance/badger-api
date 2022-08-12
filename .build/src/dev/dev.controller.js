"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevelopmentController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const schema_1 = require("@tsed/schema");
const development_filter_1 = tslib_1.__importDefault(require("../common/filters/development-filter"));
const dev_service_1 = require("./dev.service");
let DevelopmentController = class DevelopmentController {
    async test(param) {
        return param;
    }
    async ddbUpdateSeeds() {
        return this.developmentService.updateDynamoDbSeeds();
    }
};
tslib_1.__decorate([
    (0, common_1.Inject)(),
    tslib_1.__metadata("design:type", dev_service_1.DevelopmentService)
], DevelopmentController.prototype, "developmentService", void 0);
tslib_1.__decorate([
    (0, common_1.Get)('/test'),
    (0, schema_1.ContentType)('json'),
    (0, schema_1.Description)('Put any function that u want to test out'),
    tslib_1.__param(0, (0, common_1.QueryParams)('param')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DevelopmentController.prototype, "test", null);
tslib_1.__decorate([
    (0, common_1.Get)('/ddb/seeds'),
    (0, schema_1.ContentType)('json'),
    (0, schema_1.Description)('Update seed files for DynamoDb'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], DevelopmentController.prototype, "ddbUpdateSeeds", null);
DevelopmentController = tslib_1.__decorate([
    (0, common_1.Controller)('/dev'),
    (0, common_1.UseBefore)(development_filter_1.default),
    (0, schema_1.Hidden)()
], DevelopmentController);
exports.DevelopmentController = DevelopmentController;
//# sourceMappingURL=dev.controller.js.map