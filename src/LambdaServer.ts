import { PlatformAws } from '@tsed/platform-aws';
import '@tsed/platform-express';
import { Server } from './Server';

PlatformAws.bootstrap(Server, {
	aws: {
		binaryMimeTypes: [],
	},
});

export const handler = PlatformAws.callback();
