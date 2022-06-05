import { ethers } from 'ethers';
import { getDataMapper } from '../aws/dynamodb.utils';
import { KeyedDataBlob } from '../aws/models/keyed-data-blob.model';
import { CitadelData, CTIADEL_DATA } from './destructors/citadel-data.destructor';
import { Nullable } from '../utils/types.utils';
import { CitadelRewardsSnapshot } from '../aws/models/citadel-rewards-snapshot';
import BadgerSDK, { Network, Protocol, Token, VaultV15__factory } from '@badger-dao/sdk';
import { RewardEventType, RewardEventTypeEnum } from '@badger-dao/sdk/lib/citadel/enums/reward-event-type.enum';
import { ListRewardsEvent } from '@badger-dao/sdk/lib/citadel/interfaces/list-rewards-event.interface';
import { CitadelRewardType } from '@badger-dao/sdk/lib/api/enums/citadel-reward-type.enum';
import { CitadelRewardsAprBlob } from './interfaces/citadel-rewards-apr-blob.interface';
import { CitadelRewardsTokenPaidMap } from './interfaces/citadel-rewards-token-paid-map.interface';
import { Chain } from '../chains/config/chain.config';
import { TokenPrice } from '../prices/interface/token-price.interface';
import { getPrice } from '../prices/prices.utils';
import { TOKENS } from '../config/tokens.config';
import { VaultState } from '@badger-dao/sdk';
import { VaultVersion } from '@badger-dao/sdk';
import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../graphql/generated/citadel';
import {
  getSdk as setKnightsRoundStatsSdk,
  VoteFragment,
  Vote_OrderBy,
} from '../graphql/generated/citadel.knights.round';
import { formatBalance } from '@badger-dao/sdk';
import {
  CITADEL_KNIGHTS,
  CITADEL_KNIGHTS_ROUND_SUBGRAPH_URL,
  CITADEL_START_PRICE_USD,
  CITADEL_SUBGRAPH_URL,
} from './citadel.constants';
import { CitadelKnightsRoundStat } from './interfaces/citadel-knights-round-stat.interface';
import { getFullToken } from '../tokens/tokens.utils';
import * as citadelUtils from './citadel.utils';
import { OrderDirection } from '@badger-dao/sdk/lib/graphql/generated/badger';

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

  if (fromLastBlock) lastRewardBlock = (await citadelUtils.getLastRewardByType(type))?.block;

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
        object: Date.now() / 1000,
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
    hashedKey = ethers.utils.solidityKeccak256(['string'], [key]);
  } catch (e) {
    console.warn(`Failed to hash raw key: ${key}. ${e}`);
    hashedKey = '';
  }

  return hashedKey;
}

export function getRewardsEventTypeMapped(hashKey: string): CitadelRewardType {
  return (
    {
      [dataTypeRawKeyToKeccak('xcitadel-locker-emissions')]: CitadelRewardType.Citadel,
      [dataTypeRawKeyToKeccak('funding-revenue')]: CitadelRewardType.Funding,
      [dataTypeRawKeyToKeccak('treasury-yield')]: CitadelRewardType.Yield,
      [dataTypeRawKeyToKeccak('Tokens')]: CitadelRewardType.Tokens,
    }[hashKey] ?? CitadelRewardType.Tokens
  );
}

export async function getStakedCitadelPrice(chain: Chain, { address }: Token): Promise<TokenPrice> {
  const sdk = await chain.getSdk();
  // xCitadel is not a vault, but has the interface - let's use it!
  const { pricePerFullShare } = await sdk.vaults.loadVault({
    address,
    requireRegistry: false,
    state: VaultState.Open,
    version: VaultVersion.v1_5,
    update: true,
  });
  const { price } = await getPrice(TOKENS.CTDL);
  return {
    address,
    price: price * pricePerFullShare,
  };
}

export async function getStakedCitadelEarnings(address: string): Promise<number> {
  const client = new GraphQLClient(CITADEL_SUBGRAPH_URL);
  const graphSdk = getSdk(client);
  const id = `${address.toLowerCase()}-${TOKENS.XCTDL.toLowerCase()}`;
  const { vaultBalance } = await graphSdk.VaultBalance({ id });
  if (!vaultBalance) {
    return 0;
  }
  const sdk = await Chain.getChain(Network.Ethereum).getSdk();
  // xCitadel is not a vault, but has the interface - let's use it!
  const xCitadel = VaultV15__factory.connect(TOKENS.XCTDL, sdk.provider);
  const pricePerFullShare = formatBalance(await xCitadel.getPricePerFullShare());
  const { netShareDeposit, grossDeposit, grossWithdraw } = vaultBalance;
  const currentTokens = formatBalance(netShareDeposit);
  const depositedTokens = formatBalance(grossDeposit);
  const withdrawnTokens = formatBalance(grossWithdraw);
  const balanceTokens = currentTokens * pricePerFullShare;
  return balanceTokens - depositedTokens + withdrawnTokens;
}

export async function getCitadelKnightingRoundsStats(): Promise<CitadelKnightsRoundStat[]> {
  const client = new GraphQLClient(CITADEL_KNIGHTS_ROUND_SUBGRAPH_URL);
  const graphSdk = setKnightsRoundStatsSdk(client);

  let totalVotes: VoteFragment[] = [];

  let voteId;
  while (true) {
    const voteData = await graphSdk.Votes({
      first: 2,
      orderBy: Vote_OrderBy.Id,
      orderDirection: OrderDirection.Asc,
      where: {
        id_gt: voteId,
      },
    });
    const { votes } = voteData;
    if (votes.length === 0) {
      break;
    }
    totalVotes = totalVotes.concat(votes);
  }

  const ctdlToken = await getFullToken(Chain.getChain(Network.Ethereum), TOKENS.CTDL);
  const recordedVotes: Record<string, Record<string, number>> = {};

  totalVotes.forEach((v) => {
    const { knight, amount, voter } = v;
    if (!recordedVotes[knight.id]) {
      recordedVotes[knight.id] = {};
    }
    if (!recordedVotes[knight.id][voter.id]) {
      recordedVotes[knight.id][voter.id] = 0;
    }
    recordedVotes[knight.id][voter.id] += formatBalance(amount, ctdlToken.decimals);
  });

  const knightVoteWeights = Object.fromEntries(
    Object.entries(recordedVotes).map((e) => {
      const [knight, votes] = e;
      const voteWeight = Object.values(votes).reduce(
        (total, voteAmount) => (total += Math.pow(voteAmount, 1 / 1.3)),
        0,
      );
      const voteCount = Object.values(votes).reduce((total, voteAmount) => (total += voteAmount), 0);
      return [knight, { voteWeight, voteCount }];
    }),
  );

  const totalWeight = Object.values(knightVoteWeights)
    .map((i) => i.voteWeight)
    .reduce((total, weight) => (total += weight), 0);

  return Object.entries(knightVoteWeights).map((e) => {
    const [knight, { voteCount, voteWeight }] = e;
    return {
      knight: getKnightEnumByIx(Number(knight)),
      votes: voteCount,
      voteWeight: (voteWeight / totalWeight) * 100,
      votersCount: Object.keys(recordedVotes[knight]).length,
      funding: voteCount * CITADEL_START_PRICE_USD,
    };
  });
}

export function getKnightEnumByIx(ix: number): Protocol | string {
  return CITADEL_KNIGHTS[ix] || 'unknown';
}
