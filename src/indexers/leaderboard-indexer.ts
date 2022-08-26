import { BadgerType, BadgerTypeMap } from '@badger-dao/sdk';
import { ethers } from 'ethers';

import { getBoostFile } from '../accounts/accounts.utils';
import { getDataMapper, getLeaderboardKey } from '../aws/dynamodb.utils';
import { CachedBoost } from '../aws/models/cached-boost.model';
import { CachedLeaderboardSummary } from '../aws/models/cached-leaderboard-summary.model';
import { getSupportedChains } from '../chains/chains.utils';
import { Chain } from '../chains/config/chain.config';
import { getBadgerType } from '../leaderboards/leaderboards.utils';

export async function indexBoostLeaderBoard() {
  for (const chain of getSupportedChains()) {
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

    const chainEntries = [];

    for await (const entry of mapper.query(CachedBoost, { leaderboard: getLeaderboardKey(chain.network) })) {
      chainEntries.push(entry);
    }

    for await (const _item of mapper.batchDelete(chainEntries)) {
    }

    for await (const _item of mapper.batchPut(chainResults)) {
    }

    await mapper.put(
      Object.assign(new CachedLeaderboardSummary(), {
        leaderboard: getLeaderboardKey(chain.network),
        rankSummaries,
      }),
    );
  }
  return 'done';
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
        const { boost, stakeRatio, nftBalance, bveCvxBalance, diggBalance, nativeBalance, nonNativeBalance } =
          userBoost;
        const cachedBoost: CachedBoost = {
          leaderboard: getLeaderboardKey(chain.network),
          boostRank: i + 1,
          address: ethers.utils.getAddress(address),
          boost,
          stakeRatio,
          nftBalance,
          bveCvxBalance,
          diggBalance,
          nativeBalance,
          nonNativeBalance,
          updatedAt: Date.now(),
        };
        return Object.assign(new CachedBoost(), cachedBoost);
      });
  } catch (err) {
    console.log(err);
    return [];
  }
}
