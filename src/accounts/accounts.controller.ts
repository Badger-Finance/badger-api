import { Controller, Get, Inject, PathParams, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { AccountsService } from './accounts.service';
import { Account } from './interfaces/account.interface';

@Controller('/accounts')
export class AccountsController {
  @Inject()
  accountsService!: AccountsService;

  @Get('/:accountId')
  @ContentType('json')
  async getAccount(
    @PathParams('accountId') userId: string,
    @QueryParams('chain') chain?: ChainNetwork,
  ): Promise<Account> {
    return this.accountsService.getAccount(Chain.getChain(chain), userId);
  }
}
