import { BigNumber } from 'ethers';
import { getAccounts } from '../accounts/accounts.utils';
import { CachedAccount } from '../accounts/interfaces/cached-account.interface';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Ethereum } from '../chains/config/eth.config';
import { BADGER_TREE } from '../config/constants';
import { BadgerTree__factory } from '../contracts';
import { RewardAmounts } from '../rewards/interfaces/reward-amounts.interface';
import { getTreeDistribution } from '../rewards/rewards.utils';

export async function refreshAccounts(): Promise<void> {
  const eth = new Ethereum();
  const accounts = await getAccounts(eth);

  const badgerTree = BadgerTree__factory.connect(BADGER_TREE, eth.provider);
  const treeDistribution = await getTreeDistribution();
  const accountData: CachedAccount[] = [];

  const batchSize = 500;
  for (let i = 0; i < accounts.length; i += batchSize) {
    const batchAccounts = accounts.slice(i, i + batchSize);
    await Promise.all(
      batchAccounts.map(async (acc) => {
        const claim = treeDistribution.claims[acc];
        if (!claim) {
          return;
        }
        const [tokens, amounts]: [string[], BigNumber[]] = await badgerTree.getClaimableFor(
          acc,
          claim.tokens,
          claim.cumulativeAmounts,
        );
        const rewardAmounts: RewardAmounts = { tokens, amounts };
        const claimableBalances = rewardAmounts.tokens.map((token, i) => {
          const balance = rewardAmounts.amounts[i];
          return {
            address: token,
            balance: balance.toString(),
          };
        });
        accountData.push(
          Object.assign(new CachedAccount(), {
            address: acc,
            claimableBalances,
          }),
        );
      }),
    );
  }

  console.log(`Saving ${accountData.length} account snapshots`);
  const mapper = getDataMapper();
  for await (const _item of mapper.batchPut(accountData)) {
  }
}
