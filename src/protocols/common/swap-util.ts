import { NotFound } from '@tsed/exceptions';
import { GraphQLClient } from 'graphql-request';
import { PANCAKESWAP_URL, SUSHISWAP_URL, UNISWAP_URL } from '../../config/constants';
import { getSdk as getUniswapSdk } from '../../graphql/generated/uniswap';
import { getContractPrice } from '../../prices/PricesService';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';

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
  const t0Price = await getContractPrice(pair.token0.id);
  const t1Price = await getContractPrice(pair.token1.id);
  const usdPrice = (t0Price.usd * pair.reserve0 + t1Price.usd * pair.reserve1) / pair.totalSupply;
  const ethPrice = (t0Price.eth * pair.reserve0 + t1Price.eth * pair.reserve1) / pair.totalSupply;
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
  return getLiquidityPrice(PANCAKESWAP_URL, contract);
};
