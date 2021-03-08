import { Service } from '@tsed/common';
import { InternalServerError } from '@tsed/exceptions';
import NodeCache from 'node-cache';
import fetch from 'node-fetch';
import { PriceData, PriceSummary, TokenPrice } from '../interface/TokenPrice';
import { COINGECKO_URL, TOKENS } from '../util/constants';
import { getSushiswapPrice, getUniswapPrice } from '../util/util';

const priceCache = new NodeCache({ stdTTL: 300, checkperiod: 480 });

/**
 * API price oracle service. Uses CoinGecko as a source of truth for most
 * tokens when possible, and TheGraph for AMM pairs when not available
 * via CG. Prices are cached for 5 minutes at a time, but may live up to 8.
 */
@Service()
export class PriceService {
	/**
	 * Retrieve the USD price for a given token balance.
	 * @param contract Token contract address.
	 * @param balance Token balance to calculate price.
	 */
	async getUsdValue(contract: string, balance: number): Promise<number> {
		const tokenPrice = await this.getTokenPriceData(contract);
		return tokenPrice.usd * balance;
	}

	/**
	 * Retrieve the ETH price for a given token balance.
	 * @param contract Token contract address.
	 * @param balance Token balance to calculate price.
	 */
	async getEthValue(contract: string, balance: number): Promise<number> {
		const tokenPrice = await this.getTokenPriceData(contract);
		return tokenPrice.eth * balance;
	}

	/**
	 * Retrieve the price data for a given token in USD and ETH.
	 * @param contract Token contract address.
	 */
	async getTokenPriceData(contract: string): Promise<TokenPrice> {
		const cachedPrice: TokenPrice | undefined = priceCache.get(contract);
		if (!cachedPrice) {
			const priceData = await this.getPriceData();
			return priceData[contract];
		}
		return cachedPrice;
	}

	/**
	 * Retrieve all protocol token prices in both USD and ETH.
	 */
	async getPriceData(): Promise<PriceData> {
		const [
			badgerPrice,
			diggPrice,
			wbtcPrice,
			uniBadgerWbtcPrice,
			uniDiggWbtcPrice,
			slpBadgerWbtcPrice,
			slpDiggWbtcPrice,
			slpEthWbtcPrice,
			renBtcPrice,
			sBtcPrice,
			tBtcPrice,
			wethPrice,
			sushiPrice,
		] = await Promise.all([
			getContractPrice(TOKENS.BADGER),
			getContractPrice(TOKENS.DIGG),
			getContractPrice(TOKENS.WBTC),
			getUniswapPrice(TOKENS.UNI_BADGER_WBTC),
			getUniswapPrice(TOKENS.UNI_DIGG_WBTC),
			getSushiswapPrice(TOKENS.SUSHI_BADGER_WBTC),
			getSushiswapPrice(TOKENS.SUSHI_DIGG_WBTC),
			getSushiswapPrice(TOKENS.SUSHI_ETH_WBTC),
			getContractPrice(TOKENS.CRV_RENBTC),
			getTokenPrice('sbtc'),
			getTokenPrice('tbtc'),
			getContractPrice(TOKENS.WETH),
			getContractPrice(TOKENS.SUSHI),
		]);
		const priceData: PriceData = {};
		priceData[TOKENS.BADGER] = badgerPrice;
		priceData[TOKENS.DIGG] = diggPrice;
		priceData[TOKENS.WBTC] = wbtcPrice;
		priceData[TOKENS.UNI_BADGER_WBTC] = uniBadgerWbtcPrice;
		priceData[TOKENS.UNI_DIGG_WBTC] = uniDiggWbtcPrice;
		priceData[TOKENS.SUSHI_BADGER_WBTC] = slpBadgerWbtcPrice;
		priceData[TOKENS.SUSHI_DIGG_WBTC] = slpDiggWbtcPrice;
		priceData[TOKENS.SUSHI_ETH_WBTC] = slpEthWbtcPrice;
		priceData[TOKENS.CRV_RENBTC] = renBtcPrice;
		priceData[TOKENS.CRV_SBTC] = sBtcPrice;
		priceData[TOKENS.CRV_TBTC] = tBtcPrice;
		priceData[TOKENS.WETH] = wethPrice;
		priceData[TOKENS.SUSHI] = sushiPrice;
		return priceData;
	}

	async getPriceSummary(): Promise<PriceSummary> {
		const priceData = await this.getPriceData();
		const priceSummary: PriceSummary = {};
		for (const [key, value] of Object.entries(priceData)) {
			priceSummary[key] = value.usd;
		}
		return priceSummary;
	}
}

/**
 * Retrieve the price data for a given token in USD and ETH.
 * Warning: Not all contracts are supported.
 * If a token is not supported, but available on CoinGecko, use getTokenPrice.
 * @param contract Token contract address.
 * @throws {InternalServerError} Failed price lookup.
 */
export const getContractPrice = async (contract: string): Promise<TokenPrice> => {
	const cachedPrice: TokenPrice | undefined = priceCache.get(contract);
	if (cachedPrice) return cachedPrice;
	const response = await fetch(
		`${COINGECKO_URL}/token_price/ethereum?contract_addresses=${contract}&vs_currencies=usd,eth`,
	);
	if (!response.ok) throw new InternalServerError('Unable to query contract price');
	const json = await response.json();
	const contractKey = contract.toLowerCase(); // coingecko return key in lower case
	if (!json[contractKey] || !json[contractKey].usd || !json[contractKey].eth)
		throw new InternalServerError('Unable to resolve contract price');
	const contractPrice: TokenPrice = {
		address: contract,
		usd: json[contractKey].usd,
		eth: json[contractKey].eth,
	};
	priceCache.set(contract, contractPrice);
	return contractPrice;
};

/**
 * Retrieve the price data for a given token in USD and ETH.
 * @param token CoinGecko token name.
 * @throws {InternalServerError} Failed price lookup.
 */
export const getTokenPrice = async (token: string): Promise<TokenPrice> => {
	const cachedPrice: TokenPrice | undefined = priceCache.get(token);
	if (cachedPrice) return cachedPrice;
	const response = await fetch(`${COINGECKO_URL}/price?ids=${token}&vs_currencies=usd,eth`);
	if (!response.ok) throw new InternalServerError('Unable to query token price');
	const json = await response.json();
	if (!json[token] || !json[token].usd || !json[token].eth)
		throw new InternalServerError('Unable to resolve token price');
	const tokenPrice: TokenPrice = {
		name: token,
		usd: json[token].usd,
		eth: json[token].eth,
	};
	priceCache.set(token, tokenPrice);
	return tokenPrice;
};
