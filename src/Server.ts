import '@tsed/platform-express';
import './common/filters/badger-exception-filter';
import '@tsed/swagger';
import { Configuration, Inject, PlatformApplication } from '@tsed/common';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import methodOverride from 'method-override';
import { loadChains } from './chains/chain';
import { swaggerConfig } from './config/constants';
import { V2_CONTROLLERS } from './ControllerRegistry';
import { CITADEL_V1_CONTROLLERS } from './CitadelControllerRegistry';

@Configuration({
  rootDir: __dirname,
  acceptMimes: ['application/json'],
  mount: {
    '/v2/': V2_CONTROLLERS,
    '/citadel/v1/': CITADEL_V1_CONTROLLERS,
  },
  swagger: [swaggerConfig],
  logger: {
    disableRoutesSummary: true,
    disableBootstrapLog: true,
    logRequest: false,
  },
  exclude: ['**/*.spec.ts'],
})
export class Server {
  @Inject()
  app!: PlatformApplication;

  public $beforeInit(): void {
    loadChains();
  }

  /**
   * This method let you configure the express middleware required by your application to work.
   * @returns {Server}
   */
  $beforeRoutesInit(): void | Promise<void> {
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
