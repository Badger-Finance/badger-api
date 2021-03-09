import { Service } from '@tsed/common';
import { InternalServerError, NotFound } from '@tsed/exceptions';
import { TOKENS } from '../config/constants';
import { getSushiswapPair, getUniswapPair } from '../config/util';
import { SettSnapshot } from '../interface/SettSnapshot';
import { Token } from '../interface/Token';
import { TokenBalance } from '../interface/TokenBalance';
import { PriceService } from '../prices/PricesService';
import { SettData, setts } from '../service/setts';

@Service()
export class TokenService {
	constructor(private priceService: PriceService) {}
	/**
	 * @param settAddress Sett contract address
	 * @param settBalance Sett token balance
	 * @param prices Price data object
	 */
	async getSettTokens(settAddress: string, settSnapshot: SettSnapshot): Promise<TokenBalance[]> {
		const sett = setts.find((s) => s.settToken === settAddress);
		if (!sett) throw new NotFound(`${settAddress} is not a known Sett`);
		if (this.isLPToken(sett.depositToken)) {
			return await this.getLiquidtyPoolTokenBalances(sett, settSnapshot);
		}
		const tokens = (settSnapshot.balance * settSnapshot.ratio) / 1e18;
		const token = this.getTokenByAddress(sett.depositToken);
		return [
			{
				address: token.address,
				name: token.name,
				symbol: token.symbol,
				decimals: token.decimals,
				balance: tokens,
				value: await this.priceService.getUsdValue(token.address, tokens),
			} as TokenBalance,
		];
	}

	getTokenByName(token: string): Token {
		const knownToken = this.tokenRegistry.find((t) => t.name.toLowerCase() === token.toLowerCase());
		if (!knownToken) throw new InternalServerError(`${token} definition not in TokenRegistry`);
		return knownToken;
	}

	getTokenByAddress(token: string): Token {
		const knownToken = this.tokenRegistry.find((t) => t.address.toLowerCase() === token.toLowerCase());
		if (!knownToken) throw new InternalServerError(`${token} definition not in TokenRegistry`);
		return knownToken;
	}

	isLPToken(token: string) {
		return [
			TOKENS.UNI_BADGER_WBTC,
			TOKENS.UNI_DIGG_WBTC,
			TOKENS.SUSHI_BADGER_WBTC,
			TOKENS.SUSHI_DIGG_WBTC,
			TOKENS.SUSHI_ETH_WBTC,
		].includes(token);
	}

	// TODO: More flexibly look up pools (sushi / uni share subgraph schema)
	async getLiquidtyPoolTokenBalances(sett: SettData, settSnapshot: SettSnapshot): Promise<TokenBalance[]> {
		const { depositToken, protocol } = sett;

		let poolData;
		if (protocol === 'uniswap') {
			poolData = await getUniswapPair(depositToken);
		}
		if (protocol === 'sushiswap') {
			poolData = await getSushiswapPair(depositToken);
		}
		if (!poolData || !poolData.data) {
			throw new NotFound(`${protocol} pool ${depositToken} does not exist`);
		}
		const pair = poolData.data.pair;
		// poolData returns the full liquidity pool, valueScalar acts to calculate the portion within the sett
		const valueScalar = (settSnapshot.supply * settSnapshot.ratio) / pair.totalSupply;
		const token0: TokenBalance = {
			name: pair.token0.name,
			address: pair.token0.id,
			symbol: pair.token0.symbol,
			decimals: pair.token0.decimals,
			balance: pair.reserve0,
			value: (await this.priceService.getUsdValue(pair.token0.id, pair.reserve0)) * valueScalar,
		};
		const token1: TokenBalance = {
			name: pair.token1.name,
			address: pair.token1.id,
			symbol: pair.token1.symbol,
			decimals: pair.token1.decimals,
			balance: pair.reserve1,
			value: (await this.priceService.getUsdValue(pair.token1.id, pair.reserve1)) * valueScalar,
		};
		return [token0, token1];
	}

	private tokenRegistry: Token[] = [
		{
			address: TOKENS.BADGER,
			name: 'Badger',
			symbol: 'BADGER',
			decimals: 18,
		},
		{
			address: TOKENS.DIGG,
			name: 'Digg',
			symbol: 'DIGG',
			decimals: 9,
		},
		{
			address: TOKENS.SUSHI_DIGG_WBTC,
			name: 'SushiSwap: WBTC-DIGG',
			symbol: 'SushiSwap WBTC/DIGG LP (SLP)',
			decimals: 18,
		},
		{
			address: TOKENS.UNI_DIGG_WBTC,
			name: 'Uniswap V2: WBTC-DIGG',
			symbol: 'Uniswap WBTC/DIGG LP (UNI-V2)',
			decimals: 18,
		},
		{
			address: TOKENS.SUSHI_BADGER_WBTC,
			name: 'SushiSwap: WBTC-BADGER',
			symbol: 'Badger Sett SushiSwap LP Token (bSLP)',
			decimals: 18,
		},
		{
			address: TOKENS.SUSHI_ETH_WBTC,
			name: 'SushiSwap: WBTC-ETH',
			symbol: 'SushiSwap WBTC/ETH LP (SLP)',
			decimals: 18,
		},
		{
			address: TOKENS.UNI_BADGER_WBTC,
			name: 'Uniswap V2: WBTC-BADGER',
			symbol: 'Uniswap WBTC/BADGER LP (UNI-V2)',
			decimals: 18,
		},
		{
			address: TOKENS.CRV_RENBTC,
			name: 'Curve.fi: renCrv Token',
			symbol: 'Curve.fi renBTC/wBTC (crvRenWBTC)',
			decimals: 18,
		},
		{
			address: TOKENS.CRV_TBTC,
			name: 'Curve.fi tBTC/sbtcCrv',
			symbol: 'Curve.fi tBTC/sbtcCrv (tbtc/sbtc)',
			decimals: 18,
		},
		{
			address: TOKENS.CRV_SBTC,
			name: 'Curve.fi renBTC/wBTC/sBTC',
			symbol: 'Curve.fi renBTC/wBTC/sBTC',
			decimals: 18,
		},
	];
}
