import { TokenPrice } from '../../prices/interface/token-price.interface';

export abstract class ChainStrategy {
  abstract getPrice(address: string): Promise<TokenPrice>;
}
