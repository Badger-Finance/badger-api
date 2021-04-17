import { DataMapper } from '@aws/dynamodb-data-mapper';
import { NotFound } from '@tsed/exceptions';
import { dynamo } from '../aws/dynamodb-utils';
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

  let block = await getIndexedBlock(sett, createdBlock);
  while (true) {
    const snapshot = await settToSnapshot(chain, sett, block);

    if (snapshot == null) {
      block += thirtyMinutesBlocks;
      continue;
    }

    const mapper = new DataMapper({ client: dynamo });
    await mapper.put(snapshot);
    block += thirtyMinutesBlocks;
  }
};
