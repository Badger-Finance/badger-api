import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import { print } from 'graphql';
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

export type History = {
	__typename?: 'History';
	id: Scalars['ID'];
	owner: MasterChef;
	slpBalance: Scalars['BigDecimal'];
	slpAge: Scalars['BigDecimal'];
	slpAgeRemoved: Scalars['BigDecimal'];
	slpDeposited: Scalars['BigDecimal'];
	slpWithdrawn: Scalars['BigDecimal'];
	timestamp: Scalars['BigInt'];
	block: Scalars['BigInt'];
};

export type History_Filter = {
	id?: Maybe<Scalars['ID']>;
	id_not?: Maybe<Scalars['ID']>;
	id_gt?: Maybe<Scalars['ID']>;
	id_lt?: Maybe<Scalars['ID']>;
	id_gte?: Maybe<Scalars['ID']>;
	id_lte?: Maybe<Scalars['ID']>;
	id_in?: Maybe<Array<Scalars['ID']>>;
	id_not_in?: Maybe<Array<Scalars['ID']>>;
	owner?: Maybe<Scalars['String']>;
	owner_not?: Maybe<Scalars['String']>;
	owner_gt?: Maybe<Scalars['String']>;
	owner_lt?: Maybe<Scalars['String']>;
	owner_gte?: Maybe<Scalars['String']>;
	owner_lte?: Maybe<Scalars['String']>;
	owner_in?: Maybe<Array<Scalars['String']>>;
	owner_not_in?: Maybe<Array<Scalars['String']>>;
	owner_contains?: Maybe<Scalars['String']>;
	owner_not_contains?: Maybe<Scalars['String']>;
	owner_starts_with?: Maybe<Scalars['String']>;
	owner_not_starts_with?: Maybe<Scalars['String']>;
	owner_ends_with?: Maybe<Scalars['String']>;
	owner_not_ends_with?: Maybe<Scalars['String']>;
	slpBalance?: Maybe<Scalars['BigDecimal']>;
	slpBalance_not?: Maybe<Scalars['BigDecimal']>;
	slpBalance_gt?: Maybe<Scalars['BigDecimal']>;
	slpBalance_lt?: Maybe<Scalars['BigDecimal']>;
	slpBalance_gte?: Maybe<Scalars['BigDecimal']>;
	slpBalance_lte?: Maybe<Scalars['BigDecimal']>;
	slpBalance_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpBalance_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpAge?: Maybe<Scalars['BigDecimal']>;
	slpAge_not?: Maybe<Scalars['BigDecimal']>;
	slpAge_gt?: Maybe<Scalars['BigDecimal']>;
	slpAge_lt?: Maybe<Scalars['BigDecimal']>;
	slpAge_gte?: Maybe<Scalars['BigDecimal']>;
	slpAge_lte?: Maybe<Scalars['BigDecimal']>;
	slpAge_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpAge_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpAgeRemoved?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_not?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_gt?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_lt?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_gte?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_lte?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpAgeRemoved_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpDeposited?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_not?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_gt?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_lt?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_gte?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_lte?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpDeposited_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpWithdrawn?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_not?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_gt?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_lt?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_gte?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_lte?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpWithdrawn_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	timestamp?: Maybe<Scalars['BigInt']>;
	timestamp_not?: Maybe<Scalars['BigInt']>;
	timestamp_gt?: Maybe<Scalars['BigInt']>;
	timestamp_lt?: Maybe<Scalars['BigInt']>;
	timestamp_gte?: Maybe<Scalars['BigInt']>;
	timestamp_lte?: Maybe<Scalars['BigInt']>;
	timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
	timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
	block?: Maybe<Scalars['BigInt']>;
	block_not?: Maybe<Scalars['BigInt']>;
	block_gt?: Maybe<Scalars['BigInt']>;
	block_lt?: Maybe<Scalars['BigInt']>;
	block_gte?: Maybe<Scalars['BigInt']>;
	block_lte?: Maybe<Scalars['BigInt']>;
	block_in?: Maybe<Array<Scalars['BigInt']>>;
	block_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum History_OrderBy {
	Id = 'id',
	Owner = 'owner',
	SlpBalance = 'slpBalance',
	SlpAge = 'slpAge',
	SlpAgeRemoved = 'slpAgeRemoved',
	SlpDeposited = 'slpDeposited',
	SlpWithdrawn = 'slpWithdrawn',
	Timestamp = 'timestamp',
	Block = 'block',
}

export type MasterChef = {
	__typename?: 'MasterChef';
	id: Scalars['ID'];
	bonusMultiplier: Scalars['BigInt'];
	bonusEndBlock: Scalars['BigInt'];
	devaddr: Scalars['Bytes'];
	migrator: Scalars['Bytes'];
	owner: Scalars['Bytes'];
	startBlock: Scalars['BigInt'];
	sushi: Scalars['Bytes'];
	sushiPerBlock: Scalars['BigInt'];
	totalAllocPoint: Scalars['BigInt'];
	pools: Array<Pool>;
	poolCount: Scalars['BigInt'];
	slpBalance: Scalars['BigDecimal'];
	slpAge: Scalars['BigDecimal'];
	slpAgeRemoved: Scalars['BigDecimal'];
	slpDeposited: Scalars['BigDecimal'];
	slpWithdrawn: Scalars['BigDecimal'];
	history: Array<History>;
	updatedAt: Scalars['BigInt'];
};

export type MasterChefPoolsArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<Pool_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<Pool_Filter>;
};

export type MasterChefHistoryArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<History_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<History_Filter>;
};

export type MasterChef_Filter = {
	id?: Maybe<Scalars['ID']>;
	id_not?: Maybe<Scalars['ID']>;
	id_gt?: Maybe<Scalars['ID']>;
	id_lt?: Maybe<Scalars['ID']>;
	id_gte?: Maybe<Scalars['ID']>;
	id_lte?: Maybe<Scalars['ID']>;
	id_in?: Maybe<Array<Scalars['ID']>>;
	id_not_in?: Maybe<Array<Scalars['ID']>>;
	bonusMultiplier?: Maybe<Scalars['BigInt']>;
	bonusMultiplier_not?: Maybe<Scalars['BigInt']>;
	bonusMultiplier_gt?: Maybe<Scalars['BigInt']>;
	bonusMultiplier_lt?: Maybe<Scalars['BigInt']>;
	bonusMultiplier_gte?: Maybe<Scalars['BigInt']>;
	bonusMultiplier_lte?: Maybe<Scalars['BigInt']>;
	bonusMultiplier_in?: Maybe<Array<Scalars['BigInt']>>;
	bonusMultiplier_not_in?: Maybe<Array<Scalars['BigInt']>>;
	bonusEndBlock?: Maybe<Scalars['BigInt']>;
	bonusEndBlock_not?: Maybe<Scalars['BigInt']>;
	bonusEndBlock_gt?: Maybe<Scalars['BigInt']>;
	bonusEndBlock_lt?: Maybe<Scalars['BigInt']>;
	bonusEndBlock_gte?: Maybe<Scalars['BigInt']>;
	bonusEndBlock_lte?: Maybe<Scalars['BigInt']>;
	bonusEndBlock_in?: Maybe<Array<Scalars['BigInt']>>;
	bonusEndBlock_not_in?: Maybe<Array<Scalars['BigInt']>>;
	devaddr?: Maybe<Scalars['Bytes']>;
	devaddr_not?: Maybe<Scalars['Bytes']>;
	devaddr_in?: Maybe<Array<Scalars['Bytes']>>;
	devaddr_not_in?: Maybe<Array<Scalars['Bytes']>>;
	devaddr_contains?: Maybe<Scalars['Bytes']>;
	devaddr_not_contains?: Maybe<Scalars['Bytes']>;
	migrator?: Maybe<Scalars['Bytes']>;
	migrator_not?: Maybe<Scalars['Bytes']>;
	migrator_in?: Maybe<Array<Scalars['Bytes']>>;
	migrator_not_in?: Maybe<Array<Scalars['Bytes']>>;
	migrator_contains?: Maybe<Scalars['Bytes']>;
	migrator_not_contains?: Maybe<Scalars['Bytes']>;
	owner?: Maybe<Scalars['Bytes']>;
	owner_not?: Maybe<Scalars['Bytes']>;
	owner_in?: Maybe<Array<Scalars['Bytes']>>;
	owner_not_in?: Maybe<Array<Scalars['Bytes']>>;
	owner_contains?: Maybe<Scalars['Bytes']>;
	owner_not_contains?: Maybe<Scalars['Bytes']>;
	startBlock?: Maybe<Scalars['BigInt']>;
	startBlock_not?: Maybe<Scalars['BigInt']>;
	startBlock_gt?: Maybe<Scalars['BigInt']>;
	startBlock_lt?: Maybe<Scalars['BigInt']>;
	startBlock_gte?: Maybe<Scalars['BigInt']>;
	startBlock_lte?: Maybe<Scalars['BigInt']>;
	startBlock_in?: Maybe<Array<Scalars['BigInt']>>;
	startBlock_not_in?: Maybe<Array<Scalars['BigInt']>>;
	sushi?: Maybe<Scalars['Bytes']>;
	sushi_not?: Maybe<Scalars['Bytes']>;
	sushi_in?: Maybe<Array<Scalars['Bytes']>>;
	sushi_not_in?: Maybe<Array<Scalars['Bytes']>>;
	sushi_contains?: Maybe<Scalars['Bytes']>;
	sushi_not_contains?: Maybe<Scalars['Bytes']>;
	sushiPerBlock?: Maybe<Scalars['BigInt']>;
	sushiPerBlock_not?: Maybe<Scalars['BigInt']>;
	sushiPerBlock_gt?: Maybe<Scalars['BigInt']>;
	sushiPerBlock_lt?: Maybe<Scalars['BigInt']>;
	sushiPerBlock_gte?: Maybe<Scalars['BigInt']>;
	sushiPerBlock_lte?: Maybe<Scalars['BigInt']>;
	sushiPerBlock_in?: Maybe<Array<Scalars['BigInt']>>;
	sushiPerBlock_not_in?: Maybe<Array<Scalars['BigInt']>>;
	totalAllocPoint?: Maybe<Scalars['BigInt']>;
	totalAllocPoint_not?: Maybe<Scalars['BigInt']>;
	totalAllocPoint_gt?: Maybe<Scalars['BigInt']>;
	totalAllocPoint_lt?: Maybe<Scalars['BigInt']>;
	totalAllocPoint_gte?: Maybe<Scalars['BigInt']>;
	totalAllocPoint_lte?: Maybe<Scalars['BigInt']>;
	totalAllocPoint_in?: Maybe<Array<Scalars['BigInt']>>;
	totalAllocPoint_not_in?: Maybe<Array<Scalars['BigInt']>>;
	poolCount?: Maybe<Scalars['BigInt']>;
	poolCount_not?: Maybe<Scalars['BigInt']>;
	poolCount_gt?: Maybe<Scalars['BigInt']>;
	poolCount_lt?: Maybe<Scalars['BigInt']>;
	poolCount_gte?: Maybe<Scalars['BigInt']>;
	poolCount_lte?: Maybe<Scalars['BigInt']>;
	poolCount_in?: Maybe<Array<Scalars['BigInt']>>;
	poolCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
	slpBalance?: Maybe<Scalars['BigDecimal']>;
	slpBalance_not?: Maybe<Scalars['BigDecimal']>;
	slpBalance_gt?: Maybe<Scalars['BigDecimal']>;
	slpBalance_lt?: Maybe<Scalars['BigDecimal']>;
	slpBalance_gte?: Maybe<Scalars['BigDecimal']>;
	slpBalance_lte?: Maybe<Scalars['BigDecimal']>;
	slpBalance_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpBalance_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpAge?: Maybe<Scalars['BigDecimal']>;
	slpAge_not?: Maybe<Scalars['BigDecimal']>;
	slpAge_gt?: Maybe<Scalars['BigDecimal']>;
	slpAge_lt?: Maybe<Scalars['BigDecimal']>;
	slpAge_gte?: Maybe<Scalars['BigDecimal']>;
	slpAge_lte?: Maybe<Scalars['BigDecimal']>;
	slpAge_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpAge_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpAgeRemoved?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_not?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_gt?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_lt?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_gte?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_lte?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpAgeRemoved_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpDeposited?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_not?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_gt?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_lt?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_gte?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_lte?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpDeposited_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpWithdrawn?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_not?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_gt?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_lt?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_gte?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_lte?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpWithdrawn_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	updatedAt?: Maybe<Scalars['BigInt']>;
	updatedAt_not?: Maybe<Scalars['BigInt']>;
	updatedAt_gt?: Maybe<Scalars['BigInt']>;
	updatedAt_lt?: Maybe<Scalars['BigInt']>;
	updatedAt_gte?: Maybe<Scalars['BigInt']>;
	updatedAt_lte?: Maybe<Scalars['BigInt']>;
	updatedAt_in?: Maybe<Array<Scalars['BigInt']>>;
	updatedAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum MasterChef_OrderBy {
	Id = 'id',
	BonusMultiplier = 'bonusMultiplier',
	BonusEndBlock = 'bonusEndBlock',
	Devaddr = 'devaddr',
	Migrator = 'migrator',
	Owner = 'owner',
	StartBlock = 'startBlock',
	Sushi = 'sushi',
	SushiPerBlock = 'sushiPerBlock',
	TotalAllocPoint = 'totalAllocPoint',
	Pools = 'pools',
	PoolCount = 'poolCount',
	SlpBalance = 'slpBalance',
	SlpAge = 'slpAge',
	SlpAgeRemoved = 'slpAgeRemoved',
	SlpDeposited = 'slpDeposited',
	SlpWithdrawn = 'slpWithdrawn',
	History = 'history',
	UpdatedAt = 'updatedAt',
}

export enum OrderDirection {
	Asc = 'asc',
	Desc = 'desc',
}

export type Pool = {
	__typename?: 'Pool';
	id: Scalars['ID'];
	owner: MasterChef;
	pair: Scalars['Bytes'];
	allocPoint: Scalars['BigInt'];
	lastRewardBlock: Scalars['BigInt'];
	accSushiPerShare: Scalars['BigInt'];
	balance: Scalars['BigInt'];
	users: Array<User>;
	userCount: Scalars['BigInt'];
	slpBalance: Scalars['BigDecimal'];
	slpAge: Scalars['BigDecimal'];
	slpAgeRemoved: Scalars['BigDecimal'];
	slpDeposited: Scalars['BigDecimal'];
	slpWithdrawn: Scalars['BigDecimal'];
	timestamp: Scalars['BigInt'];
	block: Scalars['BigInt'];
	updatedAt: Scalars['BigInt'];
	entryUSD: Scalars['BigDecimal'];
	exitUSD: Scalars['BigDecimal'];
	sushiHarvested: Scalars['BigDecimal'];
	sushiHarvestedUSD: Scalars['BigDecimal'];
};

export type PoolUsersArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<User_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<User_Filter>;
};

export type PoolHistory = {
	__typename?: 'PoolHistory';
	id: Scalars['ID'];
	pool: Pool;
	slpBalance: Scalars['BigDecimal'];
	slpAge: Scalars['BigDecimal'];
	slpAgeRemoved: Scalars['BigDecimal'];
	slpDeposited: Scalars['BigDecimal'];
	slpWithdrawn: Scalars['BigDecimal'];
	userCount: Scalars['BigInt'];
	timestamp: Scalars['BigInt'];
	block: Scalars['BigInt'];
	entryUSD: Scalars['BigDecimal'];
	exitUSD: Scalars['BigDecimal'];
	sushiHarvested: Scalars['BigDecimal'];
	sushiHarvestedUSD: Scalars['BigDecimal'];
};

export type PoolHistory_Filter = {
	id?: Maybe<Scalars['ID']>;
	id_not?: Maybe<Scalars['ID']>;
	id_gt?: Maybe<Scalars['ID']>;
	id_lt?: Maybe<Scalars['ID']>;
	id_gte?: Maybe<Scalars['ID']>;
	id_lte?: Maybe<Scalars['ID']>;
	id_in?: Maybe<Array<Scalars['ID']>>;
	id_not_in?: Maybe<Array<Scalars['ID']>>;
	pool?: Maybe<Scalars['String']>;
	pool_not?: Maybe<Scalars['String']>;
	pool_gt?: Maybe<Scalars['String']>;
	pool_lt?: Maybe<Scalars['String']>;
	pool_gte?: Maybe<Scalars['String']>;
	pool_lte?: Maybe<Scalars['String']>;
	pool_in?: Maybe<Array<Scalars['String']>>;
	pool_not_in?: Maybe<Array<Scalars['String']>>;
	pool_contains?: Maybe<Scalars['String']>;
	pool_not_contains?: Maybe<Scalars['String']>;
	pool_starts_with?: Maybe<Scalars['String']>;
	pool_not_starts_with?: Maybe<Scalars['String']>;
	pool_ends_with?: Maybe<Scalars['String']>;
	pool_not_ends_with?: Maybe<Scalars['String']>;
	slpBalance?: Maybe<Scalars['BigDecimal']>;
	slpBalance_not?: Maybe<Scalars['BigDecimal']>;
	slpBalance_gt?: Maybe<Scalars['BigDecimal']>;
	slpBalance_lt?: Maybe<Scalars['BigDecimal']>;
	slpBalance_gte?: Maybe<Scalars['BigDecimal']>;
	slpBalance_lte?: Maybe<Scalars['BigDecimal']>;
	slpBalance_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpBalance_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpAge?: Maybe<Scalars['BigDecimal']>;
	slpAge_not?: Maybe<Scalars['BigDecimal']>;
	slpAge_gt?: Maybe<Scalars['BigDecimal']>;
	slpAge_lt?: Maybe<Scalars['BigDecimal']>;
	slpAge_gte?: Maybe<Scalars['BigDecimal']>;
	slpAge_lte?: Maybe<Scalars['BigDecimal']>;
	slpAge_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpAge_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpAgeRemoved?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_not?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_gt?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_lt?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_gte?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_lte?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpAgeRemoved_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpDeposited?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_not?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_gt?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_lt?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_gte?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_lte?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpDeposited_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpWithdrawn?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_not?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_gt?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_lt?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_gte?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_lte?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpWithdrawn_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	userCount?: Maybe<Scalars['BigInt']>;
	userCount_not?: Maybe<Scalars['BigInt']>;
	userCount_gt?: Maybe<Scalars['BigInt']>;
	userCount_lt?: Maybe<Scalars['BigInt']>;
	userCount_gte?: Maybe<Scalars['BigInt']>;
	userCount_lte?: Maybe<Scalars['BigInt']>;
	userCount_in?: Maybe<Array<Scalars['BigInt']>>;
	userCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
	timestamp?: Maybe<Scalars['BigInt']>;
	timestamp_not?: Maybe<Scalars['BigInt']>;
	timestamp_gt?: Maybe<Scalars['BigInt']>;
	timestamp_lt?: Maybe<Scalars['BigInt']>;
	timestamp_gte?: Maybe<Scalars['BigInt']>;
	timestamp_lte?: Maybe<Scalars['BigInt']>;
	timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
	timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
	block?: Maybe<Scalars['BigInt']>;
	block_not?: Maybe<Scalars['BigInt']>;
	block_gt?: Maybe<Scalars['BigInt']>;
	block_lt?: Maybe<Scalars['BigInt']>;
	block_gte?: Maybe<Scalars['BigInt']>;
	block_lte?: Maybe<Scalars['BigInt']>;
	block_in?: Maybe<Array<Scalars['BigInt']>>;
	block_not_in?: Maybe<Array<Scalars['BigInt']>>;
	entryUSD?: Maybe<Scalars['BigDecimal']>;
	entryUSD_not?: Maybe<Scalars['BigDecimal']>;
	entryUSD_gt?: Maybe<Scalars['BigDecimal']>;
	entryUSD_lt?: Maybe<Scalars['BigDecimal']>;
	entryUSD_gte?: Maybe<Scalars['BigDecimal']>;
	entryUSD_lte?: Maybe<Scalars['BigDecimal']>;
	entryUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
	entryUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	exitUSD?: Maybe<Scalars['BigDecimal']>;
	exitUSD_not?: Maybe<Scalars['BigDecimal']>;
	exitUSD_gt?: Maybe<Scalars['BigDecimal']>;
	exitUSD_lt?: Maybe<Scalars['BigDecimal']>;
	exitUSD_gte?: Maybe<Scalars['BigDecimal']>;
	exitUSD_lte?: Maybe<Scalars['BigDecimal']>;
	exitUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
	exitUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	sushiHarvested?: Maybe<Scalars['BigDecimal']>;
	sushiHarvested_not?: Maybe<Scalars['BigDecimal']>;
	sushiHarvested_gt?: Maybe<Scalars['BigDecimal']>;
	sushiHarvested_lt?: Maybe<Scalars['BigDecimal']>;
	sushiHarvested_gte?: Maybe<Scalars['BigDecimal']>;
	sushiHarvested_lte?: Maybe<Scalars['BigDecimal']>;
	sushiHarvested_in?: Maybe<Array<Scalars['BigDecimal']>>;
	sushiHarvested_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	sushiHarvestedUSD?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedUSD_not?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedUSD_gt?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedUSD_lt?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedUSD_gte?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedUSD_lte?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
	sushiHarvestedUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum PoolHistory_OrderBy {
	Id = 'id',
	Pool = 'pool',
	SlpBalance = 'slpBalance',
	SlpAge = 'slpAge',
	SlpAgeRemoved = 'slpAgeRemoved',
	SlpDeposited = 'slpDeposited',
	SlpWithdrawn = 'slpWithdrawn',
	UserCount = 'userCount',
	Timestamp = 'timestamp',
	Block = 'block',
	EntryUsd = 'entryUSD',
	ExitUsd = 'exitUSD',
	SushiHarvested = 'sushiHarvested',
	SushiHarvestedUsd = 'sushiHarvestedUSD',
}

export type Pool_Filter = {
	id?: Maybe<Scalars['ID']>;
	id_not?: Maybe<Scalars['ID']>;
	id_gt?: Maybe<Scalars['ID']>;
	id_lt?: Maybe<Scalars['ID']>;
	id_gte?: Maybe<Scalars['ID']>;
	id_lte?: Maybe<Scalars['ID']>;
	id_in?: Maybe<Array<Scalars['ID']>>;
	id_not_in?: Maybe<Array<Scalars['ID']>>;
	owner?: Maybe<Scalars['String']>;
	owner_not?: Maybe<Scalars['String']>;
	owner_gt?: Maybe<Scalars['String']>;
	owner_lt?: Maybe<Scalars['String']>;
	owner_gte?: Maybe<Scalars['String']>;
	owner_lte?: Maybe<Scalars['String']>;
	owner_in?: Maybe<Array<Scalars['String']>>;
	owner_not_in?: Maybe<Array<Scalars['String']>>;
	owner_contains?: Maybe<Scalars['String']>;
	owner_not_contains?: Maybe<Scalars['String']>;
	owner_starts_with?: Maybe<Scalars['String']>;
	owner_not_starts_with?: Maybe<Scalars['String']>;
	owner_ends_with?: Maybe<Scalars['String']>;
	owner_not_ends_with?: Maybe<Scalars['String']>;
	pair?: Maybe<Scalars['Bytes']>;
	pair_not?: Maybe<Scalars['Bytes']>;
	pair_in?: Maybe<Array<Scalars['Bytes']>>;
	pair_not_in?: Maybe<Array<Scalars['Bytes']>>;
	pair_contains?: Maybe<Scalars['Bytes']>;
	pair_not_contains?: Maybe<Scalars['Bytes']>;
	allocPoint?: Maybe<Scalars['BigInt']>;
	allocPoint_not?: Maybe<Scalars['BigInt']>;
	allocPoint_gt?: Maybe<Scalars['BigInt']>;
	allocPoint_lt?: Maybe<Scalars['BigInt']>;
	allocPoint_gte?: Maybe<Scalars['BigInt']>;
	allocPoint_lte?: Maybe<Scalars['BigInt']>;
	allocPoint_in?: Maybe<Array<Scalars['BigInt']>>;
	allocPoint_not_in?: Maybe<Array<Scalars['BigInt']>>;
	lastRewardBlock?: Maybe<Scalars['BigInt']>;
	lastRewardBlock_not?: Maybe<Scalars['BigInt']>;
	lastRewardBlock_gt?: Maybe<Scalars['BigInt']>;
	lastRewardBlock_lt?: Maybe<Scalars['BigInt']>;
	lastRewardBlock_gte?: Maybe<Scalars['BigInt']>;
	lastRewardBlock_lte?: Maybe<Scalars['BigInt']>;
	lastRewardBlock_in?: Maybe<Array<Scalars['BigInt']>>;
	lastRewardBlock_not_in?: Maybe<Array<Scalars['BigInt']>>;
	accSushiPerShare?: Maybe<Scalars['BigInt']>;
	accSushiPerShare_not?: Maybe<Scalars['BigInt']>;
	accSushiPerShare_gt?: Maybe<Scalars['BigInt']>;
	accSushiPerShare_lt?: Maybe<Scalars['BigInt']>;
	accSushiPerShare_gte?: Maybe<Scalars['BigInt']>;
	accSushiPerShare_lte?: Maybe<Scalars['BigInt']>;
	accSushiPerShare_in?: Maybe<Array<Scalars['BigInt']>>;
	accSushiPerShare_not_in?: Maybe<Array<Scalars['BigInt']>>;
	balance?: Maybe<Scalars['BigInt']>;
	balance_not?: Maybe<Scalars['BigInt']>;
	balance_gt?: Maybe<Scalars['BigInt']>;
	balance_lt?: Maybe<Scalars['BigInt']>;
	balance_gte?: Maybe<Scalars['BigInt']>;
	balance_lte?: Maybe<Scalars['BigInt']>;
	balance_in?: Maybe<Array<Scalars['BigInt']>>;
	balance_not_in?: Maybe<Array<Scalars['BigInt']>>;
	userCount?: Maybe<Scalars['BigInt']>;
	userCount_not?: Maybe<Scalars['BigInt']>;
	userCount_gt?: Maybe<Scalars['BigInt']>;
	userCount_lt?: Maybe<Scalars['BigInt']>;
	userCount_gte?: Maybe<Scalars['BigInt']>;
	userCount_lte?: Maybe<Scalars['BigInt']>;
	userCount_in?: Maybe<Array<Scalars['BigInt']>>;
	userCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
	slpBalance?: Maybe<Scalars['BigDecimal']>;
	slpBalance_not?: Maybe<Scalars['BigDecimal']>;
	slpBalance_gt?: Maybe<Scalars['BigDecimal']>;
	slpBalance_lt?: Maybe<Scalars['BigDecimal']>;
	slpBalance_gte?: Maybe<Scalars['BigDecimal']>;
	slpBalance_lte?: Maybe<Scalars['BigDecimal']>;
	slpBalance_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpBalance_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpAge?: Maybe<Scalars['BigDecimal']>;
	slpAge_not?: Maybe<Scalars['BigDecimal']>;
	slpAge_gt?: Maybe<Scalars['BigDecimal']>;
	slpAge_lt?: Maybe<Scalars['BigDecimal']>;
	slpAge_gte?: Maybe<Scalars['BigDecimal']>;
	slpAge_lte?: Maybe<Scalars['BigDecimal']>;
	slpAge_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpAge_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpAgeRemoved?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_not?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_gt?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_lt?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_gte?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_lte?: Maybe<Scalars['BigDecimal']>;
	slpAgeRemoved_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpAgeRemoved_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpDeposited?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_not?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_gt?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_lt?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_gte?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_lte?: Maybe<Scalars['BigDecimal']>;
	slpDeposited_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpDeposited_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpWithdrawn?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_not?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_gt?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_lt?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_gte?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_lte?: Maybe<Scalars['BigDecimal']>;
	slpWithdrawn_in?: Maybe<Array<Scalars['BigDecimal']>>;
	slpWithdrawn_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	timestamp?: Maybe<Scalars['BigInt']>;
	timestamp_not?: Maybe<Scalars['BigInt']>;
	timestamp_gt?: Maybe<Scalars['BigInt']>;
	timestamp_lt?: Maybe<Scalars['BigInt']>;
	timestamp_gte?: Maybe<Scalars['BigInt']>;
	timestamp_lte?: Maybe<Scalars['BigInt']>;
	timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
	timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
	block?: Maybe<Scalars['BigInt']>;
	block_not?: Maybe<Scalars['BigInt']>;
	block_gt?: Maybe<Scalars['BigInt']>;
	block_lt?: Maybe<Scalars['BigInt']>;
	block_gte?: Maybe<Scalars['BigInt']>;
	block_lte?: Maybe<Scalars['BigInt']>;
	block_in?: Maybe<Array<Scalars['BigInt']>>;
	block_not_in?: Maybe<Array<Scalars['BigInt']>>;
	updatedAt?: Maybe<Scalars['BigInt']>;
	updatedAt_not?: Maybe<Scalars['BigInt']>;
	updatedAt_gt?: Maybe<Scalars['BigInt']>;
	updatedAt_lt?: Maybe<Scalars['BigInt']>;
	updatedAt_gte?: Maybe<Scalars['BigInt']>;
	updatedAt_lte?: Maybe<Scalars['BigInt']>;
	updatedAt_in?: Maybe<Array<Scalars['BigInt']>>;
	updatedAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
	entryUSD?: Maybe<Scalars['BigDecimal']>;
	entryUSD_not?: Maybe<Scalars['BigDecimal']>;
	entryUSD_gt?: Maybe<Scalars['BigDecimal']>;
	entryUSD_lt?: Maybe<Scalars['BigDecimal']>;
	entryUSD_gte?: Maybe<Scalars['BigDecimal']>;
	entryUSD_lte?: Maybe<Scalars['BigDecimal']>;
	entryUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
	entryUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	exitUSD?: Maybe<Scalars['BigDecimal']>;
	exitUSD_not?: Maybe<Scalars['BigDecimal']>;
	exitUSD_gt?: Maybe<Scalars['BigDecimal']>;
	exitUSD_lt?: Maybe<Scalars['BigDecimal']>;
	exitUSD_gte?: Maybe<Scalars['BigDecimal']>;
	exitUSD_lte?: Maybe<Scalars['BigDecimal']>;
	exitUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
	exitUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	sushiHarvested?: Maybe<Scalars['BigDecimal']>;
	sushiHarvested_not?: Maybe<Scalars['BigDecimal']>;
	sushiHarvested_gt?: Maybe<Scalars['BigDecimal']>;
	sushiHarvested_lt?: Maybe<Scalars['BigDecimal']>;
	sushiHarvested_gte?: Maybe<Scalars['BigDecimal']>;
	sushiHarvested_lte?: Maybe<Scalars['BigDecimal']>;
	sushiHarvested_in?: Maybe<Array<Scalars['BigDecimal']>>;
	sushiHarvested_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	sushiHarvestedUSD?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedUSD_not?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedUSD_gt?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedUSD_lt?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedUSD_gte?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedUSD_lte?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
	sushiHarvestedUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum Pool_OrderBy {
	Id = 'id',
	Owner = 'owner',
	Pair = 'pair',
	AllocPoint = 'allocPoint',
	LastRewardBlock = 'lastRewardBlock',
	AccSushiPerShare = 'accSushiPerShare',
	Balance = 'balance',
	Users = 'users',
	UserCount = 'userCount',
	SlpBalance = 'slpBalance',
	SlpAge = 'slpAge',
	SlpAgeRemoved = 'slpAgeRemoved',
	SlpDeposited = 'slpDeposited',
	SlpWithdrawn = 'slpWithdrawn',
	Timestamp = 'timestamp',
	Block = 'block',
	UpdatedAt = 'updatedAt',
	EntryUsd = 'entryUSD',
	ExitUsd = 'exitUSD',
	SushiHarvested = 'sushiHarvested',
	SushiHarvestedUsd = 'sushiHarvestedUSD',
}

export type Query = {
	__typename?: 'Query';
	masterChef?: Maybe<MasterChef>;
	masterChefs: Array<MasterChef>;
	history?: Maybe<History>;
	histories: Array<History>;
	pool?: Maybe<Pool>;
	pools: Array<Pool>;
	poolHistory?: Maybe<PoolHistory>;
	poolHistories: Array<PoolHistory>;
	user?: Maybe<User>;
	users: Array<User>;
	/** Access to subgraph metadata */
	_meta?: Maybe<_Meta_>;
};

export type QueryMasterChefArgs = {
	id: Scalars['ID'];
	block?: Maybe<Block_Height>;
};

export type QueryMasterChefsArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<MasterChef_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<MasterChef_Filter>;
	block?: Maybe<Block_Height>;
};

export type QueryHistoryArgs = {
	id: Scalars['ID'];
	block?: Maybe<Block_Height>;
};

export type QueryHistoriesArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<History_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<History_Filter>;
	block?: Maybe<Block_Height>;
};

export type QueryPoolArgs = {
	id: Scalars['ID'];
	block?: Maybe<Block_Height>;
};

export type QueryPoolsArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<Pool_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<Pool_Filter>;
	block?: Maybe<Block_Height>;
};

export type QueryPoolHistoryArgs = {
	id: Scalars['ID'];
	block?: Maybe<Block_Height>;
};

export type QueryPoolHistoriesArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<PoolHistory_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<PoolHistory_Filter>;
	block?: Maybe<Block_Height>;
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

export type Query_MetaArgs = {
	block?: Maybe<Block_Height>;
};

export type Subscription = {
	__typename?: 'Subscription';
	masterChef?: Maybe<MasterChef>;
	masterChefs: Array<MasterChef>;
	history?: Maybe<History>;
	histories: Array<History>;
	pool?: Maybe<Pool>;
	pools: Array<Pool>;
	poolHistory?: Maybe<PoolHistory>;
	poolHistories: Array<PoolHistory>;
	user?: Maybe<User>;
	users: Array<User>;
	/** Access to subgraph metadata */
	_meta?: Maybe<_Meta_>;
};

export type SubscriptionMasterChefArgs = {
	id: Scalars['ID'];
	block?: Maybe<Block_Height>;
};

export type SubscriptionMasterChefsArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<MasterChef_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<MasterChef_Filter>;
	block?: Maybe<Block_Height>;
};

export type SubscriptionHistoryArgs = {
	id: Scalars['ID'];
	block?: Maybe<Block_Height>;
};

export type SubscriptionHistoriesArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<History_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<History_Filter>;
	block?: Maybe<Block_Height>;
};

export type SubscriptionPoolArgs = {
	id: Scalars['ID'];
	block?: Maybe<Block_Height>;
};

export type SubscriptionPoolsArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<Pool_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<Pool_Filter>;
	block?: Maybe<Block_Height>;
};

export type SubscriptionPoolHistoryArgs = {
	id: Scalars['ID'];
	block?: Maybe<Block_Height>;
};

export type SubscriptionPoolHistoriesArgs = {
	skip?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<PoolHistory_OrderBy>;
	orderDirection?: Maybe<OrderDirection>;
	where?: Maybe<PoolHistory_Filter>;
	block?: Maybe<Block_Height>;
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

export type Subscription_MetaArgs = {
	block?: Maybe<Block_Height>;
};

export type User = {
	__typename?: 'User';
	id: Scalars['ID'];
	address: Scalars['Bytes'];
	pool?: Maybe<Pool>;
	amount: Scalars['BigInt'];
	rewardDebt: Scalars['BigInt'];
	entryUSD: Scalars['BigDecimal'];
	exitUSD: Scalars['BigDecimal'];
	sushiAtLockup: Scalars['BigDecimal'];
	sushiHarvested: Scalars['BigDecimal'];
	sushiHarvestedUSD: Scalars['BigDecimal'];
	sushiHarvestedSinceLockup: Scalars['BigDecimal'];
	sushiHarvestedSinceLockupUSD: Scalars['BigDecimal'];
	timestamp: Scalars['BigInt'];
	block: Scalars['BigInt'];
};

export type User_Filter = {
	id?: Maybe<Scalars['ID']>;
	id_not?: Maybe<Scalars['ID']>;
	id_gt?: Maybe<Scalars['ID']>;
	id_lt?: Maybe<Scalars['ID']>;
	id_gte?: Maybe<Scalars['ID']>;
	id_lte?: Maybe<Scalars['ID']>;
	id_in?: Maybe<Array<Scalars['ID']>>;
	id_not_in?: Maybe<Array<Scalars['ID']>>;
	address?: Maybe<Scalars['Bytes']>;
	address_not?: Maybe<Scalars['Bytes']>;
	address_in?: Maybe<Array<Scalars['Bytes']>>;
	address_not_in?: Maybe<Array<Scalars['Bytes']>>;
	address_contains?: Maybe<Scalars['Bytes']>;
	address_not_contains?: Maybe<Scalars['Bytes']>;
	pool?: Maybe<Scalars['String']>;
	pool_not?: Maybe<Scalars['String']>;
	pool_gt?: Maybe<Scalars['String']>;
	pool_lt?: Maybe<Scalars['String']>;
	pool_gte?: Maybe<Scalars['String']>;
	pool_lte?: Maybe<Scalars['String']>;
	pool_in?: Maybe<Array<Scalars['String']>>;
	pool_not_in?: Maybe<Array<Scalars['String']>>;
	pool_contains?: Maybe<Scalars['String']>;
	pool_not_contains?: Maybe<Scalars['String']>;
	pool_starts_with?: Maybe<Scalars['String']>;
	pool_not_starts_with?: Maybe<Scalars['String']>;
	pool_ends_with?: Maybe<Scalars['String']>;
	pool_not_ends_with?: Maybe<Scalars['String']>;
	amount?: Maybe<Scalars['BigInt']>;
	amount_not?: Maybe<Scalars['BigInt']>;
	amount_gt?: Maybe<Scalars['BigInt']>;
	amount_lt?: Maybe<Scalars['BigInt']>;
	amount_gte?: Maybe<Scalars['BigInt']>;
	amount_lte?: Maybe<Scalars['BigInt']>;
	amount_in?: Maybe<Array<Scalars['BigInt']>>;
	amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
	rewardDebt?: Maybe<Scalars['BigInt']>;
	rewardDebt_not?: Maybe<Scalars['BigInt']>;
	rewardDebt_gt?: Maybe<Scalars['BigInt']>;
	rewardDebt_lt?: Maybe<Scalars['BigInt']>;
	rewardDebt_gte?: Maybe<Scalars['BigInt']>;
	rewardDebt_lte?: Maybe<Scalars['BigInt']>;
	rewardDebt_in?: Maybe<Array<Scalars['BigInt']>>;
	rewardDebt_not_in?: Maybe<Array<Scalars['BigInt']>>;
	entryUSD?: Maybe<Scalars['BigDecimal']>;
	entryUSD_not?: Maybe<Scalars['BigDecimal']>;
	entryUSD_gt?: Maybe<Scalars['BigDecimal']>;
	entryUSD_lt?: Maybe<Scalars['BigDecimal']>;
	entryUSD_gte?: Maybe<Scalars['BigDecimal']>;
	entryUSD_lte?: Maybe<Scalars['BigDecimal']>;
	entryUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
	entryUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	exitUSD?: Maybe<Scalars['BigDecimal']>;
	exitUSD_not?: Maybe<Scalars['BigDecimal']>;
	exitUSD_gt?: Maybe<Scalars['BigDecimal']>;
	exitUSD_lt?: Maybe<Scalars['BigDecimal']>;
	exitUSD_gte?: Maybe<Scalars['BigDecimal']>;
	exitUSD_lte?: Maybe<Scalars['BigDecimal']>;
	exitUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
	exitUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	sushiAtLockup?: Maybe<Scalars['BigDecimal']>;
	sushiAtLockup_not?: Maybe<Scalars['BigDecimal']>;
	sushiAtLockup_gt?: Maybe<Scalars['BigDecimal']>;
	sushiAtLockup_lt?: Maybe<Scalars['BigDecimal']>;
	sushiAtLockup_gte?: Maybe<Scalars['BigDecimal']>;
	sushiAtLockup_lte?: Maybe<Scalars['BigDecimal']>;
	sushiAtLockup_in?: Maybe<Array<Scalars['BigDecimal']>>;
	sushiAtLockup_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	sushiHarvested?: Maybe<Scalars['BigDecimal']>;
	sushiHarvested_not?: Maybe<Scalars['BigDecimal']>;
	sushiHarvested_gt?: Maybe<Scalars['BigDecimal']>;
	sushiHarvested_lt?: Maybe<Scalars['BigDecimal']>;
	sushiHarvested_gte?: Maybe<Scalars['BigDecimal']>;
	sushiHarvested_lte?: Maybe<Scalars['BigDecimal']>;
	sushiHarvested_in?: Maybe<Array<Scalars['BigDecimal']>>;
	sushiHarvested_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	sushiHarvestedUSD?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedUSD_not?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedUSD_gt?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedUSD_lt?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedUSD_gte?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedUSD_lte?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
	sushiHarvestedUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	sushiHarvestedSinceLockup?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedSinceLockup_not?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedSinceLockup_gt?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedSinceLockup_lt?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedSinceLockup_gte?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedSinceLockup_lte?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedSinceLockup_in?: Maybe<Array<Scalars['BigDecimal']>>;
	sushiHarvestedSinceLockup_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	sushiHarvestedSinceLockupUSD?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedSinceLockupUSD_not?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedSinceLockupUSD_gt?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedSinceLockupUSD_lt?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedSinceLockupUSD_gte?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedSinceLockupUSD_lte?: Maybe<Scalars['BigDecimal']>;
	sushiHarvestedSinceLockupUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
	sushiHarvestedSinceLockupUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
	timestamp?: Maybe<Scalars['BigInt']>;
	timestamp_not?: Maybe<Scalars['BigInt']>;
	timestamp_gt?: Maybe<Scalars['BigInt']>;
	timestamp_lt?: Maybe<Scalars['BigInt']>;
	timestamp_gte?: Maybe<Scalars['BigInt']>;
	timestamp_lte?: Maybe<Scalars['BigInt']>;
	timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
	timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
	block?: Maybe<Scalars['BigInt']>;
	block_not?: Maybe<Scalars['BigInt']>;
	block_gt?: Maybe<Scalars['BigInt']>;
	block_lt?: Maybe<Scalars['BigInt']>;
	block_gte?: Maybe<Scalars['BigInt']>;
	block_lte?: Maybe<Scalars['BigInt']>;
	block_in?: Maybe<Array<Scalars['BigInt']>>;
	block_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum User_OrderBy {
	Id = 'id',
	Address = 'address',
	Pool = 'pool',
	Amount = 'amount',
	RewardDebt = 'rewardDebt',
	EntryUsd = 'entryUSD',
	ExitUsd = 'exitUSD',
	SushiAtLockup = 'sushiAtLockup',
	SushiHarvested = 'sushiHarvested',
	SushiHarvestedUsd = 'sushiHarvestedUSD',
	SushiHarvestedSinceLockup = 'sushiHarvestedSinceLockup',
	SushiHarvestedSinceLockupUsd = 'sushiHarvestedSinceLockupUSD',
	Timestamp = 'timestamp',
	Block = 'block',
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
