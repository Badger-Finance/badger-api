import { Account } from '@badger-dao/sdk';
import { Service } from '@tsed/di';
import { BadRequest } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { Chain } from '../chains/config/chain.config';
import { cachedTokenBalanceToTokenBalance } from '../tokens/tokens.utils';
import { getCachedAccount, getCachedBoost } from './accounts.utils';
import { CachedAccount } from './interfaces/cached-account.interface';

@Service()
export class AccountsService {
  async getAccount(chain: Chain, accountId: string): Promise<Account> {
    let checksumAddress = accountId;
    try {
      checksumAddress = ethers.utils.getAddress(accountId);
    } catch {
      throw new BadRequest(`${accountId} is not a valid account`);
    }
    const cachedAccount = await getCachedAccount(checksumAddress);
    return AccountsService.cachedAccountToAccount(chain, cachedAccount);
  }

  static async cachedAccountToAccount(chain: Chain, cachedAccount: CachedAccount): Promise<Account> {
    const { network } = chain;
    const balances = cachedAccount.balances
      .filter((bal) => !network || bal.network === network)
      .map((bal) => ({
        ...bal,
        tokens: bal.tokens.map((token) => cachedTokenBalanceToTokenBalance(token)),
        earnedTokens: bal.earnedTokens.map((token) => cachedTokenBalanceToTokenBalance(token)),
      }));
    const multipliers = Object.fromEntries(
      cachedAccount.multipliers
        .filter((mult) => mult.network === network)
        .map((entry) => [entry.address, entry.multiplier]),
    );
    const data = Object.fromEntries(balances.map((bal) => [bal.address, bal]));
    // TODO: UPDATE WITH SNAPSHOT METADATA LOOKUP + FETCH USER CLAIMABLE
    // const claimableBalances = Object.fromEntries(
    //   cachedAccount.claimableBalances.map((bal) => [bal.address, bal.balance]),
    // );
    const cachedBoost = await getCachedBoost(chain, cachedAccount.address);
    const { boost, rank, stakeRatio, nftBalance, nativeBalance, nonNativeBalance } = cachedBoost;
    const { address } = cachedAccount;
    const value = balances.map((b) => b.value).reduce((total, value) => (total += value), 0);
    const earnedValue = balances.map((b) => b.earnedValue).reduce((total, value) => (total += value), 0);
    const account: Account = {
      address,
      value,
      earnedValue,
      boost,
      boostRank: rank,
      multipliers,
      data,
      claimableBalances: {},
      stakeRatio,
      nftBalance,
      nativeBalance,
      nonNativeBalance,
    };
    return account;
  }
}
