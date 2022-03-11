import { RewardSchedulesByVaults } from '../interfaces/reward-schedules-vault.interface';

export const firstVaultAddr = '0xd04c48A53c111300aD41190D63681ed3dAd998eC';

export const rewardSchedules: RewardSchedulesByVaults = {
  [firstVaultAddr]: [
    {
      beneficiary: '0xd04c48A53c111300aD41190D63681ed3dAd998eC',
      amount: 6368.46,
      token: '0x3472A5A71965499acd81997a54BBA8D852C6E53d',
      start: 1619110800,
      end: 1619715600,
      compPercent: 100,
    },
    {
      beneficiary: '0xd04c48A53c111300aD41190D63681ed3dAd998eC',
      amount: 3.294284938801646e64,
      token: '0x798D1bE841a82a273720CE31c822C61a67a601C3',
      start: 1617296400,
      end: 1617901200,
      compPercent: 100,
    },
  ],
  '0x6dEf55d2e18486B9dDfaA075bc4e4EE0B28c1545': [
    {
      beneficiary: '0x6dEf55d2e18486B9dDfaA075bc4e4EE0B28c1545',
      amount: 6368.46,
      token: '0x3472A5A71965499acd81997a54BBA8D852C6E53d',
      start: 1619110800,
      end: 1619715600,
      compPercent: 100,
    },
    {
      beneficiary: '0x6dEf55d2e18486B9dDfaA075bc4e4EE0B28c1545',
      amount: 3.294284938801646e64,
      token: '0x798D1bE841a82a273720CE31c822C61a67a601C3',
      start: 1617296400,
      end: 1617901200,
      compPercent: 100,
    },
  ],
};
