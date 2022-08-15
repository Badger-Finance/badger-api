"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshUserAccounts = exports.refreshClaimableBalances = void 0;
const sdk_1 = require("@badger-dao/sdk");
const accounts_utils_1 = require("../accounts/accounts.utils");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const user_claim_snapshot_model_1 = require("../aws/models/user-claim-snapshot.model");
const chain_1 = require("../chains/chain");
const constants_1 = require("../config/constants");
const claimable_balance_1 = require("../rewards/entities/claimable-balance");
const user_claim_metadata_1 = require("../rewards/entities/user-claim-metadata");
const rewards_utils_1 = require("../rewards/rewards.utils");
async function refreshClaimableBalances(chain) {
  const mapper = (0, dynamodb_utils_1.getDataMapper)();
  const distribution = await (0, rewards_utils_1.getTreeDistribution)(chain);
  const sdk = await chain.getSdk();
  if (!distribution || !sdk.rewards.hasBadgerTree()) {
    return;
  }
  const latestMetadata = await (0, accounts_utils_1.getLatestMetadata)(chain);
  if (constants_1.PRODUCTION) {
    console.log(
      `Updating Claimable Balances for ${chain.network} (prev. ${latestMetadata.startBlock} - ${latestMetadata.endBlock})`
    );
  }
  const { endBlock } = latestMetadata;
  const snapshotStartBlock = endBlock + 1;
  const snapshotEndBlock = await chain.provider.getBlockNumber();
  if (snapshotEndBlock <= snapshotStartBlock) {
    throw new Error(`${chain} invalid snapshot period (${snapshotStartBlock} - ${snapshotEndBlock})`);
  }
  const chainUsers = await (0, accounts_utils_1.getAccounts)(chain);
  const results = await (0, rewards_utils_1.getClaimableRewards)(chain, chainUsers, distribution, endBlock);
  let pageId = 0;
  const userClaimSnapshots = [];
  for (const res of results) {
    const [user, result] = res;
    const [tokens, amounts] = result;
    const claimableBalances = tokens.map((token, i) => {
      const amount = amounts[i];
      return Object.assign(new claimable_balance_1.ClaimableBalance(), {
        address: token,
        balance: amount.toString()
      });
    });
    const snapshot = Object.assign(new user_claim_snapshot_model_1.UserClaimSnapshot(), {
      chainStartBlock: (0, dynamodb_utils_1.getChainStartBlockKey)(chain, snapshotStartBlock),
      chain: chain.network,
      startBlock: snapshotStartBlock,
      address: user,
      claimableBalances,
      pageId: pageId++
    });
    userClaimSnapshots.push(snapshot);
  }
  if (constants_1.PRODUCTION) {
    console.log(`Updated ${userClaimSnapshots.length} claimable balances for ${chain.network}`);
  }
  for await (const _item of mapper.batchPut(userClaimSnapshots)) {
  }
  // Create new metadata entry after user claim snapshots are calculated
  const metadata = Object.assign(new user_claim_metadata_1.UserClaimMetadata(), {
    chainStartBlock: (0, dynamodb_utils_1.getChainStartBlockKey)(chain, snapshotStartBlock),
    chain: chain.network,
    startBlock: snapshotStartBlock,
    endBlock: snapshotEndBlock,
    cycle: distribution.cycle,
    count: userClaimSnapshots.length
  });
  await mapper.put(metadata);
  if (constants_1.PRODUCTION) {
    console.log(`Completed balance snapshot for ${chain.network} up to ${snapshotEndBlock}`);
  }
}
exports.refreshClaimableBalances = refreshClaimableBalances;
async function refreshUserAccounts() {
  const chains = chain_1.SUPPORTED_CHAINS.filter((c) => c.network !== sdk_1.Network.BinanceSmartChain);
  await Promise.all(
    chains.map(async (chain) => {
      try {
        await refreshClaimableBalances(chain);
      } catch (err) {
        console.log(`Failed to refresh claimable balances for ${chain.network}`);
        console.log(`Chain information: ${(chain.network, chain.chainId, chain.rpcUrl)}`);
        console.error(err);
      }
    })
  );
  return "done";
}
exports.refreshUserAccounts = refreshUserAccounts;
//# sourceMappingURL=accounts-indexer.js.map
