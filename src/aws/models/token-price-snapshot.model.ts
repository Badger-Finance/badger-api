import { attribute, hashKey, rangeKey, table } from "@aws/dynamodb-data-mapper-annotations";

import { TOKEN_PRICE_DATA } from "../../config/constants";
import { TokenPrice } from "../../prices/interface/token-price.interface";

@table(TOKEN_PRICE_DATA)
export class TokenPriceSnapshot implements TokenPrice {
  @hashKey()
  address!: string;

  @attribute()
  price!: number;

  @rangeKey({ defaultProvider: () => Date.now() })
  updatedAt!: number;

  @attribute()
  usd?: number;
}
