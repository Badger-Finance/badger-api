import { Description, Example, Property, Title } from '@tsed/schema';
import { CitadelMerkleClaim } from './citadel-merkle-claim.interface';

export class CitadelMerkleClaimModel implements CitadelMerkleClaim {
  @Title('account')
  @Description('User account id')
  @Example('0x0f571D2625b503BB7C1d2b5655b483a2Fa696fEf')
  @Property()
  public account: string;

  @Title('protocols')
  @Description('Tokens available to claim')
  @Example(['badger', 'convex', 'redacted'])
  @Property()
  public protocols: string[];

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

  constructor(claim: CitadelMerkleClaim) {
    this.account = claim.account;
    this.protocols = claim.protocols;
    this.proof = claim.proof;
    this.node = claim.node;
  }
}
