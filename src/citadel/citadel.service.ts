import { CitadelTreasurySummary } from '@badger-dao/sdk/lib/api/interfaces/citadel-treasury-summary.interface';
import { Service } from '@tsed/di';
import { TOKENS } from '../config/tokens.config';
import { getPrice } from '../prices/prices.utils';
import { queryTreasurySummary } from '../treasury/treasury.utils';
import { CITADEL_TREASURY_ADDRESS } from './config/citadel-treasury.config';

@Service()
export class CitadelService {
  async loadTreasurySummary(): Promise<CitadelTreasurySummary> {
    const baseTreasurySummary = await queryTreasurySummary(CITADEL_TREASURY_ADDRESS);

    const { price } = await getPrice(TOKENS.WBTC);

    const valueBtc = baseTreasurySummary.value / price;
    const valuePaid = 0;
    const valuePaidBtc = valuePaid / price;

    const marketCapToTreasuryRatio = 0;

    return {
      ...baseTreasurySummary,
      valueBtc,
      valuePaid,
      valuePaidBtc,
      marketCapToTreasuryRatio,
    };
  }
}
