import '@tsed/platform-express';
import { PlatformAws } from '@tsed/platform-aws';
import { loadChains } from './chains/chain';
import { Server } from './Server';

loadChains();

PlatformAws.bootstrap(Server, {
  aws: {
    binaryMimeTypes: [],
  },
});

export const handler = PlatformAws.callback();
