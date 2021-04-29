import { NotFound } from '@tsed/exceptions';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { getIndexedBlock, settToSnapshot } from './indexer.utils';

export const indexAsset = async () => {
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
  let block = await getIndexedBlock(sett, createdBlock);
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
      // request block is not indexed
      break;
    }
  }
};
