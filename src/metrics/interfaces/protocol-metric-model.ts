import { ProtocolMetrics } from '@badger-dao/sdk';
import { Description, Example, Property, Title } from '@tsed/schema';

export class ProtocolMetricModel implements ProtocolMetrics {
  @Title('totalUsers')
  @Description('Total amount of users of the protocol')
  @Example(30_000)
  @Property()
  public totalUsers: number;

  @Title('totalVaults')
  @Description('Total amount of vaults available in the protocol across all chains')
  @Example(30)
  @Property()
  public totalVaults: number;

  @Title('totalValueLocked')
  @Description('Total value locked across all chains')
  @Example(800_000_000)
  @Property()
  public totalValueLocked: number;

  constructor(protocolMetrics: ProtocolMetrics) {
    this.totalUsers = protocolMetrics.totalUsers;
    this.totalVaults = protocolMetrics.totalVaults;
    this.totalValueLocked = protocolMetrics.totalValueLocked;
  }
}
