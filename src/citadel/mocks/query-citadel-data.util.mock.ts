import { CitadelData } from '../destructors/citadel-data.destructor';

const citadelDataBlob = new Map();

citadelDataBlob.set('stakedPercent', 57.21943985085593);
citadelDataBlob.set('marketCap', 309486236.0874132);
citadelDataBlob.set('marketCapToTreasuryRatio', 1126133.0423130456);
citadelDataBlob.set('tokensPaid', {});
citadelDataBlob.set('valuePaid', 0);
citadelDataBlob.set('staked', 123433.75281462506);
citadelDataBlob.set('supply', 215719.96009810406);
citadelDataBlob.set('stakingBps', 3000);
citadelDataBlob.set('fundingBps', 4000);
citadelDataBlob.set('lockingBps', 3000);
citadelDataBlob.set('stakingApr', 2498.4764247727794);
citadelDataBlob.set('lockingApr', {
  '0': 0,
  '1': 0,
  '2': 0,
  '3': 1672009.2017791115,
  overall: 1672009.2017791115,
});

export const queryCitadelDataUtilMock: CitadelData = new CitadelData(citadelDataBlob);
