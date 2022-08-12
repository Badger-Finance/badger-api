import { TokenPrice } from '../../prices/interface/token-price.interface';
export declare class TokenPriceSnapshot implements TokenPrice {
    address: string;
    price: number;
    updatedAt: number;
    usd?: number;
}
