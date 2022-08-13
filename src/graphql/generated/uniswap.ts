import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Bundle = {
  __typename?: 'Bundle';
  ethPrice: Scalars['BigDecimal'];
  id: Scalars['ID'];
};

export type Bundle_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  ethPrice?: InputMaybe<Scalars['BigDecimal']>;
  ethPrice_gt?: InputMaybe<Scalars['BigDecimal']>;
  ethPrice_gte?: InputMaybe<Scalars['BigDecimal']>;
  ethPrice_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  ethPrice_lt?: InputMaybe<Scalars['BigDecimal']>;
  ethPrice_lte?: InputMaybe<Scalars['BigDecimal']>;
  ethPrice_not?: InputMaybe<Scalars['BigDecimal']>;
  ethPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export enum Bundle_OrderBy {
  EthPrice = 'ethPrice',
<<<<<<< HEAD
  Id = 'id',
=======
  Id = 'id'
>>>>>>> c15f0091 (chore: update update)
}

export type Burn = {
  __typename?: 'Burn';
  amount0?: Maybe<Scalars['BigDecimal']>;
  amount1?: Maybe<Scalars['BigDecimal']>;
  amountUSD?: Maybe<Scalars['BigDecimal']>;
  feeLiquidity?: Maybe<Scalars['BigDecimal']>;
  feeTo?: Maybe<Scalars['Bytes']>;
  id: Scalars['ID'];
  liquidity: Scalars['BigDecimal'];
  logIndex?: Maybe<Scalars['BigInt']>;
  needsComplete: Scalars['Boolean'];
  pair: Pair;
  sender?: Maybe<Scalars['Bytes']>;
  timestamp: Scalars['BigInt'];
  to?: Maybe<Scalars['Bytes']>;
  transaction: Transaction;
};

export type Burn_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount0?: InputMaybe<Scalars['BigDecimal']>;
  amount0_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount0_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount0_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount0_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount0_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount0_not?: InputMaybe<Scalars['BigDecimal']>;
  amount0_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount1?: InputMaybe<Scalars['BigDecimal']>;
  amount1_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount1_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount1_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount1_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount1_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount1_not?: InputMaybe<Scalars['BigDecimal']>;
  amount1_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amountUSD?: InputMaybe<Scalars['BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amountUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  feeLiquidity?: InputMaybe<Scalars['BigDecimal']>;
  feeLiquidity_gt?: InputMaybe<Scalars['BigDecimal']>;
  feeLiquidity_gte?: InputMaybe<Scalars['BigDecimal']>;
  feeLiquidity_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  feeLiquidity_lt?: InputMaybe<Scalars['BigDecimal']>;
  feeLiquidity_lte?: InputMaybe<Scalars['BigDecimal']>;
  feeLiquidity_not?: InputMaybe<Scalars['BigDecimal']>;
  feeLiquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  feeTo?: InputMaybe<Scalars['Bytes']>;
  feeTo_contains?: InputMaybe<Scalars['Bytes']>;
  feeTo_in?: InputMaybe<Array<Scalars['Bytes']>>;
  feeTo_not?: InputMaybe<Scalars['Bytes']>;
  feeTo_not_contains?: InputMaybe<Scalars['Bytes']>;
  feeTo_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidity?: InputMaybe<Scalars['BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  liquidity_lt?: InputMaybe<Scalars['BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['BigDecimal']>;
  liquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  needsComplete?: InputMaybe<Scalars['Boolean']>;
  needsComplete_in?: InputMaybe<Array<Scalars['Boolean']>>;
  needsComplete_not?: InputMaybe<Scalars['Boolean']>;
  needsComplete_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_?: InputMaybe<Pair_Filter>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  sender?: InputMaybe<Scalars['Bytes']>;
  sender_contains?: InputMaybe<Scalars['Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  sender_not?: InputMaybe<Scalars['Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  to?: InputMaybe<Scalars['Bytes']>;
  to_contains?: InputMaybe<Scalars['Bytes']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_not?: InputMaybe<Scalars['Bytes']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Burn_OrderBy {
  Amount0 = 'amount0',
  Amount1 = 'amount1',
  AmountUsd = 'amountUSD',
  FeeLiquidity = 'feeLiquidity',
  FeeTo = 'feeTo',
  Id = 'id',
  Liquidity = 'liquidity',
  LogIndex = 'logIndex',
  NeedsComplete = 'needsComplete',
  Pair = 'pair',
  Sender = 'sender',
  Timestamp = 'timestamp',
  To = 'to',
<<<<<<< HEAD
  Transaction = 'transaction',
=======
  Transaction = 'transaction'
>>>>>>> c15f0091 (chore: update update)
}

export type LiquidityPosition = {
  __typename?: 'LiquidityPosition';
  id: Scalars['ID'];
  liquidityTokenBalance: Scalars['BigDecimal'];
  pair: Pair;
  user: User;
};

export type LiquidityPositionSnapshot = {
  __typename?: 'LiquidityPositionSnapshot';
  block: Scalars['Int'];
  id: Scalars['ID'];
  liquidityPosition: LiquidityPosition;
  liquidityTokenBalance: Scalars['BigDecimal'];
  liquidityTokenTotalSupply: Scalars['BigDecimal'];
  pair: Pair;
  reserve0: Scalars['BigDecimal'];
  reserve1: Scalars['BigDecimal'];
  reserveUSD: Scalars['BigDecimal'];
  timestamp: Scalars['Int'];
  token0PriceUSD: Scalars['BigDecimal'];
  token1PriceUSD: Scalars['BigDecimal'];
  user: User;
};

export type LiquidityPositionSnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  block?: InputMaybe<Scalars['Int']>;
  block_gt?: InputMaybe<Scalars['Int']>;
  block_gte?: InputMaybe<Scalars['Int']>;
  block_in?: InputMaybe<Array<Scalars['Int']>>;
  block_lt?: InputMaybe<Scalars['Int']>;
  block_lte?: InputMaybe<Scalars['Int']>;
  block_not?: InputMaybe<Scalars['Int']>;
  block_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityPosition?: InputMaybe<Scalars['String']>;
  liquidityPosition_?: InputMaybe<LiquidityPosition_Filter>;
  liquidityPosition_contains?: InputMaybe<Scalars['String']>;
  liquidityPosition_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_gt?: InputMaybe<Scalars['String']>;
  liquidityPosition_gte?: InputMaybe<Scalars['String']>;
  liquidityPosition_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPosition_lt?: InputMaybe<Scalars['String']>;
  liquidityPosition_lte?: InputMaybe<Scalars['String']>;
  liquidityPosition_not?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_contains?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPosition_not_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_starts_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance?: InputMaybe<Scalars['BigDecimal']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['BigDecimal']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['BigDecimal']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['BigDecimal']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['BigDecimal']>;
  liquidityTokenBalance_not?: InputMaybe<Scalars['BigDecimal']>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  liquidityTokenTotalSupply?: InputMaybe<Scalars['BigDecimal']>;
  liquidityTokenTotalSupply_gt?: InputMaybe<Scalars['BigDecimal']>;
  liquidityTokenTotalSupply_gte?: InputMaybe<Scalars['BigDecimal']>;
  liquidityTokenTotalSupply_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  liquidityTokenTotalSupply_lt?: InputMaybe<Scalars['BigDecimal']>;
  liquidityTokenTotalSupply_lte?: InputMaybe<Scalars['BigDecimal']>;
  liquidityTokenTotalSupply_not?: InputMaybe<Scalars['BigDecimal']>;
  liquidityTokenTotalSupply_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_?: InputMaybe<Pair_Filter>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserve0_lt?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserve1_lt?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserveUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  token0PriceUSD?: InputMaybe<Scalars['BigDecimal']>;
  token0PriceUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  token0PriceUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  token0PriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  token0PriceUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  token0PriceUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  token0PriceUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  token0PriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  token1PriceUSD?: InputMaybe<Scalars['BigDecimal']>;
  token1PriceUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  token1PriceUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  token1PriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  token1PriceUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  token1PriceUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  token1PriceUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  token1PriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum LiquidityPositionSnapshot_OrderBy {
  Block = 'block',
  Id = 'id',
  LiquidityPosition = 'liquidityPosition',
  LiquidityTokenBalance = 'liquidityTokenBalance',
  LiquidityTokenTotalSupply = 'liquidityTokenTotalSupply',
  Pair = 'pair',
  Reserve0 = 'reserve0',
  Reserve1 = 'reserve1',
  ReserveUsd = 'reserveUSD',
  Timestamp = 'timestamp',
  Token0PriceUsd = 'token0PriceUSD',
  Token1PriceUsd = 'token1PriceUSD',
<<<<<<< HEAD
  User = 'user',
=======
  User = 'user'
>>>>>>> c15f0091 (chore: update update)
}

export type LiquidityPosition_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityTokenBalance?: InputMaybe<Scalars['BigDecimal']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['BigDecimal']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['BigDecimal']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['BigDecimal']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['BigDecimal']>;
  liquidityTokenBalance_not?: InputMaybe<Scalars['BigDecimal']>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_?: InputMaybe<Pair_Filter>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum LiquidityPosition_OrderBy {
  Id = 'id',
  LiquidityTokenBalance = 'liquidityTokenBalance',
  Pair = 'pair',
<<<<<<< HEAD
  User = 'user',
=======
  User = 'user'
>>>>>>> c15f0091 (chore: update update)
}

export type Mint = {
  __typename?: 'Mint';
  amount0?: Maybe<Scalars['BigDecimal']>;
  amount1?: Maybe<Scalars['BigDecimal']>;
  amountUSD?: Maybe<Scalars['BigDecimal']>;
  feeLiquidity?: Maybe<Scalars['BigDecimal']>;
  feeTo?: Maybe<Scalars['Bytes']>;
  id: Scalars['ID'];
  liquidity: Scalars['BigDecimal'];
  logIndex?: Maybe<Scalars['BigInt']>;
  pair: Pair;
  sender?: Maybe<Scalars['Bytes']>;
  timestamp: Scalars['BigInt'];
  to: Scalars['Bytes'];
  transaction: Transaction;
};

export type Mint_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount0?: InputMaybe<Scalars['BigDecimal']>;
  amount0_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount0_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount0_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount0_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount0_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount0_not?: InputMaybe<Scalars['BigDecimal']>;
  amount0_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount1?: InputMaybe<Scalars['BigDecimal']>;
  amount1_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount1_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount1_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount1_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount1_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount1_not?: InputMaybe<Scalars['BigDecimal']>;
  amount1_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amountUSD?: InputMaybe<Scalars['BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amountUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  feeLiquidity?: InputMaybe<Scalars['BigDecimal']>;
  feeLiquidity_gt?: InputMaybe<Scalars['BigDecimal']>;
  feeLiquidity_gte?: InputMaybe<Scalars['BigDecimal']>;
  feeLiquidity_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  feeLiquidity_lt?: InputMaybe<Scalars['BigDecimal']>;
  feeLiquidity_lte?: InputMaybe<Scalars['BigDecimal']>;
  feeLiquidity_not?: InputMaybe<Scalars['BigDecimal']>;
  feeLiquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  feeTo?: InputMaybe<Scalars['Bytes']>;
  feeTo_contains?: InputMaybe<Scalars['Bytes']>;
  feeTo_in?: InputMaybe<Array<Scalars['Bytes']>>;
  feeTo_not?: InputMaybe<Scalars['Bytes']>;
  feeTo_not_contains?: InputMaybe<Scalars['Bytes']>;
  feeTo_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidity?: InputMaybe<Scalars['BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  liquidity_lt?: InputMaybe<Scalars['BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['BigDecimal']>;
  liquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_?: InputMaybe<Pair_Filter>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  sender?: InputMaybe<Scalars['Bytes']>;
  sender_contains?: InputMaybe<Scalars['Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  sender_not?: InputMaybe<Scalars['Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  to?: InputMaybe<Scalars['Bytes']>;
  to_contains?: InputMaybe<Scalars['Bytes']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_not?: InputMaybe<Scalars['Bytes']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Mint_OrderBy {
  Amount0 = 'amount0',
  Amount1 = 'amount1',
  AmountUsd = 'amountUSD',
  FeeLiquidity = 'feeLiquidity',
  FeeTo = 'feeTo',
  Id = 'id',
  Liquidity = 'liquidity',
  LogIndex = 'logIndex',
  Pair = 'pair',
  Sender = 'sender',
  Timestamp = 'timestamp',
  To = 'to',
<<<<<<< HEAD
  Transaction = 'transaction',
=======
  Transaction = 'transaction'
>>>>>>> c15f0091 (chore: update update)
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
<<<<<<< HEAD
  Desc = 'desc',
=======
  Desc = 'desc'
>>>>>>> c15f0091 (chore: update update)
}

export type Pair = {
  __typename?: 'Pair';
  createdAtBlockNumber: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
  id: Scalars['ID'];
  liquidityProviderCount: Scalars['BigInt'];
  reserve0: Scalars['BigDecimal'];
  reserve1: Scalars['BigDecimal'];
  reserveETH: Scalars['BigDecimal'];
  reserveUSD: Scalars['BigDecimal'];
  token0: Token;
  token0Price: Scalars['BigDecimal'];
  token1: Token;
  token1Price: Scalars['BigDecimal'];
  totalSupply: Scalars['BigDecimal'];
  trackedReserveETH: Scalars['BigDecimal'];
  txCount: Scalars['BigInt'];
  untrackedVolumeUSD: Scalars['BigDecimal'];
  volumeToken0: Scalars['BigDecimal'];
  volumeToken1: Scalars['BigDecimal'];
  volumeUSD: Scalars['BigDecimal'];
};

export type PairDayData = {
  __typename?: 'PairDayData';
  dailyTxns: Scalars['BigInt'];
  dailyVolumeToken0: Scalars['BigDecimal'];
  dailyVolumeToken1: Scalars['BigDecimal'];
  dailyVolumeUSD: Scalars['BigDecimal'];
  date: Scalars['Int'];
  id: Scalars['ID'];
  pairAddress: Scalars['Bytes'];
  reserve0: Scalars['BigDecimal'];
  reserve1: Scalars['BigDecimal'];
  reserveUSD: Scalars['BigDecimal'];
  token0: Token;
  token1: Token;
  totalSupply: Scalars['BigDecimal'];
};

export type PairDayData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  dailyTxns?: InputMaybe<Scalars['BigInt']>;
  dailyTxns_gt?: InputMaybe<Scalars['BigInt']>;
  dailyTxns_gte?: InputMaybe<Scalars['BigInt']>;
  dailyTxns_in?: InputMaybe<Array<Scalars['BigInt']>>;
  dailyTxns_lt?: InputMaybe<Scalars['BigInt']>;
  dailyTxns_lte?: InputMaybe<Scalars['BigInt']>;
  dailyTxns_not?: InputMaybe<Scalars['BigInt']>;
  dailyTxns_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  dailyVolumeToken0?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeToken0_gt?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeToken0_gte?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeToken0_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  dailyVolumeToken0_lt?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeToken0_lte?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeToken0_not?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeToken0_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  dailyVolumeToken1?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeToken1_gt?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeToken1_gte?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeToken1_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  dailyVolumeToken1_lt?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeToken1_lte?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeToken1_not?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeToken1_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  dailyVolumeUSD?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  dailyVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  pairAddress?: InputMaybe<Scalars['Bytes']>;
  pairAddress_contains?: InputMaybe<Scalars['Bytes']>;
  pairAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  pairAddress_not?: InputMaybe<Scalars['Bytes']>;
  pairAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  pairAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  reserve0?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserve0_lt?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserve1_lt?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserveUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  token0?: InputMaybe<Scalars['String']>;
  token0_?: InputMaybe<Token_Filter>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1_?: InputMaybe<Token_Filter>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_starts_with_nocase?: InputMaybe<Scalars['String']>;
  totalSupply?: InputMaybe<Scalars['BigDecimal']>;
  totalSupply_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalSupply_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalSupply_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalSupply_not?: InputMaybe<Scalars['BigDecimal']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
};

export enum PairDayData_OrderBy {
  DailyTxns = 'dailyTxns',
  DailyVolumeToken0 = 'dailyVolumeToken0',
  DailyVolumeToken1 = 'dailyVolumeToken1',
  DailyVolumeUsd = 'dailyVolumeUSD',
  Date = 'date',
  Id = 'id',
  PairAddress = 'pairAddress',
  Reserve0 = 'reserve0',
  Reserve1 = 'reserve1',
  ReserveUsd = 'reserveUSD',
  Token0 = 'token0',
  Token1 = 'token1',
<<<<<<< HEAD
  TotalSupply = 'totalSupply',
=======
  TotalSupply = 'totalSupply'
>>>>>>> c15f0091 (chore: update update)
}

export type PairHourData = {
  __typename?: 'PairHourData';
  hourStartUnix: Scalars['Int'];
  hourlyTxns: Scalars['BigInt'];
  hourlyVolumeToken0: Scalars['BigDecimal'];
  hourlyVolumeToken1: Scalars['BigDecimal'];
  hourlyVolumeUSD: Scalars['BigDecimal'];
  id: Scalars['ID'];
  pair: Pair;
  reserve0: Scalars['BigDecimal'];
  reserve1: Scalars['BigDecimal'];
  reserveUSD: Scalars['BigDecimal'];
};

export type PairHourData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  hourStartUnix?: InputMaybe<Scalars['Int']>;
  hourStartUnix_gt?: InputMaybe<Scalars['Int']>;
  hourStartUnix_gte?: InputMaybe<Scalars['Int']>;
  hourStartUnix_in?: InputMaybe<Array<Scalars['Int']>>;
  hourStartUnix_lt?: InputMaybe<Scalars['Int']>;
  hourStartUnix_lte?: InputMaybe<Scalars['Int']>;
  hourStartUnix_not?: InputMaybe<Scalars['Int']>;
  hourStartUnix_not_in?: InputMaybe<Array<Scalars['Int']>>;
  hourlyTxns?: InputMaybe<Scalars['BigInt']>;
  hourlyTxns_gt?: InputMaybe<Scalars['BigInt']>;
  hourlyTxns_gte?: InputMaybe<Scalars['BigInt']>;
  hourlyTxns_in?: InputMaybe<Array<Scalars['BigInt']>>;
  hourlyTxns_lt?: InputMaybe<Scalars['BigInt']>;
  hourlyTxns_lte?: InputMaybe<Scalars['BigInt']>;
  hourlyTxns_not?: InputMaybe<Scalars['BigInt']>;
  hourlyTxns_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  hourlyVolumeToken0?: InputMaybe<Scalars['BigDecimal']>;
  hourlyVolumeToken0_gt?: InputMaybe<Scalars['BigDecimal']>;
  hourlyVolumeToken0_gte?: InputMaybe<Scalars['BigDecimal']>;
  hourlyVolumeToken0_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  hourlyVolumeToken0_lt?: InputMaybe<Scalars['BigDecimal']>;
  hourlyVolumeToken0_lte?: InputMaybe<Scalars['BigDecimal']>;
  hourlyVolumeToken0_not?: InputMaybe<Scalars['BigDecimal']>;
  hourlyVolumeToken0_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  hourlyVolumeToken1?: InputMaybe<Scalars['BigDecimal']>;
  hourlyVolumeToken1_gt?: InputMaybe<Scalars['BigDecimal']>;
  hourlyVolumeToken1_gte?: InputMaybe<Scalars['BigDecimal']>;
  hourlyVolumeToken1_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  hourlyVolumeToken1_lt?: InputMaybe<Scalars['BigDecimal']>;
  hourlyVolumeToken1_lte?: InputMaybe<Scalars['BigDecimal']>;
  hourlyVolumeToken1_not?: InputMaybe<Scalars['BigDecimal']>;
  hourlyVolumeToken1_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  hourlyVolumeUSD?: InputMaybe<Scalars['BigDecimal']>;
  hourlyVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  hourlyVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  hourlyVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  hourlyVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  hourlyVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  hourlyVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  hourlyVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_?: InputMaybe<Pair_Filter>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserve0_lt?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserve1_lt?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserveUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
};

export enum PairHourData_OrderBy {
  HourStartUnix = 'hourStartUnix',
  HourlyTxns = 'hourlyTxns',
  HourlyVolumeToken0 = 'hourlyVolumeToken0',
  HourlyVolumeToken1 = 'hourlyVolumeToken1',
  HourlyVolumeUsd = 'hourlyVolumeUSD',
  Id = 'id',
  Pair = 'pair',
  Reserve0 = 'reserve0',
  Reserve1 = 'reserve1',
<<<<<<< HEAD
  ReserveUsd = 'reserveUSD',
=======
  ReserveUsd = 'reserveUSD'
>>>>>>> c15f0091 (chore: update update)
}

export type Pair_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  createdAtBlockNumber?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_not?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityProviderCount?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_gt?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_gte?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidityProviderCount_lt?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_lte?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_not?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  reserve0?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserve0_lt?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['BigDecimal']>;
  reserve0_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserve1_lt?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['BigDecimal']>;
  reserve1_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserveETH?: InputMaybe<Scalars['BigDecimal']>;
  reserveETH_gt?: InputMaybe<Scalars['BigDecimal']>;
  reserveETH_gte?: InputMaybe<Scalars['BigDecimal']>;
  reserveETH_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserveETH_lt?: InputMaybe<Scalars['BigDecimal']>;
  reserveETH_lte?: InputMaybe<Scalars['BigDecimal']>;
  reserveETH_not?: InputMaybe<Scalars['BigDecimal']>;
  reserveETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reserveUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  token0?: InputMaybe<Scalars['String']>;
  token0Price?: InputMaybe<Scalars['BigDecimal']>;
  token0Price_gt?: InputMaybe<Scalars['BigDecimal']>;
  token0Price_gte?: InputMaybe<Scalars['BigDecimal']>;
  token0Price_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  token0Price_lt?: InputMaybe<Scalars['BigDecimal']>;
  token0Price_lte?: InputMaybe<Scalars['BigDecimal']>;
  token0Price_not?: InputMaybe<Scalars['BigDecimal']>;
  token0Price_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  token0_?: InputMaybe<Token_Filter>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1Price?: InputMaybe<Scalars['BigDecimal']>;
  token1Price_gt?: InputMaybe<Scalars['BigDecimal']>;
  token1Price_gte?: InputMaybe<Scalars['BigDecimal']>;
  token1Price_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  token1Price_lt?: InputMaybe<Scalars['BigDecimal']>;
  token1Price_lte?: InputMaybe<Scalars['BigDecimal']>;
  token1Price_not?: InputMaybe<Scalars['BigDecimal']>;
  token1Price_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  token1_?: InputMaybe<Token_Filter>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_starts_with_nocase?: InputMaybe<Scalars['String']>;
  totalSupply?: InputMaybe<Scalars['BigDecimal']>;
  totalSupply_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalSupply_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalSupply_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalSupply_not?: InputMaybe<Scalars['BigDecimal']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  trackedReserveETH?: InputMaybe<Scalars['BigDecimal']>;
  trackedReserveETH_gt?: InputMaybe<Scalars['BigDecimal']>;
  trackedReserveETH_gte?: InputMaybe<Scalars['BigDecimal']>;
  trackedReserveETH_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  trackedReserveETH_lt?: InputMaybe<Scalars['BigDecimal']>;
  trackedReserveETH_lte?: InputMaybe<Scalars['BigDecimal']>;
  trackedReserveETH_not?: InputMaybe<Scalars['BigDecimal']>;
  trackedReserveETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  volumeToken0_lt?: InputMaybe<Scalars['BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['BigDecimal']>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  volumeToken1_lt?: InputMaybe<Scalars['BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['BigDecimal']>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
};

export enum Pair_OrderBy {
  CreatedAtBlockNumber = 'createdAtBlockNumber',
  CreatedAtTimestamp = 'createdAtTimestamp',
  Id = 'id',
  LiquidityProviderCount = 'liquidityProviderCount',
  Reserve0 = 'reserve0',
  Reserve1 = 'reserve1',
  ReserveEth = 'reserveETH',
  ReserveUsd = 'reserveUSD',
  Token0 = 'token0',
  Token0Price = 'token0Price',
  Token1 = 'token1',
  Token1Price = 'token1Price',
  TotalSupply = 'totalSupply',
  TrackedReserveEth = 'trackedReserveETH',
  TxCount = 'txCount',
  UntrackedVolumeUsd = 'untrackedVolumeUSD',
  VolumeToken0 = 'volumeToken0',
  VolumeToken1 = 'volumeToken1',
<<<<<<< HEAD
  VolumeUsd = 'volumeUSD',
=======
  VolumeUsd = 'volumeUSD'
>>>>>>> c15f0091 (chore: update update)
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  bundle?: Maybe<Bundle>;
  bundles: Array<Bundle>;
  burn?: Maybe<Burn>;
  burns: Array<Burn>;
  liquidityPosition?: Maybe<LiquidityPosition>;
  liquidityPositionSnapshot?: Maybe<LiquidityPositionSnapshot>;
  liquidityPositionSnapshots: Array<LiquidityPositionSnapshot>;
  liquidityPositions: Array<LiquidityPosition>;
  mint?: Maybe<Mint>;
  mints: Array<Mint>;
  pair?: Maybe<Pair>;
  pairDayData?: Maybe<PairDayData>;
  pairDayDatas: Array<PairDayData>;
  pairHourData?: Maybe<PairHourData>;
  pairHourDatas: Array<PairHourData>;
  pairs: Array<Pair>;
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  token?: Maybe<Token>;
  tokenDayData?: Maybe<TokenDayData>;
  tokenDayDatas: Array<TokenDayData>;
  tokens: Array<Token>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  uniswapDayData?: Maybe<UniswapDayData>;
  uniswapDayDatas: Array<UniswapDayData>;
  uniswapFactories: Array<UniswapFactory>;
  uniswapFactory?: Maybe<UniswapFactory>;
  user?: Maybe<User>;
  users: Array<User>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryBundleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryBundlesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Bundle_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Bundle_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryBurnArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryBurnsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Burn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Burn_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryLiquidityPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryLiquidityPositionSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryLiquidityPositionSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPositionSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPositionSnapshot_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryLiquidityPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPosition_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPosition_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryMintArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryMintsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Mint_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Mint_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryPairArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryPairDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryPairDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PairDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PairDayData_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryPairHourDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryPairHourDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PairHourData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PairHourData_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryPairsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Pair_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pair_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QuerySwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QuerySwapsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Swap_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryTokenDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryTokenDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenDayData_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transaction_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryUniswapDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryUniswapDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UniswapDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UniswapDayData_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryUniswapFactoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UniswapFactory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UniswapFactory_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryUniswapFactoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type QueryUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  bundle?: Maybe<Bundle>;
  bundles: Array<Bundle>;
  burn?: Maybe<Burn>;
  burns: Array<Burn>;
  liquidityPosition?: Maybe<LiquidityPosition>;
  liquidityPositionSnapshot?: Maybe<LiquidityPositionSnapshot>;
  liquidityPositionSnapshots: Array<LiquidityPositionSnapshot>;
  liquidityPositions: Array<LiquidityPosition>;
  mint?: Maybe<Mint>;
  mints: Array<Mint>;
  pair?: Maybe<Pair>;
  pairDayData?: Maybe<PairDayData>;
  pairDayDatas: Array<PairDayData>;
  pairHourData?: Maybe<PairHourData>;
  pairHourDatas: Array<PairHourData>;
  pairs: Array<Pair>;
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  token?: Maybe<Token>;
  tokenDayData?: Maybe<TokenDayData>;
  tokenDayDatas: Array<TokenDayData>;
  tokens: Array<Token>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  uniswapDayData?: Maybe<UniswapDayData>;
  uniswapDayDatas: Array<UniswapDayData>;
  uniswapFactories: Array<UniswapFactory>;
  uniswapFactory?: Maybe<UniswapFactory>;
  user?: Maybe<User>;
  users: Array<User>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionBundleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionBundlesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Bundle_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Bundle_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionBurnArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionBurnsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Burn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Burn_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionLiquidityPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionLiquidityPositionSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionLiquidityPositionSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPositionSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPositionSnapshot_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionLiquidityPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPosition_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPosition_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionMintArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionMintsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Mint_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Mint_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionPairArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionPairDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionPairDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PairDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PairDayData_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionPairHourDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionPairHourDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PairHourData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PairHourData_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionPairsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Pair_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pair_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionSwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionSwapsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Swap_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionTokenDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionTokenDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenDayData_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transaction_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionUniswapDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionUniswapDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UniswapDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UniswapDayData_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionUniswapFactoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UniswapFactory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UniswapFactory_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionUniswapFactoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type SubscriptionUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type Swap = {
  __typename?: 'Swap';
  amount0In: Scalars['BigDecimal'];
  amount0Out: Scalars['BigDecimal'];
  amount1In: Scalars['BigDecimal'];
  amount1Out: Scalars['BigDecimal'];
  amountUSD: Scalars['BigDecimal'];
  id: Scalars['ID'];
  logIndex?: Maybe<Scalars['BigInt']>;
  pair: Pair;
  sender: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  to: Scalars['Bytes'];
  transaction: Transaction;
};

export type Swap_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount0In?: InputMaybe<Scalars['BigDecimal']>;
  amount0In_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount0In_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount0In_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount0In_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount0In_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount0In_not?: InputMaybe<Scalars['BigDecimal']>;
  amount0In_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount0Out?: InputMaybe<Scalars['BigDecimal']>;
  amount0Out_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount0Out_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount0Out_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount0Out_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount0Out_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount0Out_not?: InputMaybe<Scalars['BigDecimal']>;
  amount0Out_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount1In?: InputMaybe<Scalars['BigDecimal']>;
  amount1In_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount1In_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount1In_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount1In_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount1In_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount1In_not?: InputMaybe<Scalars['BigDecimal']>;
  amount1In_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount1Out?: InputMaybe<Scalars['BigDecimal']>;
  amount1Out_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount1Out_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount1Out_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount1Out_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount1Out_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount1Out_not?: InputMaybe<Scalars['BigDecimal']>;
  amount1Out_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amountUSD?: InputMaybe<Scalars['BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amountUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_?: InputMaybe<Pair_Filter>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  sender?: InputMaybe<Scalars['Bytes']>;
  sender_contains?: InputMaybe<Scalars['Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  sender_not?: InputMaybe<Scalars['Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  to?: InputMaybe<Scalars['Bytes']>;
  to_contains?: InputMaybe<Scalars['Bytes']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_not?: InputMaybe<Scalars['Bytes']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Swap_OrderBy {
  Amount0In = 'amount0In',
  Amount0Out = 'amount0Out',
  Amount1In = 'amount1In',
  Amount1Out = 'amount1Out',
  AmountUsd = 'amountUSD',
  Id = 'id',
  LogIndex = 'logIndex',
  Pair = 'pair',
  Sender = 'sender',
  Timestamp = 'timestamp',
  To = 'to',
<<<<<<< HEAD
  Transaction = 'transaction',
=======
  Transaction = 'transaction'
>>>>>>> c15f0091 (chore: update update)
}

export type Token = {
  __typename?: 'Token';
  decimals: Scalars['BigInt'];
  derivedETH?: Maybe<Scalars['BigDecimal']>;
  id: Scalars['ID'];
  mostLiquidPairs: Array<Maybe<PairDayData>>;
  name: Scalars['String'];
  symbol: Scalars['String'];
  totalLiquidity: Scalars['BigDecimal'];
  totalSupply: Scalars['BigInt'];
  tradeVolume: Scalars['BigDecimal'];
  tradeVolumeUSD: Scalars['BigDecimal'];
  txCount: Scalars['BigInt'];
  untrackedVolumeUSD: Scalars['BigDecimal'];
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type TokenMostLiquidPairsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PairDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PairDayData_Filter>;
};

export type TokenDayData = {
  __typename?: 'TokenDayData';
  dailyTxns: Scalars['BigInt'];
  dailyVolumeETH: Scalars['BigDecimal'];
  dailyVolumeToken: Scalars['BigDecimal'];
  dailyVolumeUSD: Scalars['BigDecimal'];
  date: Scalars['Int'];
  id: Scalars['ID'];
  maxStored: Scalars['Int'];
  mostLiquidPairs: Array<PairDayData>;
  priceUSD: Scalars['BigDecimal'];
  token: Token;
  totalLiquidityETH: Scalars['BigDecimal'];
  totalLiquidityToken: Scalars['BigDecimal'];
  totalLiquidityUSD: Scalars['BigDecimal'];
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type TokenDayDataMostLiquidPairsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PairDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PairDayData_Filter>;
};

export type TokenDayData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  dailyTxns?: InputMaybe<Scalars['BigInt']>;
  dailyTxns_gt?: InputMaybe<Scalars['BigInt']>;
  dailyTxns_gte?: InputMaybe<Scalars['BigInt']>;
  dailyTxns_in?: InputMaybe<Array<Scalars['BigInt']>>;
  dailyTxns_lt?: InputMaybe<Scalars['BigInt']>;
  dailyTxns_lte?: InputMaybe<Scalars['BigInt']>;
  dailyTxns_not?: InputMaybe<Scalars['BigInt']>;
  dailyTxns_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  dailyVolumeETH?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeETH_gt?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeETH_gte?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeETH_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  dailyVolumeETH_lt?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeETH_lte?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeETH_not?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  dailyVolumeToken?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeToken_gt?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeToken_gte?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeToken_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  dailyVolumeToken_lt?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeToken_lte?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeToken_not?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeToken_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  dailyVolumeUSD?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  dailyVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  maxStored?: InputMaybe<Scalars['Int']>;
  maxStored_gt?: InputMaybe<Scalars['Int']>;
  maxStored_gte?: InputMaybe<Scalars['Int']>;
  maxStored_in?: InputMaybe<Array<Scalars['Int']>>;
  maxStored_lt?: InputMaybe<Scalars['Int']>;
  maxStored_lte?: InputMaybe<Scalars['Int']>;
  maxStored_not?: InputMaybe<Scalars['Int']>;
  maxStored_not_in?: InputMaybe<Array<Scalars['Int']>>;
  mostLiquidPairs?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidPairs_?: InputMaybe<PairDayData_Filter>;
  mostLiquidPairs_contains?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidPairs_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidPairs_not?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidPairs_not_contains?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidPairs_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  priceUSD?: InputMaybe<Scalars['BigDecimal']>;
  priceUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  priceUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  priceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  priceUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  priceUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  priceUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  token?: InputMaybe<Scalars['String']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
  totalLiquidityETH?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityETH_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityETH_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityETH_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidityETH_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityETH_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityETH_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidityToken?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityToken_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityToken_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityToken_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidityToken_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityToken_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityToken_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityToken_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidityUSD?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
};

export enum TokenDayData_OrderBy {
  DailyTxns = 'dailyTxns',
  DailyVolumeEth = 'dailyVolumeETH',
  DailyVolumeToken = 'dailyVolumeToken',
  DailyVolumeUsd = 'dailyVolumeUSD',
  Date = 'date',
  Id = 'id',
  MaxStored = 'maxStored',
  MostLiquidPairs = 'mostLiquidPairs',
  PriceUsd = 'priceUSD',
  Token = 'token',
  TotalLiquidityEth = 'totalLiquidityETH',
  TotalLiquidityToken = 'totalLiquidityToken',
<<<<<<< HEAD
  TotalLiquidityUsd = 'totalLiquidityUSD',
=======
  TotalLiquidityUsd = 'totalLiquidityUSD'
>>>>>>> c15f0091 (chore: update update)
}

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  decimals?: InputMaybe<Scalars['BigInt']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']>>;
  decimals_lt?: InputMaybe<Scalars['BigInt']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']>;
  decimals_not?: InputMaybe<Scalars['BigInt']>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  derivedETH?: InputMaybe<Scalars['BigDecimal']>;
  derivedETH_gt?: InputMaybe<Scalars['BigDecimal']>;
  derivedETH_gte?: InputMaybe<Scalars['BigDecimal']>;
  derivedETH_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  derivedETH_lt?: InputMaybe<Scalars['BigDecimal']>;
  derivedETH_lte?: InputMaybe<Scalars['BigDecimal']>;
  derivedETH_not?: InputMaybe<Scalars['BigDecimal']>;
  derivedETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  mostLiquidPairs?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidPairs_?: InputMaybe<PairDayData_Filter>;
  mostLiquidPairs_contains?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidPairs_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidPairs_not?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidPairs_not_contains?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidPairs_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
  totalLiquidity?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidity_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidity_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidity_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidity_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidity_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidity_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalSupply?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tradeVolume?: InputMaybe<Scalars['BigDecimal']>;
  tradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']>;
  tradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  tradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  tradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  tradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  tradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  tradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  tradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  tradeVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  tradeVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  tradeVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  tradeVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  tradeVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  tradeVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  tradeVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
};

export enum Token_OrderBy {
  Decimals = 'decimals',
  DerivedEth = 'derivedETH',
  Id = 'id',
  MostLiquidPairs = 'mostLiquidPairs',
  Name = 'name',
  Symbol = 'symbol',
  TotalLiquidity = 'totalLiquidity',
  TotalSupply = 'totalSupply',
  TradeVolume = 'tradeVolume',
  TradeVolumeUsd = 'tradeVolumeUSD',
  TxCount = 'txCount',
<<<<<<< HEAD
  UntrackedVolumeUsd = 'untrackedVolumeUSD',
=======
  UntrackedVolumeUsd = 'untrackedVolumeUSD'
>>>>>>> c15f0091 (chore: update update)
}

export type Transaction = {
  __typename?: 'Transaction';
  blockNumber: Scalars['BigInt'];
  burns: Array<Maybe<Burn>>;
  id: Scalars['ID'];
  mints: Array<Maybe<Mint>>;
  swaps: Array<Maybe<Swap>>;
  timestamp: Scalars['BigInt'];
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type TransactionBurnsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Burn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Burn_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type TransactionMintsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Mint_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Mint_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type TransactionSwapsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Swap_Filter>;
};

export type Transaction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  burns?: InputMaybe<Array<Scalars['String']>>;
  burns_?: InputMaybe<Burn_Filter>;
  burns_contains?: InputMaybe<Array<Scalars['String']>>;
  burns_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  burns_not?: InputMaybe<Array<Scalars['String']>>;
  burns_not_contains?: InputMaybe<Array<Scalars['String']>>;
  burns_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  mints?: InputMaybe<Array<Scalars['String']>>;
  mints_?: InputMaybe<Mint_Filter>;
  mints_contains?: InputMaybe<Array<Scalars['String']>>;
  mints_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  mints_not?: InputMaybe<Array<Scalars['String']>>;
  mints_not_contains?: InputMaybe<Array<Scalars['String']>>;
  mints_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  swaps?: InputMaybe<Array<Scalars['String']>>;
  swaps_?: InputMaybe<Swap_Filter>;
  swaps_contains?: InputMaybe<Array<Scalars['String']>>;
  swaps_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  swaps_not?: InputMaybe<Array<Scalars['String']>>;
  swaps_not_contains?: InputMaybe<Array<Scalars['String']>>;
  swaps_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Transaction_OrderBy {
  BlockNumber = 'blockNumber',
  Burns = 'burns',
  Id = 'id',
  Mints = 'mints',
  Swaps = 'swaps',
<<<<<<< HEAD
  Timestamp = 'timestamp',
=======
  Timestamp = 'timestamp'
>>>>>>> c15f0091 (chore: update update)
}

export type UniswapDayData = {
  __typename?: 'UniswapDayData';
  dailyVolumeETH: Scalars['BigDecimal'];
  dailyVolumeUSD: Scalars['BigDecimal'];
  dailyVolumeUntracked: Scalars['BigDecimal'];
  date: Scalars['Int'];
  id: Scalars['ID'];
  maxStored?: Maybe<Scalars['Int']>;
  mostLiquidTokens: Array<TokenDayData>;
  totalLiquidityETH: Scalars['BigDecimal'];
  totalLiquidityUSD: Scalars['BigDecimal'];
  totalVolumeETH: Scalars['BigDecimal'];
  totalVolumeUSD: Scalars['BigDecimal'];
  txCount: Scalars['BigInt'];
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type UniswapDayDataMostLiquidTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TokenDayData_Filter>;
};

export type UniswapDayData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  dailyVolumeETH?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeETH_gt?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeETH_gte?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeETH_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  dailyVolumeETH_lt?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeETH_lte?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeETH_not?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  dailyVolumeUSD?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  dailyVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  dailyVolumeUntracked?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUntracked_gt?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUntracked_gte?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUntracked_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  dailyVolumeUntracked_lt?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUntracked_lte?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUntracked_not?: InputMaybe<Scalars['BigDecimal']>;
  dailyVolumeUntracked_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  maxStored?: InputMaybe<Scalars['Int']>;
  maxStored_gt?: InputMaybe<Scalars['Int']>;
  maxStored_gte?: InputMaybe<Scalars['Int']>;
  maxStored_in?: InputMaybe<Array<Scalars['Int']>>;
  maxStored_lt?: InputMaybe<Scalars['Int']>;
  maxStored_lte?: InputMaybe<Scalars['Int']>;
  maxStored_not?: InputMaybe<Scalars['Int']>;
  maxStored_not_in?: InputMaybe<Array<Scalars['Int']>>;
  mostLiquidTokens?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidTokens_?: InputMaybe<TokenDayData_Filter>;
  mostLiquidTokens_contains?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidTokens_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidTokens_not?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidTokens_not_contains?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidTokens_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  totalLiquidityETH?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityETH_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityETH_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityETH_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidityETH_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityETH_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityETH_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidityUSD?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVolumeETH?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeETH_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeETH_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeETH_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVolumeETH_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeETH_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeETH_not?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVolumeUSD?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum UniswapDayData_OrderBy {
  DailyVolumeEth = 'dailyVolumeETH',
  DailyVolumeUsd = 'dailyVolumeUSD',
  DailyVolumeUntracked = 'dailyVolumeUntracked',
  Date = 'date',
  Id = 'id',
  MaxStored = 'maxStored',
  MostLiquidTokens = 'mostLiquidTokens',
  TotalLiquidityEth = 'totalLiquidityETH',
  TotalLiquidityUsd = 'totalLiquidityUSD',
  TotalVolumeEth = 'totalVolumeETH',
  TotalVolumeUsd = 'totalVolumeUSD',
<<<<<<< HEAD
  TxCount = 'txCount',
=======
  TxCount = 'txCount'
>>>>>>> c15f0091 (chore: update update)
}

export type UniswapFactory = {
  __typename?: 'UniswapFactory';
  id: Scalars['ID'];
  mostLiquidTokens: Array<TokenDayData>;
  pairCount: Scalars['Int'];
  totalLiquidityETH: Scalars['BigDecimal'];
  totalLiquidityUSD: Scalars['BigDecimal'];
  totalVolumeETH: Scalars['BigDecimal'];
  totalVolumeUSD: Scalars['BigDecimal'];
  txCount: Scalars['BigInt'];
  untrackedVolumeUSD: Scalars['BigDecimal'];
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type UniswapFactoryMostLiquidTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TokenDayData_Filter>;
};

export type UniswapFactory_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  mostLiquidTokens?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidTokens_?: InputMaybe<TokenDayData_Filter>;
  mostLiquidTokens_contains?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidTokens_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidTokens_not?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidTokens_not_contains?: InputMaybe<Array<Scalars['String']>>;
  mostLiquidTokens_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  pairCount?: InputMaybe<Scalars['Int']>;
  pairCount_gt?: InputMaybe<Scalars['Int']>;
  pairCount_gte?: InputMaybe<Scalars['Int']>;
  pairCount_in?: InputMaybe<Array<Scalars['Int']>>;
  pairCount_lt?: InputMaybe<Scalars['Int']>;
  pairCount_lte?: InputMaybe<Scalars['Int']>;
  pairCount_not?: InputMaybe<Scalars['Int']>;
  pairCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  totalLiquidityETH?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityETH_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityETH_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityETH_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidityETH_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityETH_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityETH_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidityUSD?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVolumeETH?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeETH_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeETH_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeETH_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVolumeETH_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeETH_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeETH_not?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVolumeUSD?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
};

export enum UniswapFactory_OrderBy {
  Id = 'id',
  MostLiquidTokens = 'mostLiquidTokens',
  PairCount = 'pairCount',
  TotalLiquidityEth = 'totalLiquidityETH',
  TotalLiquidityUsd = 'totalLiquidityUSD',
  TotalVolumeEth = 'totalVolumeETH',
  TotalVolumeUsd = 'totalVolumeUSD',
  TxCount = 'txCount',
<<<<<<< HEAD
  UntrackedVolumeUsd = 'untrackedVolumeUSD',
=======
  UntrackedVolumeUsd = 'untrackedVolumeUSD'
>>>>>>> c15f0091 (chore: update update)
}

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  liquidityPositions?: Maybe<Array<LiquidityPosition>>;
  usdSwapped: Scalars['BigDecimal'];
};

<<<<<<< HEAD
=======

>>>>>>> c15f0091 (chore: update update)
export type UserLiquidityPositionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPosition_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LiquidityPosition_Filter>;
};

export type User_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityPositions_?: InputMaybe<LiquidityPosition_Filter>;
  usdSwapped?: InputMaybe<Scalars['BigDecimal']>;
  usdSwapped_gt?: InputMaybe<Scalars['BigDecimal']>;
  usdSwapped_gte?: InputMaybe<Scalars['BigDecimal']>;
  usdSwapped_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  usdSwapped_lt?: InputMaybe<Scalars['BigDecimal']>;
  usdSwapped_lte?: InputMaybe<Scalars['BigDecimal']>;
  usdSwapped_not?: InputMaybe<Scalars['BigDecimal']>;
  usdSwapped_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
};

export enum User_OrderBy {
  Id = 'id',
  LiquidityPositions = 'liquidityPositions',
<<<<<<< HEAD
  UsdSwapped = 'usdSwapped',
=======
  UsdSwapped = 'usdSwapped'
>>>>>>> c15f0091 (chore: update update)
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
<<<<<<< HEAD
  Deny = 'deny',
}

export const UniPairDayDataFragmentDoc = gql`
  fragment UniPairDayData on PairDayData {
    token0 {
      id
    }
    token1 {
      id
    }
    reserve0
    reserve1
    reserveUSD
    dailyVolumeToken0
    dailyVolumeToken1
  }
`;
export const UniV2PairFragmentDoc = gql`
  fragment UniV2Pair on Pair {
    id
    reserve0
    reserve1
    token0 {
      id
      symbol
      name
      decimals
    }
    token1 {
      id
      symbol
      name
      decimals
    }
    totalSupply
  }
`;
export const UniPairDayDatasDocument = gql`
  query UniPairDayDatas(
    $first: Int
    $where: PairDayData_filter
    $orderBy: PairDayData_orderBy
    $orderDirection: OrderDirection
  ) {
    pairDayDatas(first: $first, where: $where, orderBy: $orderBy, orderDirection: $orderDirection) {
      ...UniPairDayData
    }
  }
  ${UniPairDayDataFragmentDoc}
`;
export const UniV2PairDocument = gql`
  query UniV2Pair($id: ID!, $block: Block_height) {
    pair(id: $id, block: $block) {
      ...UniV2Pair
    }
  }
  ${UniV2PairFragmentDoc}
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
) => Promise<T>;
=======
  Deny = 'deny'
}

export const UniPairDayDataFragmentDoc = gql`
    fragment UniPairDayData on PairDayData {
  token0 {
    id
  }
  token1 {
    id
  }
  reserve0
  reserve1
  reserveUSD
  dailyVolumeToken0
  dailyVolumeToken1
}
    `;
export const UniV2PairFragmentDoc = gql`
    fragment UniV2Pair on Pair {
  id
  reserve0
  reserve1
  token0 {
    id
    symbol
    name
    decimals
  }
  token1 {
    id
    symbol
    name
    decimals
  }
  totalSupply
}
    `;
export const UniPairDayDatasDocument = gql`
    query UniPairDayDatas($first: Int, $where: PairDayData_filter, $orderBy: PairDayData_orderBy, $orderDirection: OrderDirection) {
  pairDayDatas(
    first: $first
    where: $where
    orderBy: $orderBy
    orderDirection: $orderDirection
  ) {
    ...UniPairDayData
  }
}
    ${UniPairDayDataFragmentDoc}`;
export const UniV2PairDocument = gql`
    query UniV2Pair($id: ID!, $block: Block_height) {
  pair(id: $id, block: $block) {
    ...UniV2Pair
  }
}
    ${UniV2PairFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;

>>>>>>> c15f0091 (chore: update update)

const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
<<<<<<< HEAD
    UniPairDayDatas(
      variables?: UniPairDayDatasQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<UniPairDayDatasQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UniPairDayDatasQuery>(UniPairDayDatasDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'UniPairDayDatas',
        'query',
      );
    },
    UniV2Pair(
      variables: UniV2PairQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<UniV2PairQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UniV2PairQuery>(UniV2PairDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }),
        'UniV2Pair',
        'query',
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export type UniPairDayDataFragment = {
  __typename?: 'PairDayData';
  reserve0: any;
  reserve1: any;
  reserveUSD: any;
  dailyVolumeToken0: any;
  dailyVolumeToken1: any;
  token0: { __typename?: 'Token'; id: string };
  token1: { __typename?: 'Token'; id: string };
};

export type UniV2PairFragment = {
  __typename?: 'Pair';
  id: string;
  reserve0: any;
  reserve1: any;
  totalSupply: any;
  token0: { __typename?: 'Token'; id: string; symbol: string; name: string; decimals: any };
  token1: { __typename?: 'Token'; id: string; symbol: string; name: string; decimals: any };
};
=======
    UniPairDayDatas(variables?: UniPairDayDatasQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UniPairDayDatasQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UniPairDayDatasQuery>(UniPairDayDatasDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UniPairDayDatas', 'query');
    },
    UniV2Pair(variables: UniV2PairQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UniV2PairQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UniV2PairQuery>(UniV2PairDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UniV2Pair', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export type UniPairDayDataFragment = { __typename?: 'PairDayData', reserve0: any, reserve1: any, reserveUSD: any, dailyVolumeToken0: any, dailyVolumeToken1: any, token0: { __typename?: 'Token', id: string }, token1: { __typename?: 'Token', id: string } };

export type UniV2PairFragment = { __typename?: 'Pair', id: string, reserve0: any, reserve1: any, totalSupply: any, token0: { __typename?: 'Token', id: string, symbol: string, name: string, decimals: any }, token1: { __typename?: 'Token', id: string, symbol: string, name: string, decimals: any } };
>>>>>>> c15f0091 (chore: update update)

export type UniPairDayDatasQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PairDayData_Filter>;
  orderBy?: InputMaybe<PairDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

<<<<<<< HEAD
export type UniPairDayDatasQuery = {
  __typename?: 'Query';
  pairDayDatas: Array<{
    __typename?: 'PairDayData';
    reserve0: any;
    reserve1: any;
    reserveUSD: any;
    dailyVolumeToken0: any;
    dailyVolumeToken1: any;
    token0: { __typename?: 'Token'; id: string };
    token1: { __typename?: 'Token'; id: string };
  }>;
};
=======

export type UniPairDayDatasQuery = { __typename?: 'Query', pairDayDatas: Array<{ __typename?: 'PairDayData', reserve0: any, reserve1: any, reserveUSD: any, dailyVolumeToken0: any, dailyVolumeToken1: any, token0: { __typename?: 'Token', id: string }, token1: { __typename?: 'Token', id: string } }> };
>>>>>>> c15f0091 (chore: update update)

export type UniV2PairQueryVariables = Exact<{
  id: Scalars['ID'];
  block?: InputMaybe<Block_Height>;
}>;

<<<<<<< HEAD
export type UniV2PairQuery = {
  __typename?: 'Query';
  pair?: {
    __typename?: 'Pair';
    id: string;
    reserve0: any;
    reserve1: any;
    totalSupply: any;
    token0: { __typename?: 'Token'; id: string; symbol: string; name: string; decimals: any };
    token1: { __typename?: 'Token'; id: string; symbol: string; name: string; decimals: any };
  } | null;
};
=======

export type UniV2PairQuery = { __typename?: 'Query', pair?: { __typename?: 'Pair', id: string, reserve0: any, reserve1: any, totalSupply: any, token0: { __typename?: 'Token', id: string, symbol: string, name: string, decimals: any }, token1: { __typename?: 'Token', id: string, symbol: string, name: string, decimals: any } } | null };
>>>>>>> c15f0091 (chore: update update)
