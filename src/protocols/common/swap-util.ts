import { NotFound, UnprocessableEntity } from '@tsed/exceptions';
import { BigNumber, ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import { Chain } from '../../chains/config/chain.config';
import { Network } from '../../chains/enums/chain-network.enum';
import { uniV2LPAbi } from '../../config/abi';
import { SUSHISWAP_URL, UNISWAP_URL } from '../../config/constants';
import { getSdk as getUniswapSdk } from '../../graphql/generated/uniswap';
import { getTokenPriceData } from '../../prices/prices-util';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';

interface LiquidityData {
  contract: string;
  token0: string;
  token1: string;
  reserve0: number;
  reserve1: number;
  totalSupply: number;
}

interface GetReservesResponse {
  _reserve0: BigNumber;
  _reserve1: BigNumber;
  _blockTimestampLast: number;
}

export const getLiquidityData = async (chain: Chain, contract: string): Promise<LiquidityData> => {
  const pairContract = new ethers.Contract(contract, uniV2LPAbi, chain.provider);
  const totalSupply = parseFloat(ethers.utils.formatEther(await pairContract.totalSupply()));
  const token0 = await pairContract.token0();
  const token1 = await pairContract.token1();
  const reserves: GetReservesResponse = await pairContract.getReserves();
  const reserve0 = parseFloat(ethers.utils.formatEther(reserves._reserve0));
  const reserve1 = parseFloat(ethers.utils.formatEther(reserves._reserve1));
  return {
    contract: contract,
    token0: token0,
    token1: token1,
    reserve0: reserve0,
    reserve1: reserve1,
    totalSupply: totalSupply,
  };
};

export const getLiquidityPrice = async (graphUrl: string, contract: string): Promise<TokenPrice> => {
  const graphqlClient = new GraphQLClient(graphUrl);
  const graphqlSdk = getUniswapSdk(graphqlClient);
  const { pair } = await graphqlSdk.UniV2Pair({
    id: contract.toLowerCase(),
  });
  if (!pair) {
    throw new NotFound(`No pair found for ${contract}`);
  }
  if (pair.totalSupply === 0) {
    return {
      address: contract,
      usd: 0,
      eth: 0,
    };
  }
  const liquidityData: LiquidityData = {
    contract: contract,
    token0: pair.token0.id,
    token1: pair.token1.id,
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
      return {
        address: contract,
        usd: 0,
        eth: 0,
      };
    }
    return resolveLiquidityPrice(liquidityData);
  } catch (err) {
    throw new NotFound(`No pair found for ${contract}`);
  }
};

const resolveLiquidityPrice = async (liquidityData: LiquidityData): Promise<TokenPrice> => {
  const { contract, token0, token1, reserve0, reserve1, totalSupply } = liquidityData;
  let t0Price = await getTokenPriceData(token0);
  let t1Price = await getTokenPriceData(token1);
  if (!t0Price && !t1Price) throw new UnprocessableEntity(`Token pair ${contract} cannot be priced`);
  if (!t0Price) {
    const t1Scalar = reserve0 / reserve1;
    t0Price = {
      address: token0,
      usd: t1Price.usd * t1Scalar,
      eth: t1Price.eth * t1Scalar,
    };
  }
  if (!t1Price) {
    const t0Scalar = reserve1 / reserve0;
    t1Price = {
      address: token1,
      usd: t0Price.usd * t0Scalar,
      eth: t0Price.eth * t0Scalar,
    };
  }
  const usdPrice = (t0Price.usd * reserve0 + t1Price.usd * reserve1) / totalSupply;
  const ethPrice = (t0Price.eth * reserve0 + t1Price.eth * reserve1) / totalSupply;
  return {
    address: contract,
    usd: usdPrice,
    eth: ethPrice,
  };
};

export const getSushiswapPrice = async (contract: string): Promise<TokenPrice> => {
  return getLiquidityPrice(SUSHISWAP_URL, contract);
};

export const getUniswapPrice = async (contract: string): Promise<TokenPrice> => {
  return getLiquidityPrice(UNISWAP_URL, contract);
};

export const getPancakeswapPrice = async (contract: string): Promise<TokenPrice> => {
  return getOnChainLiquidityPrice(Chain.getChain(Network.BinanceSmartChain), contract);
};
