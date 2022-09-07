import { formatBalance, UniV2__factory } from '@badger-dao/sdk';
import { NotFound, UnprocessableEntity } from '@tsed/exceptions';

import { getVaultEntityId } from '../../aws/dynamodb.utils';
import { CachedYieldSource } from '../../aws/models/cached-yield-source.interface';
import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { VaultTokenBalance } from '../../aws/models/vault-token-balance.model';
import { Chain } from '../../chains/config/chain.config';
import { UNISWAP_URL } from '../../config/constants';
import { TokenPrice } from '../../prices/interface/token-price.interface';
import { queryPrice } from '../../prices/prices.utils';
import { getFullToken, getFullTokens, toBalance } from '../../tokens/tokens.utils';
import { getCachedVault } from '../../vaults/vaults.utils';
import { UniV2PoolData } from '../interfaces/uni-v2-pool-data.interface';
import { getUniV2SwapValue } from './strategy.utils';

export class UniswapStrategy {
  static async getValueSources(vault: VaultDefinitionModel): Promise<CachedYieldSource[]> {
    return Promise.all([getUniV2SwapValue(UNISWAP_URL, vault)]);
  }
}

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
    let [t0Price, t1Price] = await Promise.all([queryPrice(token0), queryPrice(token1)]);
    if (!t0Price && !t1Price) {
      throw new UnprocessableEntity(`Token pair ${contract} cannot be priced`);
    }
    if (!t0Price) {
      const t1Scalar = reserve0 / reserve1;
      const t0Info = await getFullToken(chain, token0);

      t0Price = {
        address: t0Info.address,
        price: t1Price.price * t1Scalar,
      };
    }
    if (!t1Price) {
      const t0Scalar = reserve1 / reserve0;
      const t1Info = await getFullToken(chain, token1);

      t1Price = {
        address: t1Info.address,
        price: t0Price.price * t0Scalar,
      };
    }
    const token = await getFullToken(chain, contract);

    const price = (t0Price.price * reserve0 + t1Price.price * reserve1) / totalSupply;
    return {
      address: token.address,
      price,
    };
  } catch (err) {
    console.log(err);
    throw new NotFound(`No pair found for ${poolAddress}`);
  }
}

export async function resolveTokenPrice(chain: Chain, token: string, contract: string): Promise<TokenPrice> {
  const { token0, token1, reserve0, reserve1 } = await getLiquidityData(chain, contract);
  const sdk = await chain.getSdk();
  const pricingToken = await sdk.tokens.loadToken(token);
  const isToken0 = pricingToken.address === token0;
  const knownToken = isToken0 ? token1 : token0;
  const [divisor, dividend] = isToken0 ? [reserve1, reserve0] : [reserve0, reserve1];
  const knownTokenPrice = await queryPrice(knownToken);
  if (!knownTokenPrice) {
    throw new UnprocessableEntity(`Token ${pricingToken.name} cannot be priced`);
  }
  const scalar = divisor / dividend;
  const price = knownTokenPrice.price * scalar;
  return {
    address: pricingToken.address,
    price,
  };
}

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
