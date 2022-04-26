import { Description, Example, Property, Title } from '@tsed/schema';
import { CitadelRewardEvent } from './citadel-reward-event.interface';

@Description('Citadel DAO Reward Event')
export class CitadelRewardEventModel implements CitadelRewardEvent {
  @Title('block')
  @Description('At which reward was added')
  @Example('11123943')
  @Property()
  block?: number;

  @Title('user')
  @Description('Acc addr on the network')
  @Example('0x19d97d8fa813ee2f51ad4b4e04ea08baf4dffc28')
  @Property()
  user?: string;

  @Title('token')
  @Description('Token addr reward was given')
  @Example('0xaF0b1FDf9c6BfeC7b3512F207553c0BA00D7f1A2')
  @Property()
  token: string;

  @Title('amount')
  @Description('Value of roken reward')
  @Example('100.2341')
  @Property()
  amount: number;

  constructor(summary: CitadelRewardEvent) {
    this.block = summary.block;
    this.user = summary.user;
    this.token = summary.token;
    this.amount = summary.amount;
  }
}
