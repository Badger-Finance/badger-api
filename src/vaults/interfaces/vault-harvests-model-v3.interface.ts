import { YieldEvent, YieldType } from '@badger-dao/sdk';
import { Description, Example, Property, Title } from '@tsed/schema';

import { TOKENS } from '../../config/tokens.config';

export class VaultHarvestV3Model implements YieldEvent {
  @Title('timestamp')
  @Description('time of harvest emitted')
  @Example(Date.now())
  @Property()
  public timestamp!: number;

  @Title('block')
  @Description('number of proccessed block')
  @Example(344534534)
  @Property()
  public block!: number;

  @Title('token')
  @Description('addr of harvested token')
  @Example(TOKENS.BADGER)
  @Property()
  public token!: string;

  @Title('amount')
  @Description('amount of token earned')
  @Example('15.3452')
  @Property()
  public amount!: number;

  @Title('earned')
  @Description('amount of token earned in usd')
  @Example('15.3452')
  @Property()
  public earned!: number;

  @Title('type')
  @Description('Harvest or TreeDistribution')
  @Example(YieldType.TreeDistribution)
  @Property()
  public type!: YieldType;

  @Title('balance')
  @Description('balance of strategy on time of harvest')
  @Example(777)
  @Property()
  public balance!: number;

  @Title('value')
  @Description('value of the vault strategy tokens in usd')
  @Example(10000)
  @Property()
  public value!: number;

  @Title('apr')
  @Description('APR for the yield event, after fees')
  @Example(40)
  @Property()
  public apr!: number;

  @Title('grossApr')
  @Description('APR for the yield event, before fees')
  @Example(44)
  @Property()
  public grossApr!: number;

  @Title('tx')
  @Description('Event transaction hash')
  @Example('0x30bc2ab3a59f7923ea20f7b99331dbc974130dc8b7152bb897d393fc2c506214')
  @Property()
  public tx!: string;
}
