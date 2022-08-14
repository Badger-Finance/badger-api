import { embed } from "@aws/dynamodb-data-mapper";
import { attribute } from "@aws/dynamodb-data-mapper-annotations";

import { CachedTokenBalance } from "../../tokens/interfaces/cached-token-balance.interface";

export class CachedSettBalance {
  @attribute()
  network!: string;

  @attribute()
  address!: string;

  @attribute()
  name!: string;

  @attribute()
  symbol!: string;

  @attribute()
  pricePerFullShare!: number;

  @attribute()
  balance!: number;

  @attribute()
  value!: number;

  @attribute({ memberType: embed(CachedTokenBalance) })
  tokens!: CachedTokenBalance[];

  @attribute()
  earnedBalance!: number;

  @attribute()
  earnedValue!: number;

  @attribute({ memberType: embed(CachedTokenBalance) })
  earnedTokens!: CachedTokenBalance[];

  @attribute()
  depositedBalance!: number;

  @attribute()
  withdrawnBalance!: number;
}
