import { PlatformExpress } from "@tsed/platform-express";

import { Server } from "./server";

async function bootstrap() {
  const platform = await PlatformExpress.bootstrap(Server, {
    httpsPort: false,
    httpPort: process.env.PORT || 3000,
    disableComponentsScan: true
  });

  await platform.listen();

  return platform;
}

bootstrap();
