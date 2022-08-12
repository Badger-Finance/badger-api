"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const platform_middlewares_1 = require("@tsed/platform-middlewares");
const platform_params_1 = require("@tsed/platform-params");
const constants_1 = require("../../config/constants");
const access_denied_dev_error_1 = require("../../errors/access/access.denied.dev.error");
let DevelopmentFilter = class DevelopmentFilter {
    use(_) {
        if (constants_1.PRODUCTION)
            throw new access_denied_dev_error_1.AccessDeniedDevError();
    }
};
tslib_1.__decorate([
    tslib_1.__param(0, (0, platform_params_1.Context)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], DevelopmentFilter.prototype, "use", null);
DevelopmentFilter = tslib_1.__decorate([
    (0, platform_middlewares_1.Middleware)()
], DevelopmentFilter);
exports.default = DevelopmentFilter;
//# sourceMappingURL=development-filter.js.map