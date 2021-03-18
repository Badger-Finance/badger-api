import { Controller, Get, Inject, PathParams, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { UserAccount } from '../interface/UserAccount';
import { UsersService } from './UsersService';

@Controller('/users')
export class UsersController {
  @Inject()
  usersService!: UsersService;

  @Get('/:userId')
  @ContentType('json')
  async getUserProfile(
    @PathParams('userId') userId: string,
    @QueryParams('chain') chain?: string,
  ): Promise<UserAccount> {
    return this.usersService.getUserDetails(Chain.getChain(chain), userId);
  }
}
