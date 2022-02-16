import { Account, VaultData } from '@badger-dao/sdk';
import { Description, Example, Property, Title } from '@tsed/schema';
import { ethers } from 'ethers';
import { TOKENS } from '../../config/tokens.config';
import { getToken, mockBalance } from '../../tokens/tokens.utils';

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

  @Title('rank')
  @Description('Badger Boost Rank')
  @Example('6')
  @Property()
  public rank: number;

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
  public multipliers: Record<string, number>;

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

  @Title('data')
  @Description('Account sett balance information, positions, earnings, and tokens keyed by vault address')
  @Example({
    [TOKENS.BADGER]: {
      address: TOKENS.BBADER,
      name: getToken(TOKENS.BADGER).name,
      symbol: getToken(TOKENS.BADGER).symbol,
      balance: 3.4,
      value: mockBalance(getToken(TOKENS.BADGER), 3.4).value,
      tokens: [mockBalance(getToken(TOKENS.BADGER), 3.4)],
      earnedBalance: 0.4,
      earnedValue: mockBalance(getToken(TOKENS.BADGER), 0.4).value,
      earnedTokens: [mockBalance(getToken(TOKENS.BADGER), 0.4)],
    },
    [TOKENS.DIGG]: {
      address: TOKENS.DIGG,
      name: getToken(TOKENS.DIGG).name,
      symbol: getToken(TOKENS.DIGG).symbol,
      balance: 3.4,
      value: mockBalance(getToken(TOKENS.DIGG), 3.4).value,
      tokens: [mockBalance(getToken(TOKENS.DIGG), 3.4)],
      earnedBalance: 0.4,
      earnedValue: mockBalance(getToken(TOKENS.DIGG), 0.4).value,
      earnedTokens: [mockBalance(getToken(TOKENS.DIGG), 0.4)],
    },
  })
  @Property()
  public data: Record<string, VaultData>;

  @Title('claimableBalancesMap')
  @Description('Claimable amounts of tokens currently available for an account in the Badger Tree')
  @Example({
    [TOKENS.BADGER]: ethers.constants.WeiPerEther.mul(4).toString(),
    [TOKENS.XSUSHI]: ethers.constants.WeiPerEther.mul(88).toString(),
    [TOKENS.DIGG]: ethers.constants.WeiPerEther.mul(128834885688).toString(),
  })
  @Property()
  public claimableBalances: Record<string, string>;

  @Title('stakeRatio')
  @Description('Ratio of native to non native holdings')
  @Example(1.2)
  @Property()
  public stakeRatio: number;

  @Title('nftBalance')
  @Description("Currency value of an account's current nft hodlings")
  @Example(1313.13)
  @Property()
  public nftBalance: number;

  @Title('bveCvxBalance')
  @Description("Currency value of an account's current bveCVX hodlings")
  @Example(1313.13)
  @Property()
  public bveCvxBalance: number;

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
    this.rank = account.rank;
    this.boostRank = account.boostRank;
    this.multipliers = account.multipliers;
    this.value = account.value;
    this.earnedValue = account.earnedValue;
    this.data = account.data;
    this.claimableBalances = account.claimableBalances;
    this.stakeRatio = account.stakeRatio;
    this.nativeBalance = account.nativeBalance;
    this.nonNativeBalance = account.nonNativeBalance;
    this.nftBalance = account.nftBalance;
    this.bveCvxBalance = account.bveCvxBalance;
  }
}
