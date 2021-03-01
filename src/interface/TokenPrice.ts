export interface TokenPrice {
	name?: string;
	address?: string;
	usd: number;
	eth: number;
}

export interface PriceData {
	[price: string]: TokenPrice;
}
