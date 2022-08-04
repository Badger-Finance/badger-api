import { Description, Example, Property, Title } from '@tsed/schema';

import { VaultSummary } from '../../vaults/interfaces/vault-summary.interface';
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
    { name: 'Badger', balance: 10, value: 60 },
    { name: 'Digg', balance: 12.32, value: 91345 },
  ])
  @Property()
  public setts?: VaultSummary[];

  constructor(protocolSummary: ProtocolSummary) {
    this.totalValue = protocolSummary.totalValue;
    this.setts = protocolSummary.setts;
  }
}
