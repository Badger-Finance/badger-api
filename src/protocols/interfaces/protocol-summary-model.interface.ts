import { Description, Example, Property, Title } from '@tsed/schema';
import { ethSetts } from '../../chains/config/eth.config';
import { SettSummary } from '../../setts/interfaces/sett-summary.interface';
import { ProtocolSummary } from './protocol-summary.interface';

export class ProtocolSummaryModel implements ProtocolSummary {
  @Title('totalValue')
  @Description('Total currency value locked on requested chain')
  @Example(756231.32)
  @Property()
  public totalValue: number;

  @Title('setts')
  @Description('Minimal summaries of setts on requested chain')
  @Example([
    { name: ethSetts[0], balance: 10, value: 60 },
    { name: ethSetts[1], balance: 12.32, value: 91345 },
  ])
  @Property()
  public setts?: SettSummary[];

  constructor(protocolSummary: ProtocolSummary) {
    this.totalValue = protocolSummary.totalValue;
    this.setts = protocolSummary.setts;
  }
}
