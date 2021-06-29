import '@tsed/platform-express';
import { PlatformAws } from '@tsed/platform-aws';
import { Server } from './Server';

// https://github.com/tsedio/tsed-example-aws/blob/master/src/LambdaServer.ts
// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below, then redeploy (`npm run package-deploy`)
const binaryMimeTypes = [
  'application/javascript',
  'application/json',
  'application/octet-stream',
  'application/xml',
  'font/eot',
  'font/opentype',
  'font/otf',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'text/comma-separated-values',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain',
  'text/text',
  'text/xml',
];

PlatformAws.bootstrap(Server, {
  aws: { binaryMimeTypes },
  swagger: [
    {
      path: '/docs',
    },
  ],
});

export const handler = PlatformAws.callback();
