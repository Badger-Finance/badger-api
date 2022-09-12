import { YieldType } from '@badger-dao/sdk';

import { TEST_ADDR, TEST_TOKEN } from '../../test/constants';
import { YieldEventV2 } from '../interfaces/yield-event-v2.interface';

export const vaultsHarvestsMapMock: Record<string, YieldEventV2[]> = {
  [TEST_TOKEN]: [
    {
      timestamp: 1636878824,
      block: 13612910,
      amount: 0.004992355665779731,
      token: '0x075b1bb99792c9e1041ba13afef80c91a1e70fb3',
      eventType: YieldType.Harvest,
      strategyBalance: 2481.941296192305,
      estimatedApr: 30,
      tx: '0x3324231',
    },
    {
      timestamp: 1636878824,
      block: 13612910,
      token: '0x075b1bb99792c9e1041ba13afef80c91a1e70fb3',
      amount: 84.17266705379542,
      eventType: YieldType.TreeDistribution,
      strategyBalance: 2481.941296192305,
      estimatedApr: 5,
      tx: '0x3324232',
    },
  ],
  [TEST_ADDR]: [
    {
      timestamp: 1636848055,
      block: 13610723,
      amount: 0.019444617913515275,
      token: '0x64eda51d3ad40d56b9dfc5554e06f94e1dd786fd',
      eventType: YieldType.Harvest,
      strategyBalance: 675.7270352627328,
      estimatedApr: 0,
      tx: '0x3324233',
    },
    {
      timestamp: 1636848055,
      block: 13610723,
      token: '0x64eda51d3ad40d56b9dfc5554e06f94e1dd786fd',
      amount: 519.4928843851667,
      eventType: YieldType.TreeDistribution,
      strategyBalance: 675.7270352627328,
      estimatedApr: 0,
      tx: '0x3324234',
    },
    {
      timestamp: 1636848055,
      block: 13610723,
      token: '0x64eda51d3ad40d56b9dfc5554e06f94e1dd786fd',
      amount: 127.77060811430661,
      eventType: YieldType.TreeDistribution,
      strategyBalance: 675.7270352627328,
      estimatedApr: 0,
      tx: '0x3324235',
    },
    {
      timestamp: 1637345136,
      block: 13647052,
      amount: 0.19661862226091095,
      token: '0x64eda51d3ad40d56b9dfc5554e06f94e1dd786fd',
      eventType: YieldType.Harvest,
      strategyBalance: 671.2872269577839,
      estimatedApr: 0,
      tx: '0x3324236',
    },
  ],
};
