import { CachedSettBalance } from '../../accounts/interfaces/cached-sett-balance.interface';
export declare class CachedAccount {
    address: string;
    balances: Array<CachedSettBalance>;
    updatedAt: number;
}
