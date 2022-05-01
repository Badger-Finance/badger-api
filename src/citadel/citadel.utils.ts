import { getDataMapper } from '../aws/dynamodb.utils';
import { KeyedDataBlob } from '../aws/models/keyed-data-blob.model';
import { CitadelData, CTIADEL_DATA } from './destructors/citadel-data.destructor';
import { Nullable } from '../utils/types.utils';
import { CitadelRewardsSnapshot } from '../aws/models/citadel-rewards-snapshot';
import BadgerSDK from '@badger-dao/sdk';
import { RewardEventType } from '@badger-dao/sdk/lib/citadel/enums/reward-event-type.enum';
import { ListRewardsEvent } from '@badger-dao/sdk/lib/citadel/interfaces/list-rewards-event.interface';

export async function queryCitadelData(): Promise<CitadelData> {
  const mapper = getDataMapper();

  let blob;
  for await (const item of mapper.query(KeyedDataBlob, { id: CTIADEL_DATA }, { limit: 1 })) {
    blob = item;
  }
  if (!blob) {
    throw new Error('No stored citadel data!');
  }

  return new CitadelData(blob.data);
}

export async function getRewardsOnchain(
  sdk: BadgerSDK,
  type: RewardEventType,
  fromLastBlock = false,
): Promise<ListRewardsEvent[]> {
  let chainRewards: ListRewardsEvent[] = [];

  let lastRewardBlock: Nullable<number>;

  if (fromLastBlock) lastRewardBlock = (await getLastRewardByType(type))?.block;

  try {
    const getOpts: { filter: RewardEventType; startBlock?: number } = { filter: type };
    if (lastRewardBlock) getOpts.startBlock = lastRewardBlock;

    chainRewards = await sdk.citadel.listRewards(getOpts);
  } catch (err) {
    throw new Error(`Failed to get citadel listRewards ${err}`);
  }

  return chainRewards;
}

export async function getLastRewardByType(type: string): Promise<Nullable<CitadelRewardsSnapshot>> {
  const mapper = getDataMapper();

  const query = mapper.query(
    CitadelRewardsSnapshot,
    { payType: type },
    { limit: 1, scanIndexForward: false, indexName: 'IndexCitadelRewardsDataPayType' },
  );

  let lastReward = null;

  try {
    for await (const harvest of query) {
      lastReward = harvest;
    }
  } catch (e) {
    console.error(`Failed to get citadel reward from ddb for type: ${type}; ${e}`);
  }

  return lastReward;
}
