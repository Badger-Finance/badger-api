import {PlatformServerless} from "@tsed/platform-serverless";
// import { swaggerConfig } from './config/constants';

const platform = PlatformServerless.bootstrap({
  lambda: [],
});

export const handler = platform.handler();
