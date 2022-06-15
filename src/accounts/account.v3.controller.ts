import { Network } from '@badger-dao/sdk';
import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType, Description, Returns, Summary } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { AccountsService } from './accounts.service';
import { AccountModel } from './interfaces/account-model.interface';
import { QueryParamError } from '../errors/validation/query.param.error';

@Controller('/account')
export class AccountV3Controller {
  @Inject()
  accountsService!: AccountsService;

  @Get()
  @ContentType('json')
  @Summary('Get badger user account information')
  @Description(
    'Return key user information for a given account. Includes positions, earnings from use, and claimable balances.',
  )
  @Returns(200, AccountModel)
  @Returns(400).Description('Not a valid chain')
  @Returns(404).Description('Not a valid account')
  async getAccount(
    @QueryParams('accountId') userId: string,
    @QueryParams('chain') chain: Network,
  ): Promise<AccountModel> {
    if (!userId) throw new QueryParamError('userId');

    return this.accountsService.getAccount(Chain.getChain(chain), userId);
  }
}
