import { RewardEventTypeEnum } from '@badger-dao/sdk/lib/citadel/enums/reward-event-type.enum';

import { CitadelRewardsSnapshot } from '../../aws/models/citadel-rewards-snapshot';

export const TEST_WBTC_TOKEN = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';
export const TEST_IBBTC_TOKEN = '0xaE96fF08771a109dc6650a1BdCa62F2d558E40af';
export const TEST_XCTDL_TOKEN = '0xa0FFfb6b575045f215432b3158Ffd0A9ee0454B9';

export const REWARD_ACCOUNT_1 = '0xA967Ba66Fb284EC18bbe59f65bcf42dD11BA8128';
export const REWARD_ACCOUNT_2 = '0x594691aEa75080dd9B3e91e648Db6045d4fF6E22';

export const fundingDataTypeKeccak256 = '0xf77bf06a76db4cf3e47e00a798e7dfb217e3fd61b63ce0ec4c447f3648d86404';
export const xcitadelLockerEmissions = '0xaf388c3c3157dbb1999fecd2348a129dd286852ceddb9352feabbffbac7ca99b';

export const RewardsSnapshotModelMock: CitadelRewardsSnapshot[] = [
  {
    block: 14660829,
    startTime: 1650985780,
    dataType: fundingDataTypeKeccak256,
    apr: 0,
    payType: RewardEventTypeEnum.ADDED,
    token: TEST_XCTDL_TOKEN,
    finishTime: 1652967937,
    account: REWARD_ACCOUNT_1,
    amount: 1,
    epoch: 0,
    createdAt: 1651684033489,
  },
  {
    block: 14660858,
    startTime: 1650985781,
    dataType: fundingDataTypeKeccak256,
    apr: 13.384588453794827,
    payType: RewardEventTypeEnum.ADDED,
    token: TEST_WBTC_TOKEN,
    finishTime: 1652800517,
    account: REWARD_ACCOUNT_1,
    amount: 0.0005,
    epoch: 0,
    createdAt: 1651684034712,
  },
  {
    block: 14660904,
    startTime: 1650985782,
    dataType: xcitadelLockerEmissions,
    apr: 26.846514375661595,
    payType: RewardEventTypeEnum.ADDED,
    token: TEST_IBBTC_TOKEN,
    finishTime: 1652801111,
    account: REWARD_ACCOUNT_1,
    amount: 0.001,
    epoch: 0,
    createdAt: 1651684036052,
  },
  {
    block: 14672580,
    startTime: 1650985783,
    dataType: xcitadelLockerEmissions,
    apr: 0,
    payType: RewardEventTypeEnum.ADDED,
    token: TEST_XCTDL_TOKEN,
    finishTime: 1652967937,
    account: REWARD_ACCOUNT_2,
    amount: 437.7130677910053,
    epoch: 1,
    createdAt: 1651684039661,
  },
  {
    block: 14673197,
    startTime: 1550985780,
    dataType: xcitadelLockerEmissions,
    apr: 0,
    payType: RewardEventTypeEnum.ADDED,
    token: TEST_XCTDL_TOKEN,
    finishTime: 1652967937,
    account: REWARD_ACCOUNT_2,
    amount: 418.76670615027456,
    epoch: 1,
    createdAt: 1651684039703,
  },
  {
    block: 14712958,
    startTime: 1651694922,
    dataType: xcitadelLockerEmissions,
    apr: 3152518.035884199,
    payType: RewardEventTypeEnum.PAID,
    token: TEST_XCTDL_TOKEN,
    finishTime: 1653509322,
    account: REWARD_ACCOUNT_2,
    amount: 17990.117812393517,
    epoch: 1,
    createdAt: 1651698431110,
  },
  {
    block: 14718297,
    startTime: 1651768621,
    dataType: xcitadelLockerEmissions,
    apr: 191500.36767402402,
    payType: RewardEventTypeEnum.PAID,
    token: TEST_XCTDL_TOKEN,
    finishTime: 1653583021,
    account: REWARD_ACCOUNT_2,
    amount: 1253.145524370807,
    epoch: 1,
    createdAt: 1651770431448,
  },
];
