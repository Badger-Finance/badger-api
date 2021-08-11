import { NotFound } from '@tsed/exceptions';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { IS_OFFLINE } from '../config/constants';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { SettSnapshot2 } from '../setts/interfaces/sett-snapshot2.interface';
import { getIndexedBlock, settToSnapshot } from './indexer.utils';

/**
 * Index a sett's historic data via the graph + web3.
 * This is an expensive process to do so locally always and
 * as such will be disabled while running offline.
 */
export const indexAsset = async (): Promise<void> => {
  if (IS_OFFLINE) {
    return;
  }
  const chains = loadChains();
  await Promise.all(
    chains.flatMap(async (chain) => Promise.all(chain.setts.map(async (sett) => indexSett(chain, sett)))),
  );
};

const indexSett = async (chain: Chain, sett: SettDefinition) => {
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

      // start new table migration
      const snapshot2 = Object.assign(new SettSnapshot2(), {
        ...snapshot,
      });
      await mapper.put(snapshot2);
    } catch (err) {
      // request block is not indexed
      break;
    }
  }
};
