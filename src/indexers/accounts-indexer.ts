import { Network } from '@badger-dao/sdk';

import { getAccounts, getLatestMetadata } from '../accounts/accounts.utils';
import { getChainStartBlockKey, getDataMapper } from '../aws/dynamodb.utils';
import { ClaimableBalance } from '../aws/models/claimable-balance.model';
import { UserClaimMetadata } from '../aws/models/user-claim-metadata.model';
import { UserClaimSnapshot } from '../aws/models/user-claim-snapshot.model';
import { getTreeDistribution } from '../aws/s3.utils';
import { getSupportedChains } from '../chains/chains.utils';
import { Chain } from '../chains/config/chain.config';
import { getClaimableRewards } from '../rewards/rewards.utils';

export async function refreshClaimableBalances(chain: Chain) {
  const mapper = getDataMapper();
  const distribution = await getTreeDistribution(chain);
  const sdk = await chain.getSdk();

  if (!distribution || !sdk.rewards.hasBadgerTree()) {
    return;
  }

  const latestMetadata = await getLatestMetadata(chain);
  const { endBlock } = latestMetadata;
  const snapshotStartBlock = endBlock + 1;
  const snapshotEndBlock = await chain.provider.getBlockNumber();

  if (snapshotEndBlock <= snapshotStartBlock) {
    throw new Error(`${chain} invalid snapshot period (${snapshotStartBlock} - ${snapshotEndBlock})`);
  }

  const chainUsers = await getAccounts(chain);
  const results = await getClaimableRewards(chain, chainUsers, distribution, endBlock);

  let pageId = 0;
  const userClaimSnapshots = [];
  for (const res of results) {
    const [user, result] = res;
    const [tokens, amounts] = result;
    const claimableBalances = tokens.map((token, i) => {
      const amount = amounts[i];
      return Object.assign(new ClaimableBalance(), {
        address: token,
        balance: amount.toString(),
      });
    });
    const snapshot = Object.assign(new UserClaimSnapshot(), {
      chainStartBlock: getChainStartBlockKey(chain.network, snapshotStartBlock),
      chain: chain.network,
      startBlock: snapshotStartBlock,
      address: user,
      claimableBalances,
      pageId: pageId++,
    });
    userClaimSnapshots.push(snapshot);
  }

  for await (const _item of mapper.batchPut(userClaimSnapshots)) {
  }

  const metadataModel: UserClaimMetadata = {
    chainStartBlock: getChainStartBlockKey(chain.network, snapshotStartBlock),
    chain: chain.network,
    startBlock: snapshotStartBlock,
    endBlock: snapshotEndBlock,
    cycle: distribution.cycle,
    count: userClaimSnapshots.length,
  };
  // Create new metadata entry after user claim snapshots are calculated
  const metadata = Object.assign(new UserClaimMetadata(), metadataModel);

  await mapper.put(metadata);
}

export async function refreshUserAccounts() {
  const chains = getSupportedChains().filter((c) => c.network !== Network.BinanceSmartChain);
  await Promise.all(
    chains.map(async (chain) => {
      try {
        await refreshClaimableBalances(chain);
      } catch (err) {
        console.log(`Failed to refresh claimable balances for ${chain.network}`);
        console.log(`Chain information: ${(chain.network, chain.chainId)}`);
        console.error(err);
      }
    }),
  );

  return 'done';
}
