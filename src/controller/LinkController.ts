import { Controller, Get } from '@tsed/common';

@Controller('/')
export class LinkController {
	@Get()
	getApiLinks(): string {
		return 'Hah!';
	}
}
