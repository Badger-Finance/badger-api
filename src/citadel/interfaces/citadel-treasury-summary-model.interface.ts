import { CitadelTreasurySummary } from '@badger-dao/sdk/lib/api/interfaces/citadel-treasury-summary.interface';
import { Description, Property, Title } from '@tsed/schema';
import { TreasuryPosition } from '../../treasury/interfaces/treasy-position.interface';

@Description('Citadel DAO Treasury Summary')
export class CitadelTreasurySummaryModel implements CitadelTreasurySummary {
  @Title('address')
  @Description('Treasury Multisig address')
  @Property()
  address: string;

  @Title('marketCapToTreasuryRatio')
  @Description('CTDL token market capitalization vs.Citadel DAO treasury capitalization')
  @Property()
  marketCapToTreasuryRatio: number;

  @Title('marketCapToTreasuryRatio')
  @Description('CTDL token market capitalization vs.Citadel DAO treasury capitalization')
  @Property()
  positions: TreasuryPosition[];

  @Title('value')
  @Description('USD value of Citadel DAO treausry')
  @Property()
  value: number;

  @Title('valueBtc')
  @Description('BTC value of Citadel DAO treausry')
  @Property()
  valueBtc: number;

  @Title('valuePaid')
  @Description('Paid value USD by Citadel DAO treausry')
  @Property()
  valuePaid: number;

  @Title('valuePaidBtc')
  @Description('Paid value BTC by Citadel DAO treausry')
  @Property()
  valuePaidBtc: number;

  @Title('yield')
  @Description('Average yield Citadel DAO treasury is earning')
  @Property()
  yield: number;

  constructor(summary: CitadelTreasurySummary) {
    this.address = summary.address;
    this.marketCapToTreasuryRatio = summary.marketCapToTreasuryRatio;
    this.positions = summary.positions;
    this.value = summary.value;
    this.valueBtc = summary.valueBtc;
    this.valuePaid = summary.valuePaid;
    this.valuePaidBtc = summary.valuePaidBtc;
    this.yield = summary.yield;
  }
}
