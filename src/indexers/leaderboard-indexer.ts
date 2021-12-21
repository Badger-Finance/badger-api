import { BadgerType, BadgerTypeMap } from '@badger-dao/sdk';
import { ethers } from 'ethers';
import { getBoostFile } from '../accounts/accounts.utils';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { LeaderBoardType } from '../leaderboards/enums/leaderboard-type.enum';
import { CachedBoost } from '../leaderboards/interface/cached-boost.interface';
import { CachedLeaderboardSummary } from '../leaderboards/interface/cached-leaderboard-summary.interface';
import { getBadgerType } from '../leaderboards/leaderboards.config';

export const indexBoostLeaderBoard = async (): Promise<void> => {
  const chains = loadChains();
  const boosts: CachedBoost[] = await generateBoostsLeaderBoard(chains);
  const mapper = getDataMapper();
  for await (const _item of mapper.batchPut(boosts)) {
  }
};

export async function generateBoostsLeaderBoard(chains: Chain[]): Promise<CachedBoost[]> {
  const results = await Promise.all(
    chains.map(async (chain) => {
      const chainResults = await generateChainBoostsLeaderBoard(chain);
      const summary: BadgerTypeMap = {
        [BadgerType.Basic]: 0,
        [BadgerType.Neo]: 0,
        [BadgerType.Hero]: 0,
        [BadgerType.Hyper]: 0,
        [BadgerType.Frenzy]: 0,
      };
      const mapper = getDataMapper();
      chainResults.forEach((result) => summary[getBadgerType(result.boost)]++);
      const rankSummaries = Object.entries(summary).map((e) => ({
        badgerType: e[0],
        amount: e[1],
      }));
      await mapper.put(
        Object.assign(new CachedLeaderboardSummary(), {
          leaderboard: getLeaderboardKey(chain),
          rankSummaries,
        }),
      );
      return chainResults;
    }),
  );
  return results.flatMap((item) => item);
}

async function generateChainBoostsLeaderBoard(chain: Chain): Promise<CachedBoost[]> {
  try {
    const boostFile = await getBoostFile(chain);
    if (!boostFile) {
      return [];
    }
    return Object.entries(boostFile.userData)
      .sort((a, b) => {
        const [_a, aData] = a;
        const [_b, bData] = b;
        if (aData.boost === bData.boost) {
          const aRatioBalance = aData.stakeRatio * aData.nativeBalance;
          const bRatioBalance = bData.stakeRatio * bData.nativeBalance;
          return bRatioBalance - aRatioBalance;
        }
        return bData.boost - aData.boost;
      })
      .map((entry, i) => {
        const [address, userBoost] = entry;
        const { boost, stakeRatio, nftMultiplier, nativeBalance, nonNativeBalance } = userBoost;
        return Object.assign(new CachedBoost(), {
          leaderboard: getLeaderboardKey(chain),
          rank: i + 1,
          address: ethers.utils.getAddress(address),
          boost,
          stakeRatio,
          nftMultiplier,
          nativeBalance: nativeBalance || 0,
          nonNativeBalance: nonNativeBalance || 0,
        });
      });
  } catch (err) {
    console.log(err);
    return [];
  }
}

export function getLeaderboardKey(chain: Chain): string {
  return `${chain.network}_${LeaderBoardType.BadgerBoost}`;
}
