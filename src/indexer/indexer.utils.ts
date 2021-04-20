import { DataMapper } from '@aws/dynamodb-data-mapper';
import { NotFound } from '@tsed/exceptions';
import { dynamo } from '../aws/dynamodb-utils';
import { Chain } from '../chains/config/chain.config';
import { CachedSettSnapshot } from '../setts/interfaces/cached-sett-snapshot.interface';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { SettSnapshot } from '../setts/interfaces/sett-snapshot.interface';
import { getSett } from '../setts/setts.utils';
import { getToken } from '../tokens/tokens-util';

export const settToCachedSnapshot = async (
  chain: Chain,
  settDefinition: SettDefinition,
): Promise<CachedSettSnapshot> => {
  const { settToken } = settDefinition;
  const targetToken = getToken(settToken);
  const { sett } = await getSett(chain.graphUrl, settToken);

  if (!sett) {
    // sett has not been indexed yet, or encountered a graph error
    throw new NotFound(`${targetToken.name} sett not found`);
  }

  const { balance, totalSupply, pricePerFullShare, token } = sett;
  const tokenBalance = balance / Math.pow(10, token.decimals);
  const supply = totalSupply / Math.pow(10, token.decimals);
  const ratio = pricePerFullShare / Math.pow(10, token.decimals);
  const tokenPriceData = await chain.strategy.getPrice(token.id);
  const value = tokenBalance * tokenPriceData.usd;

  return {
    address: settToken,
    balance: tokenBalance,
    ratio,
    settValue: parseFloat(value.toFixed(2)),
    supply,
    updatedAt: Date.now(),
  };
};

export const settToSnapshot = async (
  chain: Chain,
  settDefinition: SettDefinition,
  block: number,
): Promise<SettSnapshot | null> => {
  const sett = await getSett(chain.graphUrl, settDefinition.settToken, block);

  if (sett.sett == null) {
    return null;
  }

  const { balance, totalSupply, pricePerFullShare, token } = sett.sett;
  const blockData = await chain.provider.getBlock(block);
  const timestamp = blockData.timestamp * 1000;
  const tokenBalance = balance / Math.pow(10, token.decimals);
  const supply = totalSupply / Math.pow(10, token.decimals);
  const ratio = pricePerFullShare / Math.pow(10, token.decimals);
  const tokenPriceData = await chain.strategy.getPrice(token.id);
  const value = tokenBalance * tokenPriceData.usd;

  return Object.assign(new SettSnapshot(), {
    asset: settDefinition.symbol.toLowerCase(),
    height: block,
    timestamp,
    balance: tokenBalance,
    supply,
    ratio,
    value: parseFloat(value.toFixed(2)),
  });
};

export const getIndexedBlock = async (sett: SettDefinition, startBlock: number): Promise<number> => {
  try {
    const mapper = new DataMapper({ client: dynamo });
    for await (const snapshot of mapper.query(
      SettSnapshot,
      { asset: sett.symbol.toLowerCase() },
      { limit: 1, scanIndexForward: false },
    )) {
      return snapshot.height;
    }
    return startBlock;
  } catch (err) {
    return startBlock;
  }
};
