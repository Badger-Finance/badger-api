import { NotFound } from '@tsed/exceptions';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { Ethereum } from '../chains/config/eth.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { IS_OFFLINE } from '../config/constants';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { getIndexedBlock, settToSnapshot } from './indexer.utils';

const NO_HISTORIC = 'Queries more than 20 blocks behind `latest` are currently not supported';

/**
 * Index a sett's historic data via the graph + web3.
 * This is an expensive process to do so locally always and
 * as such will be disabled while running offline.
 */
export async function indexProtocolSetts() {
  if (IS_OFFLINE) {
    return;
  }
  const chains = loadChains();
  await Promise.all(chains.map((chain) => indexChainSetts(chain)));
}

async function indexChainSetts(chain: Chain) {
  await Promise.all(chain.setts.map((sett) => indexSett(chain, sett)));
}

async function indexSett(chain: Chain, sett: SettDefinition) {
  const { settToken, createdBlock } = sett;
  const thirtyMinutesBlocks = parseInt((chain.blocksPerYear / 365 / 24 / 2).toString());

  if (!sett) {
    throw new NotFound(`${settToken} is not a valid sett token`);
  }

  const mapper = getDataMapper();
  let block = await getIndexedBlock(sett, createdBlock, thirtyMinutesBlocks);
  while (true) {
    try {
      block += thirtyMinutesBlocks;
      const snapshot = await settToSnapshot(chain, sett, block);

      if (snapshot == null) {
        block += thirtyMinutesBlocks;
        continue;
      }

      await mapper.put(snapshot);
    } catch (err) {
      try {
        const response: GraphError = JSON.parse(err.body);
        if (response.error.message.includes(NO_HISTORIC)) {
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

interface GraphError {
  error: {
    code: number;
    message: string;
  };
}

async function getCurrentBlock(chain: Chain): Promise<number> {
  const queryChain = chain.network === ChainNetwork.Arbitrum ? new Ethereum() : chain;
  return queryChain.provider.getBlockNumber();
}
