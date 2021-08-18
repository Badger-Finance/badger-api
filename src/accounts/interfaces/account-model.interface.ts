import { Description, Example, Property, Title } from '@tsed/schema';
import { ethers } from 'ethers';
import { TOKENS } from '../../config/tokens.config';
import { BoostMultipliers } from '../../rewards/interfaces/boost-multipliers.interface';
import { getToken, mockBalance } from '../../tokens/tokens.utils';
import { Account } from './account.interface';
import { CachedBalance } from './cached-claimable-balance.interface';
import { SettBalance } from './sett-balance.interface';

export class AccountModel implements Account {
  @Title('id')
  @Description('Account Address')
  @Example('0xb89b8702deac50254d002225b61286bc622d741e')
  @Property()
  public address: string;

  @Title('boost')
  @Description('Badger Boost')
  @Example('2.74')
  @Property()
  public boost: number;

  @Title('boostRank')
  @Description('Badger Boost Rank')
  @Example('6')
  @Property()
  public boostRank: number;

  @Title('boostMultipliers')
  @Description("Mapping of user's individual sett multipliers for rewards distribution")
  @Example({
    [TOKENS.BBADER]: 0.73,
    [TOKENS.BDIGG]: 0.61,
    [TOKENS.CVXCRV]: 0.88,
  })
  @Property()
  public multipliers: BoostMultipliers;

  @Title('value')
  @Description("Currency value of an account's current holdings")
  @Example(88888.888)
  @Property()
  public value: number;

  @Title('earnedValue')
  @Description("Currency value of an account's total earnings")
  @Example(1313.13)
  @Property()
  public earnedValue: number;

  @Title('balances')
  @Description('Account sett balance information, positions, earnings, and tokens per sett')
  @Example([
    {
      id: TOKENS.BBADER,
      name: getToken(TOKENS.BADGER).name,
      asset: getToken(TOKENS.BADGER).symbol,
      balance: 3.4,
      value: mockBalance(getToken(TOKENS.BADGER), 3.4).value,
      tokens: [mockBalance(getToken(TOKENS.BADGER), 3.4)],
      earnedBalance: 0.4,
      earnedValue: mockBalance(getToken(TOKENS.BADGER), 0.4).value,
      earnedTokens: [mockBalance(getToken(TOKENS.BADGER), 0.4)],
    },
  ])
  @Property()
  public balances: SettBalance[];

  @Title('claimableBalances')
  @Description('Claimable amounts of tokens currently available for an account in the Badger Tree')
  @Example({
    [TOKENS.BADGER]: ethers.constants.WeiPerEther.mul(4).toString(),
    [TOKENS.XSUSHI]: ethers.constants.WeiPerEther.mul(88).toString(),
    [TOKENS.DIGG]: ethers.constants.WeiPerEther.mul(128834885688).toString(),
  })
  @Property()
  public claimableBalances: CachedBalance[];

  @Title('nativeBalance')
  @Description("Currency value of an account's current native hodlings")
  @Example(1313.13)
  @Property()
  public nativeBalance: number;

  @Title('nonNativeBalance')
  @Description("Currency value of an account's current non-native hodlings")
  @Example(1313.13)
  @Property()
  public nonNativeBalance: number;

  constructor(account: Account) {
    this.address = account.address;
    this.boost = account.boost;
    this.boostRank = account.boostRank;
    this.multipliers = account.multipliers;
    this.value = account.value;
    this.earnedValue = account.earnedValue;
    this.balances = account.balances;
    this.claimableBalances = account.claimableBalances;
    this.nativeBalance = account.nativeBalance;
    this.nonNativeBalance = account.nonNativeBalance;
  }
}
