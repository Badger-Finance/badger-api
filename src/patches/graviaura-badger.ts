import { formatBalance, Network, YieldType } from '@badger-dao/sdk';
import { BigNumber } from 'ethers';

import { getDataMapper, getVaultEntityId } from '../aws/dynamodb.utils';
import { VaultYieldEvent } from '../aws/models/vault-yield-event.model';
import { Ethereum } from '../chains/config/eth.config';
import { TOKENS } from '../config/tokens.config';

/**
 * Run Patch
 * npx ts-node -r dotenv/config src/patches/graviaura-badger.ts
 *
 * Target Patch
 * STAGE=staging | prod
 *
 * Requires DDB write access + MFA authentication to patch.
 */
async function seedBadgerIncentive() {
  /**
   * ON 8/15 AN INCORREC PROCESSING OF A BADGER REWARDS PROCESSOR OCCURED.
   * AS A RESULT, THE EVENTS INCLUDED IN TREE DISTRIBUTIONS DID NOT MAKE IT
   * TO THE GRAPH, OR ANY SOURCE OF ON CHAIN DATA CURRENTLY SUPPORTED BY
   * THE CURRENT YIELD SYSTEM.
   *
   * https://etherscan.io/tx/0x1e3e7c71012d36e936b768a37e9784125a00f205a22bd808f045968a506bb1ce#eventlog
   *
   * THIS TRANSACTION CONTAINS THE SINGLE BADGER TREE DISTRIBUTION WE ARE
   * ALLOCATING TO GRAVI_AURA VAULT AS A MISSED - AND NOT CAPTURED SOURCE.
   *
   * THIS CODE SHOULD BE REMOVED BY 08/29.
   *
   * 08/31: update, due to filtering this event may stay in place and should until
   * it is manually accounted for the yield event indexer. it will not impact any
   * apr shown in the app as it is now filtered out.
   */
  const chain = new Ethereum();
  const sdk = await chain.getSdk();
  const vault = await chain.vaults.getVault(TOKENS.GRAVI_AURA);

  const targetBlock = 15344809;
  const block = await sdk.provider.getBlock(targetBlock);
  const timestamp = block.timestamp * 1000;

  const baseId = getVaultEntityId(chain, vault);
  const event: VaultYieldEvent = {
    id: [baseId, TOKENS.BADGER, YieldType.TreeDistribution].join('-').replace(/ /g, '-').toLowerCase(),
    chain: Network.Ethereum,
    vault: vault.address,
    chainAddress: baseId,
    timestamp,
    block: targetBlock,
    token: TOKENS.BADGER,
    amount: formatBalance(BigNumber.from('1928771715566995688546')),
    value: 282542.53,
    earned: 7845.98,
    type: YieldType.TreeDistribution,
    apr: 72.2,
    grossApr: 72.2 * (1 / 0.9),
    balance: 99624.998,
    tx: '0x30bc2ab3a59f7923ea20f7b99331dbc974130dc8b7152bb897d393fc2c506214',
  };

  const mapper = getDataMapper();
  await mapper.put(Object.assign(new VaultYieldEvent(), event));
}

seedBadgerIncentive();
