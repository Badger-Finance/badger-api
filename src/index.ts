import { $log } from '@tsed/common';
import { PlatformExpress } from '@tsed/platform-express';
import { Server } from './Server';

async function bootstrap() {
  try {
    const platform = await PlatformExpress.bootstrap(Server, {});
    await platform.listen();
  } catch (err) {
    $log.error(err);
  }
}

bootstrap();
