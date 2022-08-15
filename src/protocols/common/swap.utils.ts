import { formatBalance } from '@badger-dao/sdk';
import { NotFound, UnprocessableEntity } from '@tsed/exceptions';

import { Chain } from '../../chains/config/chain.config';
import { UniV2__factory } from '../../contracts';
import { TokenPrice } from '../../prices/interface/token-price.interface';
import { queryPrice } from '../../prices/prices.utils';
import { getFullToken } from '../../tokens/tokens.utils';

interface LiquidityData {
  contract: string;
  token0: string;
  token1: string;
  reserve0: number;
  reserve1: number;
  totalSupply: number;
}

export async function getLiquidityData(chain: Chain, contract: string): Promise<LiquidityData> {
  const sdk = await chain.getSdk();
  const pairContract = UniV2__factory.connect(contract, sdk.provider);
  const [totalPairSupply, token0, token1, reserves] = await Promise.all([
    pairContract.totalSupply(),
    pairContract.token0(),
    pairContract.token1(),
    pairContract.getReserves()
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
    totalSupply: totalSupply
  };
}

export const getOnChainLiquidityPrice = async (chain: Chain, contract: string): Promise<TokenPrice> => {
  try {
    const liquidityData = await getLiquidityData(chain, contract);
    if (liquidityData.totalSupply === 0) {
      const token = await getFullToken(chain, contract);

      return {
        address: token.address,
        price: 0
      };
    }
    return resolveLiquidityPrice(chain, liquidityData);
  } catch (err) {
    console.log(err);
    throw new NotFound(`No pair found for ${contract}`);
  }
};

const resolveLiquidityPrice = async (chain: Chain, liquidityData: LiquidityData): Promise<TokenPrice> => {
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
      price: t1Price.price * t1Scalar
    };
  }
  if (!t1Price) {
    const t0Scalar = reserve1 / reserve0;
    const t1Info = await getFullToken(chain, token1);

    t1Price = {
      address: t1Info.address,
      price: t0Price.price * t0Scalar
    };
  }
  const token = await getFullToken(chain, contract);

  const price = (t0Price.price * reserve0 + t1Price.price * reserve1) / totalSupply;
  return {
    address: token.address,
    price
  };
};

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
    price
  };
}
