import { Controller, Get, Inject, PathParams, QueryParams } from '@tsed/common';
import { ContentType, Description, Hidden, Returns, Summary } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { AccountsService } from './accounts.service';
import { AccountModel } from './interfaces/account-model.interface';
import { UnclaimedRewards } from './interfaces/unclaimed-rewards.interface';

@Controller('/accounts')
export class AccountsController {
  @Inject()
  accountsService!: AccountsService;

  @Hidden()
  @Get('/allClaimable')
  @ContentType('json')
  async getAllBadgerTreeRewards(@QueryParams('page') page?: number): Promise<UnclaimedRewards> {
    return this.accountsService.getAllUnclaimed(page ?? 1);
  }

  @Get('/:accountId')
  @ContentType('json')
  @Summary('Get badger user account information')
  @Description(
    'Return key user information for a given account. Includes positions, earnings from use, and claimable balances.',
  )
  @Returns(200, AccountModel)
  @(Returns(400).Description('Not a valid chain'))
  @(Returns(404).Description('Not a valid account'))
  async getAccount(
    @PathParams('accountId') userId: string,
    @QueryParams('chain') chain?: ChainNetwork,
  ): Promise<AccountModel> {
    return this.accountsService.getAccount(Chain.getChain(chain), userId);
  }
}
