import { AttributeMap, PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';

/**
 * Detailed information on token price for both
 * USD and ETH base currencies.
 */
export interface TokenPrice {
  name?: string;
  address?: string;
  usd: number;
  eth: number;
}

export interface TokenPriceSnapshot extends TokenPrice {
  updatedAt: number;
}

export class TokenSnapshot implements TokenPriceSnapshot {
  readonly name?: string;
  readonly address?: string;
  readonly usd: number;
  readonly eth: number;
  readonly updatedAt: number;

  constructor(snapshot: TokenPriceSnapshot) {
    this.name = snapshot.name;
    this.address = snapshot.address;
    this.usd = snapshot.usd;
    this.eth = snapshot.eth;
    this.updatedAt = snapshot.updatedAt;
  }

  toAttributeMap(): PutItemInputAttributeMap {
    return {
      name: {
        S: this.name,
      },
      address: {
        S: this.address,
      },
      updatedAt: {
        N: this.updatedAt.toString(),
      },
      usd: {
        N: this.usd.toString(),
      },
      eth: {
        N: this.eth.toString(),
      },
    };
  }

  static fromAtrributeMap(map: AttributeMap): TokenSnapshot {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const snapshot: TokenPriceSnapshot = {
      name: map.name.S,
      address: map.address.S,
      updatedAt: parseInt(map.updatedAt.N!),
      usd: parseFloat(map.usd.N!),
      eth: parseFloat(map.eth.N!),
    };
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    return new TokenSnapshot(snapshot);
  }
}

/**
 * Mapping from token contract address to detailed
 * token price data.
 */
export interface PriceData {
  [address: string]: TokenPrice;
}

/**
 * Mapping from token contract address to single
 * currency price data.
 */
export interface PriceSummary {
  [address: string]: number;
}
