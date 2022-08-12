export interface CoinGeckoPriceResponse {
    [address: string]: {
        usd: number;
    };
}
