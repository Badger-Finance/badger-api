import '@tsed/platform-express';

import { PlatformAws } from '@tsed/platform-aws';

import { swaggerConfig } from './config/constants';
import { Server } from './Server';

PlatformAws.bootstrap(Server, {
  aws: { binaryMimeTypes: [] },
  swagger: [swaggerConfig],
});

export const handler = PlatformAws.callback();
