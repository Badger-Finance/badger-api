import '@tsed/platform-express';
import { PlatformAws } from '@tsed/platform-aws';
import { Server } from './Server';

PlatformAws.bootstrap(Server, {
  aws: {
    binaryMimeTypes: [],
  },
});

export const handler = PlatformAws.callback();
