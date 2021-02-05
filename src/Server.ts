<<<<<<< HEAD
import '@tsed/platform-express';
import { Configuration, Inject, PlatformApplication } from '@tsed/common';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import methodOverride from 'method-override';
import { controllers } from './ControllerRegistry';
=======
import { Configuration, Inject, PlatformApplication } from "@tsed/common";
import { controllers } from "./ControllerRegistry";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import compress from "compression";
>>>>>>> 9d4c094 (initial tsed implementation (#14))

const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: ['application/json'],
  mount: {
    '/v2/': controllers,
  },
  swagger: [
    {
      path: '/v2/docs',
      specVersion: '3.0.1',
    },
  ],
  logger: {
    disableRoutesSummary: true,
    disableBootstrapLog: true,
  },
})
export class Server {
  @Inject()
  app!: PlatformApplication;

  /**
   * This method let you configure the express middleware required by your application to work.
   * @returns {Server}
   */
  public $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true,
        }),
      );
  }
}
