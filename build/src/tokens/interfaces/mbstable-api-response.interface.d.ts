export interface mStableApiResponse {
    mbtc: mStableAssetInfo;
}
interface mStableAssetInfo {
    symbol: string;
    address: string;
    decimals: number;
    metrics: {
        historic: mStableAssetMetric[];
    };
}
interface mStableAssetMetric {
    dailyAPY: number;
}
export {};
