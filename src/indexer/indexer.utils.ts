import { BigNumber } from '@ethersproject/bignumber';
import { NotFound } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { settAbi } from '../config/abi/abi';
import { yearnAffiliateVaultWrapperAbi } from '../config/abi/yearn-affiliate-vault-wrapper.abi';
import { Protocol } from '../config/enums/protocol.enum';
import { toFloat } from '../config/util';
import { getPrice } from '../prices/prices.utils';
import { CachedValueSource } from '../protocols/interfaces/cached-value-source.interface';
import { ValueSource } from '../protocols/interfaces/value-source.interface';
import { CachedSettSnapshot } from '../setts/interfaces/cached-sett-snapshot.interface';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { SettSnapshot } from '../setts/interfaces/sett-snapshot.interface';
import { getSett } from '../setts/setts.utils';
import { CachedLiquidityPoolTokenBalance } from '../tokens/interfaces/cached-liquidity-pool-token-balance.interface';
import { CachedTokenBalance } from '../tokens/interfaces/cached-token-balance.interface';
import { getToken } from '../tokens/tokens.utils';

export const settToCachedSnapshot = async (
  chain: Chain,
  settDefinition: SettDefinition,
): Promise<CachedSettSnapshot> => {
  const settToken = getToken(settDefinition.settToken);
  const depositToken = getToken(settDefinition.depositToken);
  const { sett } = await getSett(chain.graphUrl, settToken.address);

  if (!sett) {
    // sett has not been indexed yet, or encountered a graph error
    throw new NotFound(`${settToken.name} sett not found`);
  }

  const { balance, totalSupply, pricePerFullShare } = sett;
  const tokenBalance = balance / Math.pow(10, depositToken.decimals);
  const supply = totalSupply / Math.pow(10, settToken.decimals);
  const ratio = await getPricePerShare(chain, pricePerFullShare, settDefinition);
  const tokenPriceData = await getPrice(depositToken.address);
  const value = tokenBalance * tokenPriceData.usd;

  return Object.assign(new CachedSettSnapshot(), {
    address: settToken.address,
    balance: tokenBalance,
    ratio,
    settValue: parseFloat(value.toFixed(2)),
    supply,
  });
};

export const settToSnapshot = async (
  chain: Chain,
  settDefinition: SettDefinition,
  block: number,
): Promise<SettSnapshot | null> => {
  const sett = await getSett(chain.graphUrl, settDefinition.settToken, block);
  const settToken = getToken(settDefinition.settToken);
  const depositToken = getToken(settDefinition.depositToken);

  if (sett.sett == null) {
    return null;
  }

  const { balance, totalSupply, pricePerFullShare } = sett.sett;
  const blockData = await chain.provider.getBlock(block);
  const timestamp = blockData.timestamp * 1000;
  const tokenBalance = balance / Math.pow(10, depositToken.decimals);
  const supply = totalSupply / Math.pow(10, settToken.decimals);
  const ratio = await getPricePerShare(chain, pricePerFullShare, settDefinition, block);
  const tokenPriceData = await getPrice(depositToken.address);
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

const getPricePerShare = async (
  chain: Chain,
  pricePerShare: BigNumber,
  sett: SettDefinition,
  block?: number,
): Promise<number> => {
  const token = getToken(sett.settToken);
  try {
    let ppfs: BigNumber;
    if (sett.affiliate && sett.affiliate.protocol === Protocol.Yearn) {
      const contract = new ethers.Contract(sett.settToken, yearnAffiliateVaultWrapperAbi, chain.provider);
      if (block) {
        ppfs = await contract.pricePerShare({ blockTag: block });
      } else {
        ppfs = await contract.pricePerShare();
      }
    } else {
      const contract = new ethers.Contract(sett.settToken, settAbi, chain.provider);
      if (block) {
        ppfs = await contract.getPricePerFulLShare({ blockTag: block });
      } else {
        ppfs = await contract.getPricePerFulLShare();
      }
    }
    return toFloat(ppfs, token.decimals);
  } catch (err) {
    return toFloat(pricePerShare, token.decimals);
  }
};

export const getIndexedBlock = async (sett: SettDefinition, startBlock: number): Promise<number> => {
  try {
    const mapper = getDataMapper();
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

export const valueSourceToCachedValueSource = (
  valueSource: ValueSource,
  settDefinition: SettDefinition,
  type: string,
): CachedValueSource => {
  return Object.assign(new CachedValueSource(), {
    addressValueSourceType: `${settDefinition.settToken}_${type}`,
    address: settDefinition.settToken,
    type,
    apr: valueSource.apr,
    name: valueSource.name,
    oneDay: valueSource.performance.oneDay,
    threeDay: valueSource.performance.threeDay,
    sevenDay: valueSource.performance.sevenDay,
    thirtyDay: valueSource.performance.thirtyDay,
    harvestable: Boolean(valueSource.harvestable),
    minApr: valueSource.minApr,
    maxApr: valueSource.maxApr,
    boostable: valueSource.boostable,
  });
};

export function tokenBalancesToCachedLiquidityPoolTokenBalance(
  pairId: string,
  protocol: Protocol,
  tokenBalances: CachedTokenBalance[],
): CachedLiquidityPoolTokenBalance {
  return Object.assign(new CachedLiquidityPoolTokenBalance(), {
    id: `${pairId}_${protocol}`,
    pairId,
    protocol,
    tokenBalances,
  });
}
