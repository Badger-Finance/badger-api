"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const platform_express_1 = require("@tsed/platform-express");
const Server_1 = require("./Server");
async function bootstrap() {
  try {
    const platform = await platform_express_1.PlatformExpress.bootstrap(Server_1.Server, {});
    await platform.listen();
  } catch (err) {
    common_1.$log.error(err);
  }
}
bootstrap();
//# sourceMappingURL=index.js.map
