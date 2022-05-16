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

export type Knight = {
  __typename?: 'Knight';
  id: Scalars['ID'];
  voteAmount: Scalars['BigInt'];
  voteCount: Scalars['BigInt'];
  voters: Array<KnightVoter>;
  votes: Array<Vote>;
};

export type KnightVotersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<KnightVoter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<KnightVoter_Filter>;
};

export type KnightVotesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Vote_Filter>;
};

export type KnightVoter = {
  __typename?: 'KnightVoter';
  id: Scalars['ID'];
  knight: Knight;
  voter: Voter;
};

export type KnightVoter_Filter = {
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
  knight?: InputMaybe<Scalars['String']>;
  knight_contains?: InputMaybe<Scalars['String']>;
  knight_contains_nocase?: InputMaybe<Scalars['String']>;
  knight_ends_with?: InputMaybe<Scalars['String']>;
  knight_ends_with_nocase?: InputMaybe<Scalars['String']>;
  knight_gt?: InputMaybe<Scalars['String']>;
  knight_gte?: InputMaybe<Scalars['String']>;
  knight_in?: InputMaybe<Array<Scalars['String']>>;
  knight_lt?: InputMaybe<Scalars['String']>;
  knight_lte?: InputMaybe<Scalars['String']>;
  knight_not?: InputMaybe<Scalars['String']>;
  knight_not_contains?: InputMaybe<Scalars['String']>;
  knight_not_contains_nocase?: InputMaybe<Scalars['String']>;
  knight_not_ends_with?: InputMaybe<Scalars['String']>;
  knight_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  knight_not_in?: InputMaybe<Array<Scalars['String']>>;
  knight_not_starts_with?: InputMaybe<Scalars['String']>;
  knight_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  knight_starts_with?: InputMaybe<Scalars['String']>;
  knight_starts_with_nocase?: InputMaybe<Scalars['String']>;
  voter?: InputMaybe<Scalars['String']>;
  voter_contains?: InputMaybe<Scalars['String']>;
  voter_contains_nocase?: InputMaybe<Scalars['String']>;
  voter_ends_with?: InputMaybe<Scalars['String']>;
  voter_ends_with_nocase?: InputMaybe<Scalars['String']>;
  voter_gt?: InputMaybe<Scalars['String']>;
  voter_gte?: InputMaybe<Scalars['String']>;
  voter_in?: InputMaybe<Array<Scalars['String']>>;
  voter_lt?: InputMaybe<Scalars['String']>;
  voter_lte?: InputMaybe<Scalars['String']>;
  voter_not?: InputMaybe<Scalars['String']>;
  voter_not_contains?: InputMaybe<Scalars['String']>;
  voter_not_contains_nocase?: InputMaybe<Scalars['String']>;
  voter_not_ends_with?: InputMaybe<Scalars['String']>;
  voter_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  voter_not_in?: InputMaybe<Array<Scalars['String']>>;
  voter_not_starts_with?: InputMaybe<Scalars['String']>;
  voter_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  voter_starts_with?: InputMaybe<Scalars['String']>;
  voter_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum KnightVoter_OrderBy {
  Id = 'id',
  Knight = 'knight',
  Voter = 'voter',
}

export type Knight_Filter = {
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
  voteAmount?: InputMaybe<Scalars['BigInt']>;
  voteAmount_gt?: InputMaybe<Scalars['BigInt']>;
  voteAmount_gte?: InputMaybe<Scalars['BigInt']>;
  voteAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  voteAmount_lt?: InputMaybe<Scalars['BigInt']>;
  voteAmount_lte?: InputMaybe<Scalars['BigInt']>;
  voteAmount_not?: InputMaybe<Scalars['BigInt']>;
  voteAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  voteCount?: InputMaybe<Scalars['BigInt']>;
  voteCount_gt?: InputMaybe<Scalars['BigInt']>;
  voteCount_gte?: InputMaybe<Scalars['BigInt']>;
  voteCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  voteCount_lt?: InputMaybe<Scalars['BigInt']>;
  voteCount_lte?: InputMaybe<Scalars['BigInt']>;
  voteCount_not?: InputMaybe<Scalars['BigInt']>;
  voteCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Knight_OrderBy {
  Id = 'id',
  VoteAmount = 'voteAmount',
  VoteCount = 'voteCount',
  Voters = 'voters',
  Votes = 'votes',
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  knight?: Maybe<Knight>;
  knightVoter?: Maybe<KnightVoter>;
  knightVoters: Array<KnightVoter>;
  knights: Array<Knight>;
  vote?: Maybe<Vote>;
  voter?: Maybe<Voter>;
  voters: Array<Voter>;
  votes: Array<Vote>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryKnightArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryKnightVoterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryKnightVotersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<KnightVoter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<KnightVoter_Filter>;
};

export type QueryKnightsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Knight_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Knight_Filter>;
};

export type QueryVoteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVoterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVotersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Voter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Voter_Filter>;
};

export type QueryVotesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Vote_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  knight?: Maybe<Knight>;
  knightVoter?: Maybe<KnightVoter>;
  knightVoters: Array<KnightVoter>;
  knights: Array<Knight>;
  vote?: Maybe<Vote>;
  voter?: Maybe<Voter>;
  voters: Array<Voter>;
  votes: Array<Vote>;
};

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type SubscriptionKnightArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionKnightVoterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionKnightVotersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<KnightVoter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<KnightVoter_Filter>;
};

export type SubscriptionKnightsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Knight_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Knight_Filter>;
};

export type SubscriptionVoteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVoterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVotersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Voter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Voter_Filter>;
};

export type SubscriptionVotesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Vote_Filter>;
};

export type Vote = {
  __typename?: 'Vote';
  amount: Scalars['BigInt'];
  id: Scalars['ID'];
  knight: Knight;
  voter: Voter;
};

export type Vote_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  knight?: InputMaybe<Scalars['String']>;
  knight_contains?: InputMaybe<Scalars['String']>;
  knight_contains_nocase?: InputMaybe<Scalars['String']>;
  knight_ends_with?: InputMaybe<Scalars['String']>;
  knight_ends_with_nocase?: InputMaybe<Scalars['String']>;
  knight_gt?: InputMaybe<Scalars['String']>;
  knight_gte?: InputMaybe<Scalars['String']>;
  knight_in?: InputMaybe<Array<Scalars['String']>>;
  knight_lt?: InputMaybe<Scalars['String']>;
  knight_lte?: InputMaybe<Scalars['String']>;
  knight_not?: InputMaybe<Scalars['String']>;
  knight_not_contains?: InputMaybe<Scalars['String']>;
  knight_not_contains_nocase?: InputMaybe<Scalars['String']>;
  knight_not_ends_with?: InputMaybe<Scalars['String']>;
  knight_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  knight_not_in?: InputMaybe<Array<Scalars['String']>>;
  knight_not_starts_with?: InputMaybe<Scalars['String']>;
  knight_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  knight_starts_with?: InputMaybe<Scalars['String']>;
  knight_starts_with_nocase?: InputMaybe<Scalars['String']>;
  voter?: InputMaybe<Scalars['String']>;
  voter_contains?: InputMaybe<Scalars['String']>;
  voter_contains_nocase?: InputMaybe<Scalars['String']>;
  voter_ends_with?: InputMaybe<Scalars['String']>;
  voter_ends_with_nocase?: InputMaybe<Scalars['String']>;
  voter_gt?: InputMaybe<Scalars['String']>;
  voter_gte?: InputMaybe<Scalars['String']>;
  voter_in?: InputMaybe<Array<Scalars['String']>>;
  voter_lt?: InputMaybe<Scalars['String']>;
  voter_lte?: InputMaybe<Scalars['String']>;
  voter_not?: InputMaybe<Scalars['String']>;
  voter_not_contains?: InputMaybe<Scalars['String']>;
  voter_not_contains_nocase?: InputMaybe<Scalars['String']>;
  voter_not_ends_with?: InputMaybe<Scalars['String']>;
  voter_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  voter_not_in?: InputMaybe<Array<Scalars['String']>>;
  voter_not_starts_with?: InputMaybe<Scalars['String']>;
  voter_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  voter_starts_with?: InputMaybe<Scalars['String']>;
  voter_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Vote_OrderBy {
  Amount = 'amount',
  Id = 'id',
  Knight = 'knight',
  Voter = 'voter',
}

export type Voter = {
  __typename?: 'Voter';
  id: Scalars['ID'];
  knights: Array<KnightVoter>;
  voteAmount: Scalars['BigInt'];
  voteCount: Scalars['BigInt'];
  votes: Array<Vote>;
};

export type VoterKnightsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<KnightVoter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<KnightVoter_Filter>;
};

export type VoterVotesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Vote_Filter>;
};

export type Voter_Filter = {
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
  voteAmount?: InputMaybe<Scalars['BigInt']>;
  voteAmount_gt?: InputMaybe<Scalars['BigInt']>;
  voteAmount_gte?: InputMaybe<Scalars['BigInt']>;
  voteAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  voteAmount_lt?: InputMaybe<Scalars['BigInt']>;
  voteAmount_lte?: InputMaybe<Scalars['BigInt']>;
  voteAmount_not?: InputMaybe<Scalars['BigInt']>;
  voteAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  voteCount?: InputMaybe<Scalars['BigInt']>;
  voteCount_gt?: InputMaybe<Scalars['BigInt']>;
  voteCount_gte?: InputMaybe<Scalars['BigInt']>;
  voteCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  voteCount_lt?: InputMaybe<Scalars['BigInt']>;
  voteCount_lte?: InputMaybe<Scalars['BigInt']>;
  voteCount_not?: InputMaybe<Scalars['BigInt']>;
  voteCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Voter_OrderBy {
  Id = 'id',
  Knights = 'knights',
  VoteAmount = 'voteAmount',
  VoteCount = 'voteCount',
  Votes = 'votes',
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
  Deny = 'deny',
}

export const KnightFragmentDoc = gql`
  fragment Knight on Knight {
    id
    voters {
      id
    }
    votes {
      id
    }
    voteCount
    voteAmount
  }
`;
export const KnightRoundsDocument = gql`
  query KnightRounds($id: ID!, $block: Block_height) {
    knight(id: $id, block: $block) {
      ...Knight
    }
  }
  ${KnightFragmentDoc}
`;
export const KnightsRoundsDocument = gql`
  query KnightsRounds(
    $block: Block_height
    $first: Int = 100
    $skip: Int = 0
    $orderBy: Knight_orderBy
    $orderDirection: OrderDirection
    $where: Knight_filter
  ) {
    knights(
      block: $block
      first: $first
      skip: $skip
      where: $where
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      ...Knight
    }
  }
  ${KnightFragmentDoc}
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    KnightRounds(
      variables: KnightRoundsQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<KnightRoundsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<KnightRoundsQuery>(KnightRoundsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'KnightRounds',
        'query',
      );
    },
    KnightsRounds(
      variables?: KnightsRoundsQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<KnightsRoundsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<KnightsRoundsQuery>(KnightsRoundsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'KnightsRounds',
        'query',
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export type KnightFragment = {
  __typename?: 'Knight';
  id: string;
  voteCount: any;
  voteAmount: any;
  voters: Array<{ __typename?: 'KnightVoter'; id: string }>;
  votes: Array<{ __typename?: 'Vote'; id: string }>;
};

export type KnightRoundsQueryVariables = Exact<{
  id: Scalars['ID'];
  block?: InputMaybe<Block_Height>;
}>;

export type KnightRoundsQuery = {
  __typename?: 'Query';
  knight?: {
    __typename?: 'Knight';
    id: string;
    voteCount: any;
    voteAmount: any;
    voters: Array<{ __typename?: 'KnightVoter'; id: string }>;
    votes: Array<{ __typename?: 'Vote'; id: string }>;
  } | null;
};

export type KnightsRoundsQueryVariables = Exact<{
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Knight_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Knight_Filter>;
}>;

export type KnightsRoundsQuery = {
  __typename?: 'Query';
  knights: Array<{
    __typename?: 'Knight';
    id: string;
    voteCount: any;
    voteAmount: any;
    voters: Array<{ __typename?: 'KnightVoter'; id: string }>;
    votes: Array<{ __typename?: 'Vote'; id: string }>;
  }>;
};
