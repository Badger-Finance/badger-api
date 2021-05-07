import { BadRequest, InternalServerError, NotFound, UnprocessableEntity } from '@tsed/exceptions';
import { ethers } from 'ethers';
import fetch from 'node-fetch';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { ChainStrategy } from '../chains/strategies/chain.strategy';
import { ibBTCAbi } from '../config/abi/ibbtc.abi';
import { COINGECKO_URL, TOKENS } from '../config/constants';
import { getSett } from '../setts/setts.utils';
import { TokenType } from '../tokens/enums/token-type.enum';
import { Token } from '../tokens/interfaces/token.interface';
import { PriceData, TokenPrice } from '../tokens/interfaces/token-price.interface';
import { TokenPriceSnapshot } from '../tokens/interfaces/token-price-snapshot.interface';
import { getToken, getTokenByName } from '../tokens/tokens.utils';
import { TokenConfig } from '../tokens/types/token-config.type';

/**
 * Protoype for a token address pricing function.
 * @param address Target for price retrieval.
 */
export type PricingFunction = (address: string) => Promise<TokenPrice>;

/**
 * Mass price update request object.
 * Mapping of token address to respective pricing function.
 * @see {PricingFunction}
 */
export interface PriceUpdateRequest {
  [token: string]: PricingFunction;
}

export const noPrice = (token: Token): TokenPriceSnapshot => {
  return {
    name: token.name,
    address: token.address,
    usd: 0,
    eth: 0,
    updatedAt: Date.now(),
  };
};

/**
 * Update pricing db entry using chain strategy.
 * @param token Target for price update.
 */
export const updatePrice = async (token: Token): Promise<TokenPriceSnapshot> => {
  const { address, name } = token;
  const strategy = ChainStrategy.getStrategy(address);

  try {
    const mapper = getDataMapper();
    const price = await strategy.getPrice(address);
    return mapper.put(
      Object.assign(new TokenPriceSnapshot(), {
        address: address,
        name: name,
        eth: price.eth,
        usd: price.usd,
      }),
    );
  } catch (err) {
    return noPrice(token);
  } // ignore issues to allow for price updates of other coins
};

/**
 * Mass update token pricing db entries.
 * @param tokenConfig Target for price updates.
 */
export const updatePrices = async (tokenConfig: TokenConfig): Promise<TokenPriceSnapshot[]> => {
  return Promise.all(Object.keys(tokenConfig).map(async (token) => updatePrice(tokenConfig[token])));
};

/**
 * Load token price fromt he pricing database.
 * @param contract Address for the token price being requested.
 * @returns Most recent price data for the requested contract.
 */
export const getPrice = async (contract: string): Promise<TokenPriceSnapshot> => {
  const token = getToken(contract);
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(
      TokenPriceSnapshot,
      { address: token.address },
      { limit: 1, scanIndexForward: false },
    )) {
      return item;
    }
    return noPrice(token);
  } catch (err) {
    console.error(err);
    return noPrice(token);
  }
};

/**
 * Retrieve the price data for a given token in USD and ETH.
 * @param contract Token contract address.
 * @returns Most recently updated token pricing data.
 */
export const getTokenPriceData = async (contract: string): Promise<TokenPrice> => {
  return getPrice(contract);
};

/**
 * Retrieve all chain token prices in both USD and ETH.
 * @returns Most recently updated token pricing data for all tokens.
 */
export const getPriceData = async (tokens: TokenConfig): Promise<PriceData> => {
  const priceData: PriceData = {};
  const prices = await Promise.all(Object.keys(tokens).map((key) => getPrice(tokens[key].address)));
  prices.forEach((token) => (priceData[token.address] = token));
  return priceData;
};

/**
 * Retrieve the price data for a given token in USD and ETH.
 * Warning: Not all contracts are supported.
 * If a token is not supported, but available on CoinGecko, use getTokenPrice.
 * @param contract Token contract address.
 * @throws {InternalServerError} Failed price lookup.
 */
export const getContractPrice = async (contract: string): Promise<TokenPrice> => {
  const response = await fetch(
    `${COINGECKO_URL}/token_price/ethereum?contract_addresses=${contract}&vs_currencies=usd,eth`,
  );
  if (!response.ok) {
    throw new InternalServerError(`Unable to query ${contract} price`);
  }
  const json = await response.json();
  const contractKey = contract.toLowerCase(); // coingecko return key in lower case
  if (!json[contractKey] || !json[contractKey].usd || !json[contractKey].eth) {
    throw new InternalServerError(`Unable to resolve ${contract} price`);
  }
  const token = getToken(contract);
  return {
    name: token.name,
    address: token.address,
    usd: json[contractKey].usd,
    eth: json[contractKey].eth,
  };
};

/**
 * Retrieve the price data for a given token in USD and ETH.
 * @param token CoinGecko token name.
 * @throws {InternalServerError} Failed price lookup.
 */
export const getTokenPrice = async (name: string): Promise<TokenPrice> => {
  const response = await fetch(`${COINGECKO_URL}/price?ids=${name}&vs_currencies=usd,eth`);
  if (!response.ok) {
    throw new InternalServerError(`Unable to query ${name} price`);
  }
  const json = await response.json();
  if (!json[name] || !json[name].usd || !json[name].eth) {
    throw new InternalServerError(`Unable to resolve ${name} price`);
  }
  const token = getTokenByName(name);
  return {
    name: token.name,
    address: token.address,
    usd: json[name].usd,
    eth: json[name].eth,
  };
};

/**
 * Convert a given token price to a defined currency option.
 * @param tokenPrice Pricing data for the given token.
 * @param currency Currency requested from the pricing data.
 * @returns Price value in currency if exists, default to usd if not.
 */
export const inCurrency = (tokenPrice: TokenPrice, currency?: string): number => {
  switch (currency) {
    case 'eth':
      return tokenPrice.eth;
    case 'usd':
    default:
      return tokenPrice.usd;
  }
};

/**
 * Get pricing information for a vault token.
 * @param contract Address for vault token.
 * @returns Pricing data for the given vault token based on the pricePerFullShare.
 */
export const getVaultTokenPrice = async (contract: string): Promise<TokenPrice> => {
  const token = getToken(contract);
  if (token.type !== TokenType.Vault) {
    throw new BadRequest(`${token.name} is not a vault token`);
  }
  if (!token.vaultToken) {
    throw new UnprocessableEntity(`${token.name} vault token missing`);
  }
  const vaultToken = token.vaultToken;
  const targetChain = Chain.getChain(vaultToken.network);
  const [vaultTokenPrice, vaultTokenSnapshot] = await Promise.all([
    getPrice(vaultToken.address),
    getSett(targetChain.graphUrl, token.address),
  ]);
  if (!vaultTokenSnapshot.sett) {
    throw new NotFound(`Failed to load ${contract} sett data`);
  }
  vaultTokenPrice.name = token.name;
  vaultTokenPrice.address = token.address;
  const sett = vaultTokenSnapshot.sett;

  let multiplier;
  if (token.address === TOKENS.BDIGG) {
    multiplier = (sett.balance / sett.totalSupply) * 1e9;
  } else {
    multiplier = sett.pricePerFullShare / Math.pow(10, token.decimals);
  }
  vaultTokenPrice.usd *= multiplier;
  vaultTokenPrice.eth *= multiplier;

  return vaultTokenPrice;
};

/**
 * Get pricing information for a wrapper token.
 * Wrapper tokens are tokens on their non-native chain that represent another token
 * in the system. i.e. bDigg on Binance Smart Chain.
 * @param contract Address for wrapper token.
 * @returns Pricing data for the given wrapper token.
 */
export const getWrapperTokenPrice = async (contract: string): Promise<TokenPrice> => {
  const token = getToken(contract);
  if (token.type !== TokenType.Wrapper) {
    throw new BadRequest(`${token.name} is not a wrapper token`);
  }
  if (!token.vaultToken) {
    throw new UnprocessableEntity(`${token.name} vault token missing`);
  }
  const { vaultToken } = token;
  const allSetts = [];
  for (const chain of loadChains()) {
    allSetts.push(...chain.setts);
  }
  const backingVault = allSetts.find((sett) => ethers.utils.getAddress(sett.settToken) === vaultToken.address);
  if (!backingVault) {
    throw new UnprocessableEntity(`${token.name} backing vault missing`);
  }
  const price = await getPrice(backingVault.settToken);
  if (!price) {
    throw new InternalServerError(`Failed to load ${contract} sett data`);
  }
  return price;
};

export const ibBTCPrice = async (): Promise<TokenPrice> => {
  const eth = Chain.getChain(ChainNetwork.Ethereum);
  const ibBTC = new ethers.Contract(TOKENS.IBBTC, ibBTCAbi, eth.provider);
  const token = getToken(TOKENS.IBBTC);
  const ppfs = (await ibBTC.pricePerShare()) / Math.pow(10, token.decimals);
  const wbtcPrice = await getPrice(TOKENS.WBTC);
  return {
    name: token.name,
    address: token.address,
    usd: wbtcPrice.usd * ppfs,
    eth: wbtcPrice.eth * ppfs,
  };
};
