import { RewardFilter } from '@badger-dao/sdk/lib/citadel/enums/reward-filter.enum';
import { TOKENS } from '../../config/tokens.config';
import { CitadelRewardEvent } from '../interfaces/citadel-reward-event.interface';

const TEST_TOKEN = TOKENS.CTDL;
const TEST_USER = '0x19d97d8fa813ee2f51ad4b4e04ea08baf4dffc28';

export const citadelRewardEventsMock: CitadelRewardEvent[] = [
  {
    block: 10,
    user: TEST_USER,
    token: TEST_TOKEN,
    amount: 10.234,
    type: RewardFilter.ADDED,
  },
  {
    block: 11,
    user: TEST_USER,
    token: TEST_TOKEN,
    amount: 3,
    type: RewardFilter.ADDED,
  },
  {
    block: 12,
    user: TEST_USER,
    token: TEST_TOKEN,
    amount: 0,
    type: RewardFilter.ADDED,
  },
];
