import '@tsed/platform-express';
import { PlatformAws } from '@tsed/platform-aws';
import { Server } from './Server';

PlatformAws.bootstrap(Server, {
  aws: { binaryMimeTypes: [] },
  swagger: [
    {
      path: '/docs',
    },
  ],
});

export const handler = PlatformAws.callback();
