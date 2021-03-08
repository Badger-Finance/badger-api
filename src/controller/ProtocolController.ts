import { Controller, Get, PathParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { ProtocolSummary } from '../interface/ProtocolSummary';
import { UserAccount } from '../interface/UserAccount';
import { SettService } from '../setts/SettsService';
import { UserService } from '../service/user/UserService';

@Controller('/protocol')
export class ProtocolController {
	constructor(private settService: SettService, private userService: UserService) {}

	@Get('/value')
	@ContentType('json')
	async getAssetsUnderManagement(): Promise<ProtocolSummary> {
		return this.settService.getProtocolSummary();
	}

	@Get('/user/:userId')
	@ContentType('json')
	async getUserProfile(@PathParams('userId') userId: string): Promise<UserAccount> {
		return this.userService.getUserDetails(userId);
	}
}
