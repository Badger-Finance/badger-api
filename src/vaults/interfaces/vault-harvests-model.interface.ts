import { Description, Example, Property, Title } from '@tsed/schema';

import { TOKENS } from '../../config/tokens.config';
import { YieldType } from '../enums/yield-type.enum';
import { VaultHarvestsExtendedResp } from './vault-harvest-extended-resp.interface';

export class VaultHarvestsModel implements VaultHarvestsExtendedResp {
  @Title('timestamp')
  @Description('time of harvest emitted')
  @Example(Date.now())
  @Property()
  public timestamp: number;

  @Title('block')
  @Description('number of proccessed block')
  @Example(344534534)
  @Property()
  public block: number;

  @Title('token')
  @Description('addr of harvested token')
  @Example(TOKENS.BADGER)
  @Property()
  public token: string;

  @Title('amount')
  @Description('amount of harvested token')
  @Example('15.3452')
  @Property()
  public amount: number;

  @Title('eventType')
  @Description('Harvest or TreeDistribution')
  @Example(YieldType.Distribution)
  @Property()
  public eventType: YieldType;

  @Title('strategyBalance')
  @Description('balance of strategy on time of harvest')
  @Example(777)
  @Property()
  public strategyBalance?: number;

  @Title('estimatedApr')
  @Description('Apr for current event')
  @Example(40)
  @Property()
  public estimatedApr?: number;

  @Title('tx')
  @Description('Event transaction hash')
  @Example('0x30bc2ab3a59f7923ea20f7b99331dbc974130dc8b7152bb897d393fc2c506214')
  @Property()
  public tx!: string;

  constructor({
    timestamp,
    block,
    token,
    amount,
    eventType,
    strategyBalance,
    estimatedApr,
    tx,
  }: VaultHarvestsExtendedResp) {
    this.timestamp = timestamp;
    this.block = block;
    this.token = token;
    this.amount = amount;
    this.eventType = eventType;
    this.strategyBalance = strategyBalance;
    this.estimatedApr = estimatedApr;
    this.tx = tx;
  }
}
