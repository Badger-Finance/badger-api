import { print } from 'graphql';
import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
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

export type Block_Height = {
	hash?: Maybe<Scalars['Bytes']>;
	number?: Maybe<Scalars['Int']>;
};

export type Geyser = {
	__typename?: 'Geyser';
	id: Scalars['ID'];
	/** Current sett deposit share value */
	netShareDeposit: Scalars['BigInt'];
	/** Total sett deposit share value */
	grossShareDeposit: Scalars['BigInt'];
	/** Total sett withdraw share value */
	grossShareWithdraw: Scalars['BigInt'];
	stakingToken: Token;
	rewardToken: Token;
	badgerCycleRewardTokens: Scalars['BigInt'];
	badgerCycleDuration: Scalars['BigInt'];
	diggCycleRewardTokens: Scalars['BigInt'];
	diggCycleDuration: Scalars['BigInt'];
};

export type Geyser_Filter = {
	id?: Maybe<Scalars['ID']>;
	id_not?: Maybe<Scalars['ID']>;
	id_gt?: Maybe<Scalars['ID']>;
	id_lt?: Maybe<Scalars['ID']>;
	id_gte?: Maybe<Scalars['ID']>;
	id_lte?: Maybe<Scalars['ID']>;
	id_in?: Maybe<Array<Scalars['ID']>>;
	id_not_in?: Maybe<Array<Scalars['ID']>>;
	netShareDeposit?: Maybe<Scalars['BigInt']>;
	netShareDeposit_not?: Maybe<Scalars['BigInt']>;
	netShareDeposit_gt?: Maybe<Scalars['BigInt']>;
	netShareDeposit_lt?: Maybe<Scalars['BigInt']>;
	netShareDeposit_gte?: Maybe<Scalars['BigInt']>;
	netShareDeposit_lte?: Maybe<Scalars['BigInt']>;
	netShareDeposit_in?: Maybe<Array<Scalars['BigInt']>>;
	netShareDeposit_not_in?: Maybe<Array<Scalars['BigInt']>>;
	grossShareDeposit?: Maybe<Scalars['BigInt']>;
	grossShareDeposit_not?: Maybe<Scalars['BigInt']>;
	grossShareDeposit_gt?: Maybe<Scalars['BigInt']>;
	grossShareDeposit_lt?: Maybe<Scalars['BigInt']>;
	grossShareDeposit_gte?: Maybe<Scalars['BigInt']>;
	grossShareDeposit_lte?: Maybe<Scalars['BigInt']>;
	grossShareDeposit_in?: Maybe<Array<Scalars['BigInt']>>;
	grossShareDeposit_not_in?: Maybe<Array<Scalars['BigInt']>>;
	grossShareWithdraw?: Maybe<Scalars['BigInt']>;
	grossShareWithdraw_not?: Maybe<Scalars['BigInt']>;
	grossShareWithdraw_gt?: Maybe<Scalars['BigInt']>;
	grossShareWithdraw_lt?: Maybe<Scalars['BigInt']>;
	grossShareWithdraw_gte?: Maybe<Scalars['BigInt']>;
	grossShareWithdraw_lte?: Maybe<Scalars['BigInt']>;
	grossShareWithdraw_in?: Maybe<Array<Scalars['BigInt']>>;
	grossShareWithdraw_not_in?: Maybe<Array<Scalars['BigInt']>>;
	stakingToken?: Maybe<Scalars['String']>;
	stakingToken_not?: Maybe<Scalars['String']>;
	stakingToken_gt?: Maybe<Scalars['String']>;
	stakingToken_lt?: Maybe<Scalars['String']>;
	stakingToken_gte?: Maybe<Scalars['String']>;
	stakingToken_lte?: Maybe<Scalars['String']>;
	stakingToken_in?: Maybe<Array<Scalars['String']>>;
	stakingToken_not_in?: Maybe<Array<Scalars['String']>>;
	stakingToken_contains?: Maybe<Scalars['String']>;
	stakingToken_not_contains?: Maybe<Scalars['String']>;
	stakingToken_starts_with?: Maybe<Scalars['String']>;
	stakingToken_not_starts_with?: Maybe<Scalars['String']>;
	stakingToken_ends_with?: Maybe<Scalars['String']>;
	stakingToken_not_ends_with?: Maybe<Scalars['String']>;
	rewardToken?: Maybe<Scalars['String']>;
	rewardToken_not?: Maybe<Scalars['String']>;
	rewardToken_gt?: Maybe<Scalars['String']>;
	rewardToken_lt?: Maybe<Scalars['String']>;
	rewardToken_gte?: Maybe<Scalars['String']>;
	rewardToken_lte?: Maybe<Scalars['String']>;
	rewardToken_in?: Maybe<Array<Scalars['String']>>;
	rewardToken_not_in?: Maybe<Array<Scalars['String']>>;
	rewardToken_contains?: Maybe<Scalars['String']>;
	rewardToken_not_contains?: Maybe<Scalars['String']>;
	rewardToken_starts_with?: Maybe<Scalars['String']>;
	rewardToken_not_starts_with?: Maybe<Scalars['String']>;
	rewardToken_ends_with?: Maybe<Scalars['String']>;
	rewardToken_not_ends_with?: Maybe<Scalars['String']>;
	badgerCycleRewardTokens?: Maybe<Scalars['BigInt']>;
	badgerCycleRewardTokens_not?: Maybe<Scalars['BigInt']>;
	badgerCycleRewardTokens_gt?: Maybe<Scalars['BigInt']>;
	badgerCycleRewardTokens_lt?: Maybe<Scalars['BigInt']>;
	badgerCycleRewardTokens_gte?: Maybe<Scalars['BigInt']>;
	badgerCycleRewardTokens_lte?: Maybe<Scalars['BigInt']>;
	badgerCycleRewardTokens_in?: Maybe<Array<Scalars['BigInt']>>;
	badgerCycleRewardTokens_not_in?: Maybe<Array<Scalars['BigInt']>>;
	badgerCycleDuration?: Maybe<Scalars['BigInt']>;
	badgerCycleDuration_not?: Maybe<Scalars['BigInt']>;
	badgerCycleDuration_gt?: Maybe<Scalars['BigInt']>;
	badgerCycleDuration_lt?: Maybe<Scalars['BigInt']>;
	badgerCycleDuration_gte?: Maybe<Scalars['BigInt']>;
	badgerCycleDuration_lte?: Maybe<Scalars['BigInt']>;
	badgerCycleDuration_in?: Maybe<Array<Scalars['BigInt']>>;
	badgerCycleDuration_not_in?: Maybe<Array<Scalars['BigInt']>>;
	diggCycleRewardTokens?: Maybe<Scalars['BigInt']>;
	diggCycleRewardTokens_not?: Maybe<Scalars['BigInt']>;
	diggCycleRewardTokens_gt?: Maybe<Scalars['BigInt']>;
	diggCycleRewardTokens_lt?: Maybe<Scalars['BigInt']>;
	diggCycleRewardTokens_gte?: Maybe<Scalars['BigInt']>;
	diggCycleRewardTokens_lte?: Maybe<Scalars['BigInt']>;
	diggCycleRewardTokens_in?: Maybe<Array<Scalars['BigInt']>>;
	diggCycleRewardTokens_not_in?: Maybe<Array<Scalars['BigInt']>>;
	diggCycleDuration?: Maybe<Scalars['BigInt']>;
	diggCycleDuration_not?: Maybe<Scalars['BigInt']>;
	diggCycleDuration_gt?: Maybe<Scalars['BigInt']>;
	diggCycleDuration_lt?: Maybe<Scalars['BigInt']>;
	diggCycleDuration_gte?: Maybe<Scalars['BigInt']>;
	diggCycleDuration_lte?: Maybe<Scalars['BigInt']>;
	diggCycleDuration_in?: Maybe<Array<Scalars['BigInt']>>;
	diggCycleDuration_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Geyser_OrderBy {
	Id = 'id',
	NetShareDeposit = 'netShareDeposit',
	GrossShareDeposit = 'grossShareDeposit',
	GrossShareWithdraw = 'grossShareWithdraw',
	StakingToken = 'stakingToken',
	RewardToken = 'rewardToken',
	BadgerCycleRewardTokens = 'badgerCycleRewardTokens',
	BadgerCycleDuration = 'badgerCycleDuration',
	DiggCycleRewardTokens = 'diggCycleRewardTokens',
	DiggCycleDuration = 'diggCycleDuration',
}

export enum OrderDirection {
	Asc = 'asc',
	Desc = 'desc',
}

export type Query = {
	__typename?: 'Query';
	user?: Maybe<User>;
	users: Array<User>;
	sett?: Maybe<Sett>;
	setts: Array<Sett>;
	userSettBalance?: Maybe<UserSettBalance>;
	userSettBalances: Array<UserSettBalance>;
	token?: Maybe<Token>;
	tokens: Array<Token>;
	geyser?: Maybe<Geyser>;
	geysers: Array<Geyser>;
	/** Access to subgraph metadata */
	_meta?: Maybe<_Meta_>;
};

export type QueryUserArgs = {
	id: Scalars['ID'];
	block?: Maybe<Block_Height>;
};

export type QueryUsersArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<User_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<User_Filter>;
	block?: Maybe<Block_Height>;
};

export type QuerySettArgs = {
	id: Scalars['ID'];
	block?: Maybe<Block_Height>;
};

export type QuerySettsArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<Sett_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<Sett_Filter>;
	block?: Maybe<Block_Height>;
};

export type QueryUserSettBalanceArgs = {
	id: Scalars['ID'];
	block?: Maybe<Block_Height>;
};

export type QueryUserSettBalancesArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<UserSettBalance_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<UserSettBalance_Filter>;
	block?: Maybe<Block_Height>;
};

export type QueryTokenArgs = {
	id: Scalars['ID'];
	block?: Maybe<Block_Height>;
};

export type QueryTokensArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<Token_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<Token_Filter>;
	block?: Maybe<Block_Height>;
};

export type QueryGeyserArgs = {
	id: Scalars['ID'];
	block?: Maybe<Block_Height>;
};

export type QueryGeysersArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<Geyser_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<Geyser_Filter>;
	block?: Maybe<Block_Height>;
};

export type Query_MetaArgs = {
	block?: Maybe<Block_Height>;
};

export type Sett = {
	__typename?: 'Sett';
	id: Scalars['ID'];
	/** Sett name */
	name: Scalars['String'];
	/** Share token symbol */
	symbol: Scalars['String'];
	/** Deposit token */
	token: Token;
	/** Deposit token per share */
	pricePerFullShare: Scalars['BigInt'];
	/** Shares outstanding */
	balance: Scalars['BigInt'];
	/** Deposit tokens outstanding */
	totalSupply: Scalars['BigInt'];
	/** Current sett deposit token value */
	netDeposit: Scalars['BigInt'];
	/** Total sett deposit token value */
	grossDeposit: Scalars['BigInt'];
	/** Total sett withdraw token value */
	grossWithdraw: Scalars['BigInt'];
	/** Current sett deposit share value */
	netShareDeposit: Scalars['BigInt'];
	/** Total sett deposit share value */
	grossShareDeposit: Scalars['BigInt'];
	/** Total sett withdraw share value */
	grossShareWithdraw: Scalars['BigInt'];
};

export type Sett_Filter = {
	id?: Maybe<Scalars['ID']>;
	id_not?: Maybe<Scalars['ID']>;
	id_gt?: Maybe<Scalars['ID']>;
	id_lt?: Maybe<Scalars['ID']>;
	id_gte?: Maybe<Scalars['ID']>;
	id_lte?: Maybe<Scalars['ID']>;
	id_in?: Maybe<Array<Scalars['ID']>>;
	id_not_in?: Maybe<Array<Scalars['ID']>>;
	name?: Maybe<Scalars['String']>;
	name_not?: Maybe<Scalars['String']>;
	name_gt?: Maybe<Scalars['String']>;
	name_lt?: Maybe<Scalars['String']>;
	name_gte?: Maybe<Scalars['String']>;
	name_lte?: Maybe<Scalars['String']>;
	name_in?: Maybe<Array<Scalars['String']>>;
	name_not_in?: Maybe<Array<Scalars['String']>>;
	name_contains?: Maybe<Scalars['String']>;
	name_not_contains?: Maybe<Scalars['String']>;
	name_starts_with?: Maybe<Scalars['String']>;
	name_not_starts_with?: Maybe<Scalars['String']>;
	name_ends_with?: Maybe<Scalars['String']>;
	name_not_ends_with?: Maybe<Scalars['String']>;
	symbol?: Maybe<Scalars['String']>;
	symbol_not?: Maybe<Scalars['String']>;
	symbol_gt?: Maybe<Scalars['String']>;
	symbol_lt?: Maybe<Scalars['String']>;
	symbol_gte?: Maybe<Scalars['String']>;
	symbol_lte?: Maybe<Scalars['String']>;
	symbol_in?: Maybe<Array<Scalars['String']>>;
	symbol_not_in?: Maybe<Array<Scalars['String']>>;
	symbol_contains?: Maybe<Scalars['String']>;
	symbol_not_contains?: Maybe<Scalars['String']>;
	symbol_starts_with?: Maybe<Scalars['String']>;
	symbol_not_starts_with?: Maybe<Scalars['String']>;
	symbol_ends_with?: Maybe<Scalars['String']>;
	symbol_not_ends_with?: Maybe<Scalars['String']>;
	token?: Maybe<Scalars['String']>;
	token_not?: Maybe<Scalars['String']>;
	token_gt?: Maybe<Scalars['String']>;
	token_lt?: Maybe<Scalars['String']>;
	token_gte?: Maybe<Scalars['String']>;
	token_lte?: Maybe<Scalars['String']>;
	token_in?: Maybe<Array<Scalars['String']>>;
	token_not_in?: Maybe<Array<Scalars['String']>>;
	token_contains?: Maybe<Scalars['String']>;
	token_not_contains?: Maybe<Scalars['String']>;
	token_starts_with?: Maybe<Scalars['String']>;
	token_not_starts_with?: Maybe<Scalars['String']>;
	token_ends_with?: Maybe<Scalars['String']>;
	token_not_ends_with?: Maybe<Scalars['String']>;
	pricePerFullShare?: Maybe<Scalars['BigInt']>;
	pricePerFullShare_not?: Maybe<Scalars['BigInt']>;
	pricePerFullShare_gt?: Maybe<Scalars['BigInt']>;
	pricePerFullShare_lt?: Maybe<Scalars['BigInt']>;
	pricePerFullShare_gte?: Maybe<Scalars['BigInt']>;
	pricePerFullShare_lte?: Maybe<Scalars['BigInt']>;
	pricePerFullShare_in?: Maybe<Array<Scalars['BigInt']>>;
	pricePerFullShare_not_in?: Maybe<Array<Scalars['BigInt']>>;
	balance?: Maybe<Scalars['BigInt']>;
	balance_not?: Maybe<Scalars['BigInt']>;
	balance_gt?: Maybe<Scalars['BigInt']>;
	balance_lt?: Maybe<Scalars['BigInt']>;
	balance_gte?: Maybe<Scalars['BigInt']>;
	balance_lte?: Maybe<Scalars['BigInt']>;
	balance_in?: Maybe<Array<Scalars['BigInt']>>;
	balance_not_in?: Maybe<Array<Scalars['BigInt']>>;
	totalSupply?: Maybe<Scalars['BigInt']>;
	totalSupply_not?: Maybe<Scalars['BigInt']>;
	totalSupply_gt?: Maybe<Scalars['BigInt']>;
	totalSupply_lt?: Maybe<Scalars['BigInt']>;
	totalSupply_gte?: Maybe<Scalars['BigInt']>;
	totalSupply_lte?: Maybe<Scalars['BigInt']>;
	totalSupply_in?: Maybe<Array<Scalars['BigInt']>>;
	totalSupply_not_in?: Maybe<Array<Scalars['BigInt']>>;
	netDeposit?: Maybe<Scalars['BigInt']>;
	netDeposit_not?: Maybe<Scalars['BigInt']>;
	netDeposit_gt?: Maybe<Scalars['BigInt']>;
	netDeposit_lt?: Maybe<Scalars['BigInt']>;
	netDeposit_gte?: Maybe<Scalars['BigInt']>;
	netDeposit_lte?: Maybe<Scalars['BigInt']>;
	netDeposit_in?: Maybe<Array<Scalars['BigInt']>>;
	netDeposit_not_in?: Maybe<Array<Scalars['BigInt']>>;
	grossDeposit?: Maybe<Scalars['BigInt']>;
	grossDeposit_not?: Maybe<Scalars['BigInt']>;
	grossDeposit_gt?: Maybe<Scalars['BigInt']>;
	grossDeposit_lt?: Maybe<Scalars['BigInt']>;
	grossDeposit_gte?: Maybe<Scalars['BigInt']>;
	grossDeposit_lte?: Maybe<Scalars['BigInt']>;
	grossDeposit_in?: Maybe<Array<Scalars['BigInt']>>;
	grossDeposit_not_in?: Maybe<Array<Scalars['BigInt']>>;
	grossWithdraw?: Maybe<Scalars['BigInt']>;
	grossWithdraw_not?: Maybe<Scalars['BigInt']>;
	grossWithdraw_gt?: Maybe<Scalars['BigInt']>;
	grossWithdraw_lt?: Maybe<Scalars['BigInt']>;
	grossWithdraw_gte?: Maybe<Scalars['BigInt']>;
	grossWithdraw_lte?: Maybe<Scalars['BigInt']>;
	grossWithdraw_in?: Maybe<Array<Scalars['BigInt']>>;
	grossWithdraw_not_in?: Maybe<Array<Scalars['BigInt']>>;
	netShareDeposit?: Maybe<Scalars['BigInt']>;
	netShareDeposit_not?: Maybe<Scalars['BigInt']>;
	netShareDeposit_gt?: Maybe<Scalars['BigInt']>;
	netShareDeposit_lt?: Maybe<Scalars['BigInt']>;
	netShareDeposit_gte?: Maybe<Scalars['BigInt']>;
	netShareDeposit_lte?: Maybe<Scalars['BigInt']>;
	netShareDeposit_in?: Maybe<Array<Scalars['BigInt']>>;
	netShareDeposit_not_in?: Maybe<Array<Scalars['BigInt']>>;
	grossShareDeposit?: Maybe<Scalars['BigInt']>;
	grossShareDeposit_not?: Maybe<Scalars['BigInt']>;
	grossShareDeposit_gt?: Maybe<Scalars['BigInt']>;
	grossShareDeposit_lt?: Maybe<Scalars['BigInt']>;
	grossShareDeposit_gte?: Maybe<Scalars['BigInt']>;
	grossShareDeposit_lte?: Maybe<Scalars['BigInt']>;
	grossShareDeposit_in?: Maybe<Array<Scalars['BigInt']>>;
	grossShareDeposit_not_in?: Maybe<Array<Scalars['BigInt']>>;
	grossShareWithdraw?: Maybe<Scalars['BigInt']>;
	grossShareWithdraw_not?: Maybe<Scalars['BigInt']>;
	grossShareWithdraw_gt?: Maybe<Scalars['BigInt']>;
	grossShareWithdraw_lt?: Maybe<Scalars['BigInt']>;
	grossShareWithdraw_gte?: Maybe<Scalars['BigInt']>;
	grossShareWithdraw_lte?: Maybe<Scalars['BigInt']>;
	grossShareWithdraw_in?: Maybe<Array<Scalars['BigInt']>>;
	grossShareWithdraw_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Sett_OrderBy {
	Id = 'id',
	Name = 'name',
	Symbol = 'symbol',
	Token = 'token',
	PricePerFullShare = 'pricePerFullShare',
	Balance = 'balance',
	TotalSupply = 'totalSupply',
	NetDeposit = 'netDeposit',
	GrossDeposit = 'grossDeposit',
	GrossWithdraw = 'grossWithdraw',
	NetShareDeposit = 'netShareDeposit',
	GrossShareDeposit = 'grossShareDeposit',
	GrossShareWithdraw = 'grossShareWithdraw',
}

export type Subscription = {
	__typename?: 'Subscription';
	user?: Maybe<User>;
	users: Array<User>;
	sett?: Maybe<Sett>;
	setts: Array<Sett>;
	userSettBalance?: Maybe<UserSettBalance>;
	userSettBalances: Array<UserSettBalance>;
	token?: Maybe<Token>;
	tokens: Array<Token>;
	geyser?: Maybe<Geyser>;
	geysers: Array<Geyser>;
	/** Access to subgraph metadata */
	_meta?: Maybe<_Meta_>;
};

export type SubscriptionUserArgs = {
	id: Scalars['ID'];
	block?: Maybe<Block_Height>;
};

export type SubscriptionUsersArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<User_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<User_Filter>;
	block?: Maybe<Block_Height>;
};

export type SubscriptionSettArgs = {
	id: Scalars['ID'];
	block?: Maybe<Block_Height>;
};

export type SubscriptionSettsArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<Sett_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<Sett_Filter>;
	block?: Maybe<Block_Height>;
};

export type SubscriptionUserSettBalanceArgs = {
	id: Scalars['ID'];
	block?: Maybe<Block_Height>;
};

export type SubscriptionUserSettBalancesArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<UserSettBalance_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<UserSettBalance_Filter>;
	block?: Maybe<Block_Height>;
};

export type SubscriptionTokenArgs = {
	id: Scalars['ID'];
	block?: Maybe<Block_Height>;
};

export type SubscriptionTokensArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<Token_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<Token_Filter>;
	block?: Maybe<Block_Height>;
};

export type SubscriptionGeyserArgs = {
	id: Scalars['ID'];
	block?: Maybe<Block_Height>;
};

export type SubscriptionGeysersArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<Geyser_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<Geyser_Filter>;
	block?: Maybe<Block_Height>;
};

export type Subscription_MetaArgs = {
	block?: Maybe<Block_Height>;
};

export type Token = {
	__typename?: 'Token';
	id: Scalars['ID'];
	decimals: Scalars['BigInt'];
	name: Scalars['String'];
	symbol: Scalars['String'];
	totalSupply: Scalars['BigInt'];
};

export type Token_Filter = {
	id?: Maybe<Scalars['ID']>;
	id_not?: Maybe<Scalars['ID']>;
	id_gt?: Maybe<Scalars['ID']>;
	id_lt?: Maybe<Scalars['ID']>;
	id_gte?: Maybe<Scalars['ID']>;
	id_lte?: Maybe<Scalars['ID']>;
	id_in?: Maybe<Array<Scalars['ID']>>;
	id_not_in?: Maybe<Array<Scalars['ID']>>;
	decimals?: Maybe<Scalars['BigInt']>;
	decimals_not?: Maybe<Scalars['BigInt']>;
	decimals_gt?: Maybe<Scalars['BigInt']>;
	decimals_lt?: Maybe<Scalars['BigInt']>;
	decimals_gte?: Maybe<Scalars['BigInt']>;
	decimals_lte?: Maybe<Scalars['BigInt']>;
	decimals_in?: Maybe<Array<Scalars['BigInt']>>;
	decimals_not_in?: Maybe<Array<Scalars['BigInt']>>;
	name?: Maybe<Scalars['String']>;
	name_not?: Maybe<Scalars['String']>;
	name_gt?: Maybe<Scalars['String']>;
	name_lt?: Maybe<Scalars['String']>;
	name_gte?: Maybe<Scalars['String']>;
	name_lte?: Maybe<Scalars['String']>;
	name_in?: Maybe<Array<Scalars['String']>>;
	name_not_in?: Maybe<Array<Scalars['String']>>;
	name_contains?: Maybe<Scalars['String']>;
	name_not_contains?: Maybe<Scalars['String']>;
	name_starts_with?: Maybe<Scalars['String']>;
	name_not_starts_with?: Maybe<Scalars['String']>;
	name_ends_with?: Maybe<Scalars['String']>;
	name_not_ends_with?: Maybe<Scalars['String']>;
	symbol?: Maybe<Scalars['String']>;
	symbol_not?: Maybe<Scalars['String']>;
	symbol_gt?: Maybe<Scalars['String']>;
	symbol_lt?: Maybe<Scalars['String']>;
	symbol_gte?: Maybe<Scalars['String']>;
	symbol_lte?: Maybe<Scalars['String']>;
	symbol_in?: Maybe<Array<Scalars['String']>>;
	symbol_not_in?: Maybe<Array<Scalars['String']>>;
	symbol_contains?: Maybe<Scalars['String']>;
	symbol_not_contains?: Maybe<Scalars['String']>;
	symbol_starts_with?: Maybe<Scalars['String']>;
	symbol_not_starts_with?: Maybe<Scalars['String']>;
	symbol_ends_with?: Maybe<Scalars['String']>;
	symbol_not_ends_with?: Maybe<Scalars['String']>;
	totalSupply?: Maybe<Scalars['BigInt']>;
	totalSupply_not?: Maybe<Scalars['BigInt']>;
	totalSupply_gt?: Maybe<Scalars['BigInt']>;
	totalSupply_lt?: Maybe<Scalars['BigInt']>;
	totalSupply_gte?: Maybe<Scalars['BigInt']>;
	totalSupply_lte?: Maybe<Scalars['BigInt']>;
	totalSupply_in?: Maybe<Array<Scalars['BigInt']>>;
	totalSupply_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Token_OrderBy {
	Id = 'id',
	Decimals = 'decimals',
	Name = 'name',
	Symbol = 'symbol',
	TotalSupply = 'totalSupply',
}

export type User = {
	__typename?: 'User';
	id: Scalars['ID'];
	settBalances: Array<UserSettBalance>;
};

export type UserSettBalancesArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<UserSettBalance_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<UserSettBalance_Filter>;
};

export type UserSettBalance = {
	__typename?: 'UserSettBalance';
	id: Scalars['ID'];
	user: User;
	sett: Sett;
	/** Current sett deposit token value */
	netDeposit: Scalars['BigInt'];
	/** Total sett deposit token value */
	grossDeposit: Scalars['BigInt'];
	/** Total sett withdraw token value */
	grossWithdraw: Scalars['BigInt'];
	/** Current sett deposit share value */
	netShareDeposit: Scalars['BigInt'];
	/** Total sett deposit share value */
	grossShareDeposit: Scalars['BigInt'];
	/** Total sett withdraw share value */
	grossShareWithdraw: Scalars['BigInt'];
};

export type UserSettBalance_Filter = {
	id?: Maybe<Scalars['ID']>;
	id_not?: Maybe<Scalars['ID']>;
	id_gt?: Maybe<Scalars['ID']>;
	id_lt?: Maybe<Scalars['ID']>;
	id_gte?: Maybe<Scalars['ID']>;
	id_lte?: Maybe<Scalars['ID']>;
	id_in?: Maybe<Array<Scalars['ID']>>;
	id_not_in?: Maybe<Array<Scalars['ID']>>;
	user?: Maybe<Scalars['String']>;
	user_not?: Maybe<Scalars['String']>;
	user_gt?: Maybe<Scalars['String']>;
	user_lt?: Maybe<Scalars['String']>;
	user_gte?: Maybe<Scalars['String']>;
	user_lte?: Maybe<Scalars['String']>;
	user_in?: Maybe<Array<Scalars['String']>>;
	user_not_in?: Maybe<Array<Scalars['String']>>;
	user_contains?: Maybe<Scalars['String']>;
	user_not_contains?: Maybe<Scalars['String']>;
	user_starts_with?: Maybe<Scalars['String']>;
	user_not_starts_with?: Maybe<Scalars['String']>;
	user_ends_with?: Maybe<Scalars['String']>;
	user_not_ends_with?: Maybe<Scalars['String']>;
	sett?: Maybe<Scalars['String']>;
	sett_not?: Maybe<Scalars['String']>;
	sett_gt?: Maybe<Scalars['String']>;
	sett_lt?: Maybe<Scalars['String']>;
	sett_gte?: Maybe<Scalars['String']>;
	sett_lte?: Maybe<Scalars['String']>;
	sett_in?: Maybe<Array<Scalars['String']>>;
	sett_not_in?: Maybe<Array<Scalars['String']>>;
	sett_contains?: Maybe<Scalars['String']>;
	sett_not_contains?: Maybe<Scalars['String']>;
	sett_starts_with?: Maybe<Scalars['String']>;
	sett_not_starts_with?: Maybe<Scalars['String']>;
	sett_ends_with?: Maybe<Scalars['String']>;
	sett_not_ends_with?: Maybe<Scalars['String']>;
	netDeposit?: Maybe<Scalars['BigInt']>;
	netDeposit_not?: Maybe<Scalars['BigInt']>;
	netDeposit_gt?: Maybe<Scalars['BigInt']>;
	netDeposit_lt?: Maybe<Scalars['BigInt']>;
	netDeposit_gte?: Maybe<Scalars['BigInt']>;
	netDeposit_lte?: Maybe<Scalars['BigInt']>;
	netDeposit_in?: Maybe<Array<Scalars['BigInt']>>;
	netDeposit_not_in?: Maybe<Array<Scalars['BigInt']>>;
	grossDeposit?: Maybe<Scalars['BigInt']>;
	grossDeposit_not?: Maybe<Scalars['BigInt']>;
	grossDeposit_gt?: Maybe<Scalars['BigInt']>;
	grossDeposit_lt?: Maybe<Scalars['BigInt']>;
	grossDeposit_gte?: Maybe<Scalars['BigInt']>;
	grossDeposit_lte?: Maybe<Scalars['BigInt']>;
	grossDeposit_in?: Maybe<Array<Scalars['BigInt']>>;
	grossDeposit_not_in?: Maybe<Array<Scalars['BigInt']>>;
	grossWithdraw?: Maybe<Scalars['BigInt']>;
	grossWithdraw_not?: Maybe<Scalars['BigInt']>;
	grossWithdraw_gt?: Maybe<Scalars['BigInt']>;
	grossWithdraw_lt?: Maybe<Scalars['BigInt']>;
	grossWithdraw_gte?: Maybe<Scalars['BigInt']>;
	grossWithdraw_lte?: Maybe<Scalars['BigInt']>;
	grossWithdraw_in?: Maybe<Array<Scalars['BigInt']>>;
	grossWithdraw_not_in?: Maybe<Array<Scalars['BigInt']>>;
	netShareDeposit?: Maybe<Scalars['BigInt']>;
	netShareDeposit_not?: Maybe<Scalars['BigInt']>;
	netShareDeposit_gt?: Maybe<Scalars['BigInt']>;
	netShareDeposit_lt?: Maybe<Scalars['BigInt']>;
	netShareDeposit_gte?: Maybe<Scalars['BigInt']>;
	netShareDeposit_lte?: Maybe<Scalars['BigInt']>;
	netShareDeposit_in?: Maybe<Array<Scalars['BigInt']>>;
	netShareDeposit_not_in?: Maybe<Array<Scalars['BigInt']>>;
	grossShareDeposit?: Maybe<Scalars['BigInt']>;
	grossShareDeposit_not?: Maybe<Scalars['BigInt']>;
	grossShareDeposit_gt?: Maybe<Scalars['BigInt']>;
	grossShareDeposit_lt?: Maybe<Scalars['BigInt']>;
	grossShareDeposit_gte?: Maybe<Scalars['BigInt']>;
	grossShareDeposit_lte?: Maybe<Scalars['BigInt']>;
	grossShareDeposit_in?: Maybe<Array<Scalars['BigInt']>>;
	grossShareDeposit_not_in?: Maybe<Array<Scalars['BigInt']>>;
	grossShareWithdraw?: Maybe<Scalars['BigInt']>;
	grossShareWithdraw_not?: Maybe<Scalars['BigInt']>;
	grossShareWithdraw_gt?: Maybe<Scalars['BigInt']>;
	grossShareWithdraw_lt?: Maybe<Scalars['BigInt']>;
	grossShareWithdraw_gte?: Maybe<Scalars['BigInt']>;
	grossShareWithdraw_lte?: Maybe<Scalars['BigInt']>;
	grossShareWithdraw_in?: Maybe<Array<Scalars['BigInt']>>;
	grossShareWithdraw_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum UserSettBalance_OrderBy {
	Id = 'id',
	User = 'user',
	Sett = 'sett',
	NetDeposit = 'netDeposit',
	GrossDeposit = 'grossDeposit',
	GrossWithdraw = 'grossWithdraw',
	NetShareDeposit = 'netShareDeposit',
	GrossShareDeposit = 'grossShareDeposit',
	GrossShareWithdraw = 'grossShareWithdraw',
}

export type User_Filter = {
	id?: Maybe<Scalars['ID']>;
	id_not?: Maybe<Scalars['ID']>;
	id_gt?: Maybe<Scalars['ID']>;
	id_lt?: Maybe<Scalars['ID']>;
	id_gte?: Maybe<Scalars['ID']>;
	id_lte?: Maybe<Scalars['ID']>;
	id_in?: Maybe<Array<Scalars['ID']>>;
	id_not_in?: Maybe<Array<Scalars['ID']>>;
};

export enum User_OrderBy {
	Id = 'id',
	SettBalances = 'settBalances',
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
	Deny = 'deny',
}

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (sdkFunction) => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
	return {};
}
export type Sdk = ReturnType<typeof getSdk>;
