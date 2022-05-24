import { TreasurySummarySnapshot } from '../../aws/models/treasury-summary-snapshot.model';
import { CITADEL_TREASURY_ADDRESS } from '../config/citadel-treasury.config';

export const queryTreasurySummaryUtilMock: TreasurySummarySnapshot = {
  address: CITADEL_TREASURY_ADDRESS,
  value: 150000,
  yield: 150,
  positions: [
    {
      symbol: 'BADGER',
      protocol: 'none',
      apr: 0,
      address: '0x3472A5A71965499acd81997a54BBA8D852C6E53d',
      balance: 4,
      decimals: 18,
      name: 'Badger',
      value: 23.48,
    },
    {
      symbol: 'WBTC',
      protocol: 'none',
      apr: 0,
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      balance: 0.002,
      decimals: 8,
      name: 'Wrapped BTC',
      value: 60.212,
    },
    {
      symbol: 'WETH',
      protocol: 'none',
      apr: 0,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      balance: 0.025,
      decimals: 18,
      name: 'Wrapped Ether',
      value: 50.6445,
    },
  ],
};
