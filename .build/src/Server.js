"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const tslib_1 = require("tslib");
require("@tsed/platform-express");
require("./common/filters/tsed-exception-filter");
require("./common/filters/api-exception-filter");
require("@tsed/swagger");
const common_1 = require("@tsed/common");
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const method_override_1 = tslib_1.__importDefault(require("method-override"));
const constants_1 = require("./config/constants");
const ControllerRegistry_1 = require("./ControllerRegistry");
let Server = class Server {
    /**
     * This method let you configure the express middleware required by your application to work.
     * @returns {Server}
     */
    $beforeRoutesInit() {
        this.app
            .use((0, cors_1.default)())
            .use((0, cookie_parser_1.default)())
            .use((0, method_override_1.default)())
            .use(body_parser_1.default.json())
            .use(body_parser_1.default.urlencoded({
            extended: true,
        }));
    }
};
tslib_1.__decorate([
    (0, common_1.Inject)(),
    tslib_1.__metadata("design:type", common_1.PlatformApplication)
], Server.prototype, "app", void 0);
Server = tslib_1.__decorate([
    (0, common_1.Configuration)({
        rootDir: __dirname,
        acceptMimes: ['application/json'],
        mount: {
            '/v2/': ControllerRegistry_1.V2_CONTROLLERS,
            '/v3/': ControllerRegistry_1.V3_CONTROLLERS,
        },
        swagger: [constants_1.swaggerConfig],
        logger: {
            disableRoutesSummary: true,
            disableBootstrapLog: true,
            logRequest: false,
        },
        cache: {
            ttl: 300,
            store: 'memory',
        },
        exclude: ['**/*.spec.ts'],
    })
], Server);
exports.Server = Server;
//# sourceMappingURL=Server.js.map