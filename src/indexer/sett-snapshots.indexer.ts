import { NotFound } from '@tsed/exceptions';
import { saveItem } from '../aws/dynamodb-utils';
import { loadChains } from '../chains/chain';
import { bscSetts } from '../chains/config/bsc.config';
import { Chain } from '../chains/config/chain.config';
import { ethSetts } from '../chains/config/eth.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { SETT_SNAPSHOTS_DATA } from '../config/constants';
import { SettSnapshot } from '../interface/SettSnapshot';
import { getSett } from '../setts/setts-util';

export type CachedSettSnapshot = Partial<SettSnapshot> & {
  address: string;
  updatedAt: number;
};

export async function refreshSettSnapshots() {
  loadChains();

  const settToSnapshot = (chainNetwork: ChainNetwork): ((settToken: string) => Promise<CachedSettSnapshot>) => {
    const chain = Chain.getChain(chainNetwork);
    return async (settToken: string) => {
      const { sett } = await getSett(chain.graphUrl, settToken);
      if (!sett) {
        throw new NotFound('Sett not found');
      }
      const { balance, totalSupply, pricePerFullShare, token } = sett;
      const tokenBalance = balance / Math.pow(10, token.decimals);
      const supply = totalSupply / Math.pow(10, token.decimals);
      const ratio = pricePerFullShare / Math.pow(10, 18);
      const tokenPriceData = await chain.strategy.getPrice(token.id);
      const value = tokenBalance * tokenPriceData.usd;

      return {
        balance,
        supply,
        ratio,
        address: settToken,
        updatedAt: Date.now(),
        value: parseFloat(value.toFixed(2)),
      };
    };
  };

  await Promise.all([
    ...bscSetts.map(async (settDefinition) => {
      const snapshotTranslateFn = settToSnapshot(ChainNetwork.BinanceSmartChain);
      await saveItem(SETT_SNAPSHOTS_DATA, await snapshotTranslateFn(settDefinition.settToken));
    }),
    ...ethSetts.map(async (settDefinition) => {
      const snapshotTranslateFn = settToSnapshot(ChainNetwork.Ethereum);
      await saveItem(SETT_SNAPSHOTS_DATA, await snapshotTranslateFn(settDefinition.settToken));
    }),
  ]);
}
