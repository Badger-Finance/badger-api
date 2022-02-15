import { NotFound } from '@tsed/exceptions';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { IS_OFFLINE } from '../config/constants';
import { GraphErrorResponse } from '../graphql/interafeces/graph-error-response.interface';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { getIndexedBlock, settToSnapshot } from './indexer.utils';
import { Network } from '@badger-dao/sdk';

const NO_HISTORIC = 'Queries more than';

/**
 * Index a sett's historic data via the graph + web3.
 * This is an expensive process to do so locally always and
 * as such will be disabled while running offline.
 */
export async function indexProtocolVaults() {
  if (IS_OFFLINE) {
    return;
  }
  const chains = loadChains();
  await Promise.all(chains.map((chain) => indexChainVaults(chain)));
}

async function indexChainVaults(chain: Chain) {
  await Promise.all(chain.vaults.map((vault) => indexVault(chain, vault)));
}

async function indexVault(chain: Chain, vaultDefinition: VaultDefinition) {
  const { vaultToken, createdBlock } = vaultDefinition;
  const thirtyMinutesBlocks = parseInt((chain.blocksPerYear / 365 / 24 / 2).toString());

  if (!vaultDefinition) {
    throw new NotFound(`${vaultToken} is not a valid sett token`);
  }

  const mapper = getDataMapper();
  let block = await getIndexedBlock(vaultDefinition, createdBlock, thirtyMinutesBlocks);
  while (true) {
    try {
      block += thirtyMinutesBlocks;
      const snapshot = await settToSnapshot(chain, vaultDefinition, block);

      if (snapshot == null) {
        block += thirtyMinutesBlocks;
        continue;
      }

      await mapper.put(snapshot);
    } catch (err) {
      try {
        const { body } = err as GraphErrorResponse;
        if (body.error.message.includes(NO_HISTORIC)) {
          // back index block to allow for loop addition
          block = (await getCurrentBlock(chain)) - thirtyMinutesBlocks;
          console.log(`Fast forwarding ${chain.name} skipping to current block ${block}`);
          continue;
        }
      } catch {}
      // request block is not indexed
      break;
    }
  }
}

export async function getCurrentBlock(chain: Chain): Promise<number> {
  const queryChain = chain.network === Network.Arbitrum ? Chain.getChain(Network.Ethereum) : chain;
  return queryChain.provider.getBlockNumber();
}
