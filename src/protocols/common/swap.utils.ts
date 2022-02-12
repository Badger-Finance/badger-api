import { Network } from '@badger-dao/sdk';
import { NotFound, UnprocessableEntity } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import { Chain } from '../../chains/config/chain.config';
import { UNISWAP_URL } from '../../config/constants';
import { UniV2__factory } from '../../contracts';
import { getSdk as getUniswapSdk } from '../../graphql/generated/uniswap';
import { getPrice } from '../../prices/prices.utils';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { formatBalance, getToken } from '../../tokens/tokens.utils';

interface LiquidityData {
  contract: string;
  token0: string;
  token1: string;
  reserve0: number;
  reserve1: number;
  totalSupply: number;
}

export async function getLiquidityData(chain: Chain, contract: string): Promise<LiquidityData> {
  const pairContract = UniV2__factory.connect(contract, chain.provider);
  const totalSupply = formatBalance(await pairContract.totalSupply());
  const token0 = await pairContract.token0();
  const token1 = await pairContract.token1();
  const token0Decimals = getToken(token0).decimals;
  const token1Decimals = getToken(token1).decimals;
  const reserves = await pairContract.getReserves();
  const reserve0 = formatBalance(reserves._reserve0, token0Decimals);
  const reserve1 = formatBalance(reserves._reserve1, token1Decimals);
  return {
    contract: contract,
    token0: token0,
    token1: token1,
    reserve0: reserve0,
    reserve1: reserve1,
    totalSupply: totalSupply,
  };
}

export const getLiquidityPrice = async (graphUrl: string, contract: string): Promise<TokenPrice> => {
  const graphqlClient = new GraphQLClient(graphUrl);
  const graphqlSdk = getUniswapSdk(graphqlClient);
  const { pair } = await graphqlSdk.UniV2Pair({
    id: contract.toLowerCase(),
  });
  if (!pair) {
    throw new NotFound(`No pair found for ${contract}`);
  }
  if (parseFloat(pair.totalSupply) === 0) {
    const token = getToken(contract);
    return {
      name: token.name,
      address: token.address,
      usd: 0,
      eth: 0,
    };
  }
  const liquidityData: LiquidityData = {
    contract: contract,
    token0: ethers.utils.getAddress(pair.token0.id),
    token1: ethers.utils.getAddress(pair.token1.id),
    reserve0: pair.reserve0,
    reserve1: pair.reserve1,
    totalSupply: pair.totalSupply,
  };
  return resolveLiquidityPrice(liquidityData);
};

export const getOnChainLiquidityPrice = async (chain: Chain, contract: string): Promise<TokenPrice> => {
  try {
    const liquidityData = await getLiquidityData(chain, contract);
    if (liquidityData.totalSupply === 0) {
      const token = getToken(contract);
      return {
        name: token.name,
        address: token.address,
        usd: 0,
        eth: 0,
      };
    }
    return resolveLiquidityPrice(liquidityData);
  } catch (err) {
    console.log(err);
    throw new NotFound(`No pair found for ${contract}`);
  }
};

const resolveLiquidityPrice = async (liquidityData: LiquidityData): Promise<TokenPrice> => {
  const { contract, token0, token1, reserve0, reserve1, totalSupply } = liquidityData;
  let t0Price = await getPrice(token0);
  let t1Price = await getPrice(token1);
  if (!t0Price && !t1Price) {
    throw new UnprocessableEntity(`Token pair ${contract} cannot be priced`);
  }
  if (!t0Price) {
    const t1Scalar = reserve0 / reserve1;
    const t0Info = getToken(token0);
    t0Price = {
      name: t0Info.name,
      address: t0Info.address,
      usd: t1Price.usd * t1Scalar,
      eth: t1Price.eth * t1Scalar,
    };
  }
  if (!t1Price) {
    const t0Scalar = reserve1 / reserve0;
    const t1Info = getToken(token1);
    t1Price = {
      name: t1Info.name,
      address: t1Info.address,
      usd: t0Price.usd * t0Scalar,
      eth: t0Price.eth * t0Scalar,
    };
  }
  const token = getToken(contract);
  const usdPrice = (t0Price.usd * reserve0 + t1Price.usd * reserve1) / totalSupply;
  const ethPrice = (t0Price.eth * reserve0 + t1Price.eth * reserve1) / totalSupply;
  return {
    name: token.name,
    address: token.address,
    usd: usdPrice,
    eth: ethPrice,
  };
};

export const resolveTokenPrice = async (chain: Chain, token: string, contract: string): Promise<TokenPrice> => {
  const { token0, token1, reserve0, reserve1 } = await getLiquidityData(chain, contract);
  const pricingToken = getToken(token);
  const isToken0 = pricingToken.address === token0;
  const knownToken = isToken0 ? token1 : token0;
  const [divisor, dividend] = isToken0 ? [reserve1, reserve0] : [reserve0, reserve1];
  const knownTokenPrice = await getPrice(knownToken);
  if (!knownTokenPrice) {
    throw new UnprocessableEntity(`Token ${pricingToken.name} cannot be priced`);
  }
  const scalar = divisor / dividend;
  const usdPrice = knownTokenPrice.usd * scalar;
  const ethPrice = knownTokenPrice.eth * scalar;
  return {
    name: pricingToken.name,
    address: pricingToken.address,
    usd: usdPrice,
    eth: ethPrice,
  };
};

export const getUniswapPrice = async (contract: string): Promise<TokenPrice> => {
  return getLiquidityPrice(UNISWAP_URL, contract);
};

// TODO: rethink how to generalize these fuctions, revisit strategy <> chain relations
export async function getPancakeswapPrice(contract: string): Promise<TokenPrice> {
  return getOnChainLiquidityPrice(Chain.getChain(Network.BinanceSmartChain), contract);
}

export async function getQuickswapPrice(contract: string): Promise<TokenPrice> {
  return getOnChainLiquidityPrice(Chain.getChain(Network.Polygon), contract);
}

export async function getArbitriumLiquidityPrice(contract: string): Promise<TokenPrice> {
  return getOnChainLiquidityPrice(Chain.getChain(Network.Arbitrum), contract);
}

export async function getFantomLiquidityPrice(contract: string): Promise<TokenPrice> {
  return getOnChainLiquidityPrice(Chain.getChain(Network.Fantom), contract);
}
