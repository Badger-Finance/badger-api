import { TokenPrice } from "../../prices/interface/token-price.interface";
export interface PriceData {
  [address: string]: TokenPrice;
}
