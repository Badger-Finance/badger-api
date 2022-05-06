import citadelTreasuryMock from '@badger-dao/sdk-mocks/generated/ethereum/api/loadCitadelTreasury.json';
import { TreasurySummary } from '../interfaces/treasury-summary.interface';

export const treasurySummaryMock: TreasurySummary = {
  address: citadelTreasuryMock.address,
  value: citadelTreasuryMock.value,
  yield: citadelTreasuryMock.yield,
  positions: citadelTreasuryMock.positions,
};
