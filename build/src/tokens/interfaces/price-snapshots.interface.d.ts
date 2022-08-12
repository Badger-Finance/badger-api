export interface PriceSnapshots {
    [token: string]: {
        [timestamp: number]: number;
    };
}
