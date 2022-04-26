import { Description, Property, Title } from '@tsed/schema';
import { CitadelRewardEvent } from './citadel-reward-event.interface';

@Description('Citadel DAO Reward Event')
export class CitadelRewardEventModel implements CitadelRewardEvent {
  @Title('block')
  @Description('At which reward was added')
  @Property()
  block?: number;

  @Title('user')
  @Description('Acc addr on the network')
  @Property()
  user?: string;

  @Title('token')
  @Description('Token addr reward was given')
  @Property()
  token: string;

  @Title('amount')
  @Description('Value of roken reward')
  @Property()
  amount: number;

  constructor(summary: CitadelRewardEvent) {
    this.block = summary.block;
    this.user = summary.user;
    this.token = summary.token;
    this.amount = summary.amount;
  }
}
