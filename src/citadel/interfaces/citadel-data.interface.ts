import { ConvertableDataBlob } from '../../aws/types/convertable-data-blob';
import { DataBlob } from '../../aws/types/data-blob';

export const CTIADEL_DATA = 'citadel-protocol-overview';

export class CitadelData extends ConvertableDataBlob<CitadelData> {
  valuePaid: number;
  marketCap: number;
  supply: number;
  staked: number;
  stakedPercent: number;
  marketCapToTreasuryRatio: number;

  constructor(blob: DataBlob) {
    super(blob);
    this.valuePaid = this.keyedBlob.getNumber('valuePaid');
    this.marketCap = this.keyedBlob.getNumber('marketCap');
    this.supply = this.keyedBlob.getNumber('supply');
    this.staked = this.keyedBlob.getNumber('staked');
    this.stakedPercent = this.keyedBlob.getNumber('stakedPercent');
    this.marketCapToTreasuryRatio = this.keyedBlob.getNumber('marketCapToTreasuryRatio');
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
    return map;
  }
}
