import { ConvertableDataBlob } from '../../aws/types/convertable-data-blob';
import { DataBlob } from '../../aws/types/data-blob';
import { CitadelRewardsAprBlob } from '../interfaces/citadel-rewards-apr-blob.interface';
import { CitadelRewardsTokenPaidMap } from '../interfaces/citadel-rewards-token-paid-map.interface';

export const CTIADEL_DATA = 'citadel-protocol-overview';

export class CitadelData extends ConvertableDataBlob {
  // treasury or fed related data
  valuePaid: number;
  marketCap: number;
  supply: number;
  staked: number;
  stakedPercent: number;
  marketCapToTreasuryRatio: number;
  fundingBps: number;
  stakingBps: number;
  lockingBps: number;

  // apr related data
  stakingApr: number;
  lockingApr: CitadelRewardsAprBlob;

  // paid data
  tokensPaid: CitadelRewardsTokenPaidMap;

  constructor(blob: DataBlob) {
    super(blob);
    this.valuePaid = this.keyedBlob.getNumber('valuePaid');
    this.marketCap = this.keyedBlob.getNumber('marketCap');
    this.supply = this.keyedBlob.getNumber('supply');
    this.staked = this.keyedBlob.getNumber('staked');
    this.stakedPercent = this.keyedBlob.getNumber('stakedPercent');
    this.marketCapToTreasuryRatio = this.keyedBlob.getNumber('marketCapToTreasuryRatio');
    this.fundingBps = this.keyedBlob.getNumber('fundingBps');
    this.stakingBps = this.keyedBlob.getNumber('stakingBps');
    this.lockingBps = this.keyedBlob.getNumber('lockingBps');
    this.stakingApr = this.keyedBlob.getNumber('stakingApr');
    this.lockingApr = this.keyedBlob.getProperty<CitadelRewardsAprBlob>('lockingApr');
    this.tokensPaid = this.keyedBlob.getProperty<CitadelRewardsTokenPaidMap>('tokensPaid');
  }

  id(): string {
    return CTIADEL_DATA;
  }

  toBlob(): DataBlob {
    const map = new Map();
    map.set('valuePaid', this.valuePaid);
    map.set('marketCap', this.marketCap);
    map.set('supply', this.supply);
    map.set('staked', this.staked);
    map.set('stakedPercent', this.stakedPercent);
    map.set('marketCapToTreasuryRatio', this.marketCapToTreasuryRatio);
    map.set('fundingBps', this.fundingBps);
    map.set('stakingBps', this.stakingBps);
    map.set('lockingBps', this.lockingBps);
    map.set('stakingApr', this.stakingApr);
    map.set('lockingApr', this.lockingApr);
    map.set('tokensPaid', this.tokensPaid);
    return map;
  }
}
