import { Controller, Get, PathParams, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { resolveChainQuery } from '../config/chain';
import { ProtocolSummary } from '../interface/ProtocolSummary';
import { UserAccount } from '../interface/UserAccount';
import { SettService } from '../setts/SettsService';
import { UserService } from '../users/UserService';

@Controller('/protocol')
export class ProtocolController {
  constructor(private settService: SettService, private userService: UserService) {}

  @Get('/value')
  @ContentType('json')
  async getAssetsUnderManagement(@QueryParams('chain') chain: string): Promise<ProtocolSummary> {
    return this.settService.getProtocolSummary(resolveChainQuery(chain));
  }

  @Get('/user/:userId')
  @ContentType('json')
  async getUserProfile(
    @PathParams('userId') userId: string,
    @QueryParams('chain') chain: string,
  ): Promise<UserAccount> {
    return this.userService.getUserDetails(resolveChainQuery(chain), userId);
  }
}
