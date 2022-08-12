import { PlatformExpress } from '@tsed/platform-express';
import { Server } from './Server';

async function bootstrap() {
  const platform = await PlatformExpress.bootstrap(Server, {
    httpsPort: false,
    httpPort: process.env.PORT || 8080,
    disableComponentsScan: true
  });

  await platform.listen();

  return platform;
}

bootstrap();
