import { ethers } from 'ethers';
import { getDataMapper } from '../aws/dynamodb.utils';
import { KeyedDataBlob } from '../aws/models/keyed-data-blob.model';
import { CitadelData, CTIADEL_DATA } from './destructors/citadel-data.destructor';
import { Nullable } from '../utils/types.utils';
import { CitadelRewardsSnapshot } from '../aws/models/citadel-rewards-snapshot';
import BadgerSDK from '@badger-dao/sdk';
import { RewardEventType, RewardEventTypeEnum } from '@badger-dao/sdk/lib/citadel/enums/reward-event-type.enum';
import { ListRewardsEvent } from '@badger-dao/sdk/lib/citadel/interfaces/list-rewards-event.interface';
import { CitadelRewardType } from '@badger-dao/sdk/lib/api/enums/citadel-reward-type.enum';
import { CitadelRewardsAprBlob } from './interfaces/citadel-rewards-apr-blob.interface';

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

  if (fromLastBlock) lastRewardBlock = Number((await getLastRewardByType(type))?.block) + 1;

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
    { limit: 1, scanIndexForward: false, indexName: 'IndexCitadelRewardsDataPayTypeBlock' },
  );

  let lastReward = null;

  try {
    for await (const reward of query) {
      lastReward = reward;
    }
  } catch (e) {
    console.error(`Failed to get citadel reward from ddb for type: ${type}; ${e}`);
  }

  return lastReward;
}

export async function getRewardsAprForDataBlob(): Promise<CitadelRewardsAprBlob> {
  const mapper = getDataMapper();

  const summaryCountTpl = {
    apr: 0,
    count: 0,
  };
  const summary = {
    overall: { ...summaryCountTpl },
    [CitadelRewardType.Citadel]: { ...summaryCountTpl },
    [CitadelRewardType.Funding]: { ...summaryCountTpl },
    [CitadelRewardType.Tokens]: { ...summaryCountTpl },
    [CitadelRewardType.Yield]: { ...summaryCountTpl },
  };

  const query = mapper.query(
    CitadelRewardsSnapshot,
    { payType: RewardEventTypeEnum.ADDED },
    {
      indexName: 'IndexCitadelRewardsDataPayType',
      filter: {
        type: 'GreaterThanOrEqualTo',
        object: Date.now(),
        subject: 'finishTime',
      },
    },
  );

  try {
    for await (const reward of query) {
      summary.overall.apr += reward.apr || 0;
      summary.overall.count += 1;

      const rewardTypeKey = getRewardsEventTypeMapped(<string>reward.dataType);

      summary[rewardTypeKey].apr += reward.apr || 0;
      summary[rewardTypeKey].count += 1;
    }
  } catch (e) {
    console.error(`Failed to get citadel reward from ddb`);
  }

  return Object.keys(summary).reduce((acc, val) => {
    const assertKey = <keyof CitadelRewardsAprBlob>val;
    acc[assertKey] = summary[assertKey].apr / summary[assertKey].count;
    return acc;
  }, <CitadelRewardsAprBlob>{});
}

export function dataTypeRawKeyToKeccak(key: string): string {
  let hashedKey: string;

  try {
    hashedKey = ethers.utils.keccak256(ethers.utils.formatBytes32String(key));
  } catch (e) {
    console.warn(`Failed to hash raw key: ${key}. ${e}`);
    hashedKey = '';
  }

  return hashedKey;
}

export function getRewardsEventTypeMapped(hashKey: string): CitadelRewardType {
  return (
    {
      // Note! This is still not actual keys, need to figure out, what value
      // is hashed in the event
      [dataTypeRawKeyToKeccak('Citadel')]: CitadelRewardType.Citadel,
      [dataTypeRawKeyToKeccak('Funding')]: CitadelRewardType.Funding,
      [dataTypeRawKeyToKeccak('Yield')]: CitadelRewardType.Yield,
      [dataTypeRawKeyToKeccak('Tokens')]: CitadelRewardType.Tokens,
    }[hashKey] || CitadelRewardType.Tokens
  );
}
