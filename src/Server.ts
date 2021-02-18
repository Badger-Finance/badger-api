import { Configuration, Inject, PlatformApplication } from '@tsed/common';
import { controllers } from './ControllerRegistry';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compress from 'compression';

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
})
export class Server {
	@Inject()
	app!: PlatformApplication;

	/**
	 * This method let you configure the express middleware required by your application to work.
	 * @returns {Server}
	 */
	public $beforeRoutesInit(): void | Promise<any> {
		this.app
			.use(cookieParser())
			.use(compress({}))
			.use(methodOverride())
			.use(bodyParser.json())
			.use(
				bodyParser.urlencoded({
					extended: true,
				}),
			);
	}
}
