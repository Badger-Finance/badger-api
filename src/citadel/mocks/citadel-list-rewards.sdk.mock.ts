import { ListRewardsEvent } from '@badger-dao/sdk/lib/citadel/interfaces/list-rewards-event.interface';
import { RewardFilter } from '@badger-dao/sdk/lib/citadel/enums/reward-filter.enum';
import { BigNumber } from 'ethers';

export const citadelListRewardsSdkMock: ListRewardsEvent[] = [
  {
    account: '0xA967Ba66Fb284EC18bbe59f65bcf42dD11BA8128',
    block: 50,
    dataTypeHash: '0x60b54c1986b43275418006baba637cb29964609f76738f9d0c47dbd9c076bf11',
    reward: BigNumber.from(64),
    timestamp: 1651088758542,
    token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    type: RewardFilter.ADDED,
  },
  {
    account: '0xA967Ba66Fb284EC18bbe59f65bcf42dD11BA8128',
    block: 50,
    dataTypeHash: '0x60b54c1986b43275418006baba637cb29964609f76738f9d0c47dbd9c076bf11',
    reward: BigNumber.from(8),
    timestamp: 1651088758542,
    token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    type: RewardFilter.ADDED,
  },
  {
    account: '0xA967Ba66Fb284EC18bbe59f65bcf42dD11BA8128',
    block: 51,
    dataTypeHash: '0x60b54c1986b43275418006baba637cb29964609f76738f9d0c47dbd9c076bf11',
    reward: BigNumber.from(33),
    timestamp: 1651088758542,
    token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    type: RewardFilter.ADDED,
  },
  {
    account: '0xA967Ba66Fb284EC18bbe59f65bcf42dD11BA8128',
    block: 52,
    dataTypeHash: '0x60b54c1986b43275418006baba637cb29964609f76738f9d0c47dbd9c076bf11',
    reward: BigNumber.from(123),
    timestamp: 1651088758542,
    token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    type: RewardFilter.ADDED,
  },
  {
    account: '0xA967Ba66Fb284EC18bbe59f65bcf42dD11BA8128',
    block: 52,
    dataTypeHash: '0x60b54c1986b43275418006baba637cb29964609f76738f9d0c47dbd9c076bf11',
    reward: BigNumber.from(14),
    timestamp: 1651088758542,
    token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    type: RewardFilter.ADDED,
  },
];
