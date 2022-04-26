import { ListRewardsEvent } from '@badger-dao/sdk/lib/citadel/interfaces/list-rewards-event.interface';

export interface CitadelRewardEvent extends Omit<ListRewardsEvent, 'reward'> {
  amount: number;
}
