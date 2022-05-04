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
import { CitadelRewardsTokenPaidMap } from './interfaces/citadel-rewards-token-paid-map.interface';

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
    if (lastRewardBlock) getOpts.startBlock = Number(lastRewardBlock) + 1;

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
  const summaryCountTemplate = {
    apr: 0,
    count: 0,
  };
  const summary = {
    overall: { ...summaryCountTemplate },
    [CitadelRewardType.Citadel]: { ...summaryCountTemplate },
    [CitadelRewardType.Funding]: { ...summaryCountTemplate },
    [CitadelRewardType.Tokens]: { ...summaryCountTemplate },
    [CitadelRewardType.Yield]: { ...summaryCountTemplate },
  };

  const mapper = getDataMapper();

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
    console.error(`Failed to get citadel rewards from ddb ${e}`);
  }

  return Object.keys(summary).reduce((acc, val) => {
    const assertKey = <keyof CitadelRewardsAprBlob>val;
    acc[assertKey] = summary[assertKey].apr / summary[assertKey].count || 0;

    if (!acc[assertKey]) acc[assertKey] = 0;
    return acc;
  }, <CitadelRewardsAprBlob>{});
}

export async function getTokensPaidSummary(): Promise<CitadelRewardsTokenPaidMap> {
  const tokensPaid: CitadelRewardsTokenPaidMap = {};

  const mapper = getDataMapper();

  const query = mapper.query(
    CitadelRewardsSnapshot,
    { payType: RewardEventTypeEnum.PAID },
    {
      indexName: 'IndexCitadelRewardsDataPayType',
    },
  );

  try {
    for await (const reward of query) {
      if (!tokensPaid[reward.token]) tokensPaid[reward.token] = reward.amount || 0;
      else tokensPaid[reward.token] += reward.amount;
    }
  } catch (e) {
    console.error(`Failed to get citadel rewards from ddb ${e}`);
  }

  return tokensPaid;
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
      [dataTypeRawKeyToKeccak('xcitadel-locker-emissions')]: CitadelRewardType.Citadel,
      [dataTypeRawKeyToKeccak('funding-revenue')]: CitadelRewardType.Funding,
      [dataTypeRawKeyToKeccak('treasury-yield')]: CitadelRewardType.Yield,
      [dataTypeRawKeyToKeccak('Tokens')]: CitadelRewardType.Tokens,
    }[hashKey] || CitadelRewardType.Tokens
  );
}
