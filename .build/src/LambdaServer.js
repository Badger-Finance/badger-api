"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
require("@tsed/platform-express");
const platform_aws_1 = require("@tsed/platform-aws");
const constants_1 = require("./config/constants");
const Server_1 = require("./Server");
platform_aws_1.PlatformAws.bootstrap(Server_1.Server, {
    aws: { binaryMimeTypes: [] },
    swagger: [constants_1.swaggerConfig],
});
exports.handler = platform_aws_1.PlatformAws.callback();
//# sourceMappingURL=LambdaServer.js.map