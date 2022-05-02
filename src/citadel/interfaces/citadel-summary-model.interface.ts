import { CitadelRewardType } from '@badger-dao/sdk';
import { CitadelSummary } from '@badger-dao/sdk/lib/api/interfaces/citadel-summary.interface';
import { Description, Property, Title } from '@tsed/schema';

@Description('Citadel DAO Summary')
export class CitadelSummaryModel implements CitadelSummary {
  @Title('stakingApr')
  @Description('APR received for staking Citadel')
  @Property()
  stakingApr: number;

  @Title('lockingApr')
  @Description('APR received for locking Citadel')
  @Property()
  lockingApr: number;

  @Title('lockingAprSources')
  @Description('Breakdown of Citadel locking APR')
  @Property()
  lockingAprSources: Record<CitadelRewardType, number>;

  @Title('tokensPaid')
  @Description('Total historic token paid amounts')
  @Property()
  tokensPaid: Record<string, number>;

  @Title('valuePaid')
  @Description('Paid value USD by Citadel DAO treausry')
  @Property()
  valuePaid: number;

  constructor({ stakingApr, lockingApr, lockingAprSources, tokensPaid, valuePaid }: CitadelSummary) {
    this.stakingApr = stakingApr;
    this.lockingApr = lockingApr;
    this.lockingAprSources = lockingAprSources;
    this.tokensPaid = tokensPaid;
    this.valuePaid = valuePaid;
  }
}
