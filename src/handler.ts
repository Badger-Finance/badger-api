import { PlatformServerless } from '@tsed/platform-serverless';

import { V2_CONTROLLERS, V3_CONTROLLERS } from './controllers';
// import { swaggerConfig } from './config/constants';

const platform = PlatformServerless.bootstrap({
  mount: {
    '/v2': [V2_CONTROLLERS],
    '/v3': [V3_CONTROLLERS],
  },
});

export const handler = platform.handler();
