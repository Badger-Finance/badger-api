import { formatBalance, UniV2__factory } from '@badger-dao/sdk';
import { NotFound, UnprocessableEntity } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request';

import { getVaultEntityId } from '../../aws/dynamodb.utils';
import { CachedYieldSource } from '../../aws/models/cached-yield-source.interface';
import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { VaultTokenBalance } from '../../aws/models/vault-token-balance.model';
import { Chain } from '../../chains/config/chain.config';
import { UNISWAP_URL } from '../../config/constants';
import { getSdk as getUniswapSdk, OrderDirection, PairDayData_OrderBy } from '../../graphql/generated/uniswap';
import { TokenPrice } from '../../prices/interface/token-price.interface';
import { queryPrice } from '../../prices/prices.utils';
import { SourceType } from '../../rewards/enums/source-type.enum';
import { getFullToken, getFullTokens, toBalance } from '../../tokens/tokens.utils';
import { getCachedVault } from '../../vaults/vaults.utils';
import { createYieldSource } from '../../vaults/yields.utils';
import { UniV2PoolData } from '../interfaces/uni-v2-pool-data.interface';

export class UniswapStrategy {
  static async getValueSources(vault: VaultDefinitionModel): Promise<CachedYieldSource[]> {
    return Promise.all([getUniV2SwapValue(UNISWAP_URL, vault)]);
  }
}

/**
 * Get UniV2 on chain liquidity data.
 * @param chain chain pool is deployed
 * @param contract pool address
 * @returns liquidity data for requested pool
 */
async function getLiquidityData(chain: Chain, contract: string): Promise<UniV2PoolData> {
  const sdk = await chain.getSdk();
  const pairContract = UniV2__factory.connect(contract, sdk.provider);
  const [totalPairSupply, token0, token1, reserves] = await Promise.all([
    pairContract.totalSupply(),
    pairContract.token0(),
    pairContract.token1(),
    pairContract.getReserves(),
  ]);
  const totalSupply = formatBalance(totalPairSupply);
  const tokenData = await sdk.tokens.loadTokens([token0, token1]);
  const reserve0 = formatBalance(reserves._reserve0, tokenData[token0].decimals);
  const reserve1 = formatBalance(reserves._reserve1, tokenData[token1].decimals);
  return {
    contract: contract,
    token0: token0,
    token1: token1,
    reserve0: reserve0,
    reserve1: reserve1,
    totalSupply: totalSupply,
  };
}

/**
 * Resolves price of a UniV2 liquidity pool.
 * @param chain chain pool is deployed
 * @param poolAddress pool address
 * @returns price for the liquidity pool token
 */
export async function getOnChainLiquidityPrice(chain: Chain, poolAddress: string): Promise<TokenPrice> {
  try {
    const liquidityData = await getLiquidityData(chain, poolAddress);

    if (liquidityData.totalSupply === 0) {
      const token = await getFullToken(chain, poolAddress);
      return {
        address: token.address,
        price: 0,
      };
    }

    const { contract, token0, token1, reserve0, reserve1, totalSupply } = liquidityData;
    let [{ price: t0Price }, { price: t1Price }] = await Promise.all([queryPrice(token0), queryPrice(token1)]);

    if (t0Price === 0 && t1Price === 0) {
      throw new UnprocessableEntity(`Token pair ${contract} cannot be priced`);
    }

    if (t0Price === 0) {
      const t1Scalar = reserve0 / reserve1;
      t0Price = t1Price * t1Scalar;
    }
    if (t1Price === 0) {
      const t0Scalar = reserve1 / reserve0;
      t1Price = t0Price * t0Scalar;
    }

    const price = (t0Price * reserve0 + t1Price * reserve1) / totalSupply;
    return {
      address: ethers.utils.getAddress(poolAddress),
      price,
    };
  } catch (err) {
    console.error(err);
    throw new NotFound(`Unable to price pool, or not found for ${poolAddress}`);
  }
}

/**
 * Resolve the price of a token in a UniV2 liquidity pool using 50/50 invariant.
 * @param chain chain pool is deployed
 * @param token token requested for pricing
 * @param contract pool address
 * @returns token price requested, if a price exists for the paired token
 */
export async function resolveTokenPrice(chain: Chain, token: string, contract: string): Promise<TokenPrice> {
  const { token0, token1, reserve0, reserve1 } = await getLiquidityData(chain, contract);
  const sdk = await chain.getSdk();
  const pricingToken = await sdk.tokens.loadToken(token);
  const isToken0 = pricingToken.address === token0;
  const knownToken = isToken0 ? token1 : token0;
  const [divisor, dividend] = isToken0 ? [reserve1, reserve0] : [reserve0, reserve1];
  const { price: knownTokenPrice } = await queryPrice(knownToken);
  if (knownTokenPrice === 0) {
    throw new UnprocessableEntity(`Token ${pricingToken.name} cannot be priced`);
  }
  const scalar = divisor / dividend;
  const price = knownTokenPrice * scalar;
  return {
    address: pricingToken.address,
    price,
  };
}

/**
 * Retrieve underlying tokens in a given UniV2 vault position.
 * @param chain chain vault is deployed
 * @param vault requested vault
 * @returns underlying token balances represented by pool tokens held by the vault
 */
export async function getLpTokenBalances(chain: Chain, vault: VaultDefinitionModel): Promise<VaultTokenBalance> {
  const { depositToken, address } = vault;
  try {
    const liquidityData = await getLiquidityData(chain, depositToken);
    const { token0, token1, reserve0, reserve1, totalSupply } = liquidityData;
    const tokenData = await getFullTokens(chain, [token0, token1]);
    const t0Token = tokenData[token0];
    const t1Token = tokenData[token1];

    // poolData returns the full liquidity pool, valueScalar acts to calculate the portion within the sett
    const settSnapshot = await getCachedVault(chain, vault);
    const valueScalar = totalSupply > 0 ? settSnapshot.balance / totalSupply : 0;
    const t0TokenBalance = reserve0 * valueScalar;
    const t1TokenBalance = reserve1 * valueScalar;
    const tokenBalances = await Promise.all([toBalance(t0Token, t0TokenBalance), toBalance(t1Token, t1TokenBalance)]);

    const vaultBalance: VaultTokenBalance = {
      id: getVaultEntityId(chain, vault),
      chain: chain.network,
      vault: address,
      tokenBalances,
    };

    return Object.assign(new VaultTokenBalance(), vaultBalance);
  } catch (err) {
    throw new NotFound(`${vault.protocol} pool pair ${depositToken} does not exist`);
  }
}

// TODO: move univ2 graph queries to the sdk to allow for proper mocking and testing
export async function getUniV2SwapValue(graphUrl: string, vault: VaultDefinitionModel): Promise<CachedYieldSource> {
  const client = new GraphQLClient(graphUrl);
  const sdk = getUniswapSdk(client);

  const { pairDayDatas } = await sdk.UniPairDayDatas({
    first: 30,
    orderBy: PairDayData_OrderBy.Date,
    orderDirection: OrderDirection.Desc,
    where: {
      pairAddress: vault.depositToken.toLowerCase(),
    },
  });

  const name = `${vault.protocol} LP Fees`;
  if (!pairDayDatas || pairDayDatas.length === 0) {
    return createYieldSource(vault, SourceType.TradeFee, name, 0);
  }

  const [token0Price, token1Price] = await Promise.all([
    queryPrice(pairDayDatas[0].token0.id),
    queryPrice(pairDayDatas[0].token1.id),
  ]);

  let totalApr = 0;
  for (let i = 0; i < pairDayDatas.length; i++) {
    const token0Volume = Number(pairDayDatas[i].dailyVolumeToken0) * token0Price.price;
    const token1Volume = Number(pairDayDatas[i].dailyVolumeToken1) * token1Price.price;
    const poolReserve = Number(pairDayDatas[i].reserveUSD);
    const fees = (token0Volume + token1Volume) * 0.003;
    totalApr += (fees / poolReserve) * 365 * 100;
  }
  const averageApr = totalApr / pairDayDatas.length;
  return createYieldSource(vault, SourceType.TradeFee, name, averageApr);
}
