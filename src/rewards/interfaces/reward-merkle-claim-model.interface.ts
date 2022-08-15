import { Description, Example, Property, Title } from '@tsed/schema';
import { ethers } from 'ethers';

import { TOKENS } from '../../config/tokens.config';
import { RewardMerkleClaim } from './reward-merkle-claim.interface';

export class RewardMerkleClaimModel implements RewardMerkleClaim {
  @Title('index')
  @Description('User reward entry index')
  @Example('0x3')
  @Property()
  public index: string;

  @Title('cycle')
  @Description('Proof corresponding reward cycle')
  @Example('0x487')
  @Property()
  public cycle: string;

  @Title('user')
  @Description('User account id')
  @Example('0x0f571D2625b503BB7C1d2b5655b483a2Fa696fEf')
  @Property()
  public user: string;

  @Title('tokens')
  @Description('Tokens available to claim')
  @Example([TOKENS.BADGER, TOKENS.DIGG, TOKENS.XSUSHI])
  @Property()
  public tokens: string[];

  @Title('cumulativeAmounts')
  @Description('Total historic claimable token amounts in wei')
  @Example([
    ethers.constants.WeiPerEther.mul(2).toString(),
    ethers.constants.WeiPerEther.mul(12887527662).toString(),
    ethers.constants.WeiPerEther.mul(6).div(1000).toString(),
  ])
  @Property()
  public cumulativeAmounts: string[];

  @Title('proof')
  @Description('Reward cycle merkle proof')
  @Example([
    '0xcd678491cc646856ce19ab692f9070861332e300',
    '0xcd678491cc646856ce19ab692f9070861332e300',
    '0xcd678491cc646856ce19ab692f9070861332e300',
    '0xcd678491cc646856ce19ab692f9070861332e300',
    '0xcd678491cc646856ce19ab692f9070861332e300',
  ])
  @Property()
  public proof: string[];

  @Property()
  public node: string;

  constructor(claim: RewardMerkleClaim) {
    this.index = claim.index;
    this.cycle = claim.cycle;
    this.user = claim.user;
    this.tokens = claim.tokens;
    this.cumulativeAmounts = claim.cumulativeAmounts;
    this.proof = claim.proof;
    this.node = claim.node;
  }
}
