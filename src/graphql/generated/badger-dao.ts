import { GraphQLClient } from 'graphql-request';
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

export type Account = {
  __typename?: 'Account';
  /** User ethereum address */
  id: Scalars['ID'];
  vaultBalances: Array<AccountVaultBalance>;
  /** Account deposits */
  deposits: Array<Deposit>;
  /** Account withdrawals */
  withdrawals: Array<Deposit>;
  /** Incoming transfers */
  receivedTransfers: Array<Transfer>;
  /** Outgoing transfers */
  sentTransfers: Array<Transfer>;
};

export type AccountVaultBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AccountVaultBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AccountVaultBalance_Filter>;
};

export type AccountDepositsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Deposit_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Deposit_Filter>;
};

export type AccountWithdrawalsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Deposit_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Deposit_Filter>;
};

export type AccountReceivedTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transfer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Transfer_Filter>;
};

export type AccountSentTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transfer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Transfer_Filter>;
};

export type AccountVaultBalance = {
  __typename?: 'AccountVaultBalance';
  id: Scalars['ID'];
  vault: Vault;
  account: Account;
  /** Deposit/withdrawal token */
  underlyingToken: Token;
  shareToken: Token;
  /** Net deposits of a given Account within a given Vault. Transfers between accounts are taken into consideration for this metric */
  netDeposits: Scalars['BigDecimal'];
  /** Total tokens deposited by this Account in Vault */
  totalDeposited: Scalars['BigDecimal'];
  /** Total tokens withdrawn by this Account in Vault */
  totalWithdrawn: Scalars['BigDecimal'];
  /** Total tokens sent to another account by this Account in Vault */
  totalSent: Scalars['BigDecimal'];
  /** Total tokens received from another account by this Account in Vault */
  totalReceived: Scalars['BigDecimal'];
  /** Shares are the token minted by the Vault */
  shareBalance: Scalars['BigDecimal'];
  totalSharesMinted: Scalars['BigDecimal'];
  totalSharesBurned: Scalars['BigDecimal'];
  totalSharesSent: Scalars['BigDecimal'];
  totalSharesReceived: Scalars['BigDecimal'];
  /** Net deposits of a given Account within a given Vault. Transfers between accounts are taken into consideration for this metric */
  netDepositsRaw: Scalars['BigInt'];
  /** Total tokens deposited by this Account in Vault */
  totalDepositedRaw: Scalars['BigInt'];
  /** Total tokens withdrawn by this Account in Vault */
  totalWithdrawnRaw: Scalars['BigInt'];
  /** Total tokens sent to another account by this Account in Vault */
  totalSentRaw: Scalars['BigInt'];
  /** Total tokens received from another account by this Account in Vault */
  totalReceivedRaw: Scalars['BigInt'];
  /** Shares are the token minted by the Vault */
  shareBalanceRaw: Scalars['BigInt'];
  totalSharesMintedRaw: Scalars['BigInt'];
  totalSharesBurnedRaw: Scalars['BigInt'];
  totalSharesSentRaw: Scalars['BigInt'];
  totalSharesReceivedRaw: Scalars['BigInt'];
};

export type AccountVaultBalance_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  vault?: Maybe<Scalars['String']>;
  vault_not?: Maybe<Scalars['String']>;
  vault_gt?: Maybe<Scalars['String']>;
  vault_lt?: Maybe<Scalars['String']>;
  vault_gte?: Maybe<Scalars['String']>;
  vault_lte?: Maybe<Scalars['String']>;
  vault_in?: Maybe<Array<Scalars['String']>>;
  vault_not_in?: Maybe<Array<Scalars['String']>>;
  vault_contains?: Maybe<Scalars['String']>;
  vault_not_contains?: Maybe<Scalars['String']>;
  vault_starts_with?: Maybe<Scalars['String']>;
  vault_not_starts_with?: Maybe<Scalars['String']>;
  vault_ends_with?: Maybe<Scalars['String']>;
  vault_not_ends_with?: Maybe<Scalars['String']>;
  account?: Maybe<Scalars['String']>;
  account_not?: Maybe<Scalars['String']>;
  account_gt?: Maybe<Scalars['String']>;
  account_lt?: Maybe<Scalars['String']>;
  account_gte?: Maybe<Scalars['String']>;
  account_lte?: Maybe<Scalars['String']>;
  account_in?: Maybe<Array<Scalars['String']>>;
  account_not_in?: Maybe<Array<Scalars['String']>>;
  account_contains?: Maybe<Scalars['String']>;
  account_not_contains?: Maybe<Scalars['String']>;
  account_starts_with?: Maybe<Scalars['String']>;
  account_not_starts_with?: Maybe<Scalars['String']>;
  account_ends_with?: Maybe<Scalars['String']>;
  account_not_ends_with?: Maybe<Scalars['String']>;
  underlyingToken?: Maybe<Scalars['String']>;
  underlyingToken_not?: Maybe<Scalars['String']>;
  underlyingToken_gt?: Maybe<Scalars['String']>;
  underlyingToken_lt?: Maybe<Scalars['String']>;
  underlyingToken_gte?: Maybe<Scalars['String']>;
  underlyingToken_lte?: Maybe<Scalars['String']>;
  underlyingToken_in?: Maybe<Array<Scalars['String']>>;
  underlyingToken_not_in?: Maybe<Array<Scalars['String']>>;
  underlyingToken_contains?: Maybe<Scalars['String']>;
  underlyingToken_not_contains?: Maybe<Scalars['String']>;
  underlyingToken_starts_with?: Maybe<Scalars['String']>;
  underlyingToken_not_starts_with?: Maybe<Scalars['String']>;
  underlyingToken_ends_with?: Maybe<Scalars['String']>;
  underlyingToken_not_ends_with?: Maybe<Scalars['String']>;
  shareToken?: Maybe<Scalars['String']>;
  shareToken_not?: Maybe<Scalars['String']>;
  shareToken_gt?: Maybe<Scalars['String']>;
  shareToken_lt?: Maybe<Scalars['String']>;
  shareToken_gte?: Maybe<Scalars['String']>;
  shareToken_lte?: Maybe<Scalars['String']>;
  shareToken_in?: Maybe<Array<Scalars['String']>>;
  shareToken_not_in?: Maybe<Array<Scalars['String']>>;
  shareToken_contains?: Maybe<Scalars['String']>;
  shareToken_not_contains?: Maybe<Scalars['String']>;
  shareToken_starts_with?: Maybe<Scalars['String']>;
  shareToken_not_starts_with?: Maybe<Scalars['String']>;
  shareToken_ends_with?: Maybe<Scalars['String']>;
  shareToken_not_ends_with?: Maybe<Scalars['String']>;
  netDeposits?: Maybe<Scalars['BigDecimal']>;
  netDeposits_not?: Maybe<Scalars['BigDecimal']>;
  netDeposits_gt?: Maybe<Scalars['BigDecimal']>;
  netDeposits_lt?: Maybe<Scalars['BigDecimal']>;
  netDeposits_gte?: Maybe<Scalars['BigDecimal']>;
  netDeposits_lte?: Maybe<Scalars['BigDecimal']>;
  netDeposits_in?: Maybe<Array<Scalars['BigDecimal']>>;
  netDeposits_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalDeposited?: Maybe<Scalars['BigDecimal']>;
  totalDeposited_not?: Maybe<Scalars['BigDecimal']>;
  totalDeposited_gt?: Maybe<Scalars['BigDecimal']>;
  totalDeposited_lt?: Maybe<Scalars['BigDecimal']>;
  totalDeposited_gte?: Maybe<Scalars['BigDecimal']>;
  totalDeposited_lte?: Maybe<Scalars['BigDecimal']>;
  totalDeposited_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalDeposited_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalWithdrawn?: Maybe<Scalars['BigDecimal']>;
  totalWithdrawn_not?: Maybe<Scalars['BigDecimal']>;
  totalWithdrawn_gt?: Maybe<Scalars['BigDecimal']>;
  totalWithdrawn_lt?: Maybe<Scalars['BigDecimal']>;
  totalWithdrawn_gte?: Maybe<Scalars['BigDecimal']>;
  totalWithdrawn_lte?: Maybe<Scalars['BigDecimal']>;
  totalWithdrawn_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalWithdrawn_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSent?: Maybe<Scalars['BigDecimal']>;
  totalSent_not?: Maybe<Scalars['BigDecimal']>;
  totalSent_gt?: Maybe<Scalars['BigDecimal']>;
  totalSent_lt?: Maybe<Scalars['BigDecimal']>;
  totalSent_gte?: Maybe<Scalars['BigDecimal']>;
  totalSent_lte?: Maybe<Scalars['BigDecimal']>;
  totalSent_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSent_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalReceived?: Maybe<Scalars['BigDecimal']>;
  totalReceived_not?: Maybe<Scalars['BigDecimal']>;
  totalReceived_gt?: Maybe<Scalars['BigDecimal']>;
  totalReceived_lt?: Maybe<Scalars['BigDecimal']>;
  totalReceived_gte?: Maybe<Scalars['BigDecimal']>;
  totalReceived_lte?: Maybe<Scalars['BigDecimal']>;
  totalReceived_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalReceived_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  shareBalance?: Maybe<Scalars['BigDecimal']>;
  shareBalance_not?: Maybe<Scalars['BigDecimal']>;
  shareBalance_gt?: Maybe<Scalars['BigDecimal']>;
  shareBalance_lt?: Maybe<Scalars['BigDecimal']>;
  shareBalance_gte?: Maybe<Scalars['BigDecimal']>;
  shareBalance_lte?: Maybe<Scalars['BigDecimal']>;
  shareBalance_in?: Maybe<Array<Scalars['BigDecimal']>>;
  shareBalance_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSharesMinted?: Maybe<Scalars['BigDecimal']>;
  totalSharesMinted_not?: Maybe<Scalars['BigDecimal']>;
  totalSharesMinted_gt?: Maybe<Scalars['BigDecimal']>;
  totalSharesMinted_lt?: Maybe<Scalars['BigDecimal']>;
  totalSharesMinted_gte?: Maybe<Scalars['BigDecimal']>;
  totalSharesMinted_lte?: Maybe<Scalars['BigDecimal']>;
  totalSharesMinted_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSharesMinted_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSharesBurned?: Maybe<Scalars['BigDecimal']>;
  totalSharesBurned_not?: Maybe<Scalars['BigDecimal']>;
  totalSharesBurned_gt?: Maybe<Scalars['BigDecimal']>;
  totalSharesBurned_lt?: Maybe<Scalars['BigDecimal']>;
  totalSharesBurned_gte?: Maybe<Scalars['BigDecimal']>;
  totalSharesBurned_lte?: Maybe<Scalars['BigDecimal']>;
  totalSharesBurned_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSharesBurned_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSharesSent?: Maybe<Scalars['BigDecimal']>;
  totalSharesSent_not?: Maybe<Scalars['BigDecimal']>;
  totalSharesSent_gt?: Maybe<Scalars['BigDecimal']>;
  totalSharesSent_lt?: Maybe<Scalars['BigDecimal']>;
  totalSharesSent_gte?: Maybe<Scalars['BigDecimal']>;
  totalSharesSent_lte?: Maybe<Scalars['BigDecimal']>;
  totalSharesSent_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSharesSent_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSharesReceived?: Maybe<Scalars['BigDecimal']>;
  totalSharesReceived_not?: Maybe<Scalars['BigDecimal']>;
  totalSharesReceived_gt?: Maybe<Scalars['BigDecimal']>;
  totalSharesReceived_lt?: Maybe<Scalars['BigDecimal']>;
  totalSharesReceived_gte?: Maybe<Scalars['BigDecimal']>;
  totalSharesReceived_lte?: Maybe<Scalars['BigDecimal']>;
  totalSharesReceived_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSharesReceived_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  netDepositsRaw?: Maybe<Scalars['BigInt']>;
  netDepositsRaw_not?: Maybe<Scalars['BigInt']>;
  netDepositsRaw_gt?: Maybe<Scalars['BigInt']>;
  netDepositsRaw_lt?: Maybe<Scalars['BigInt']>;
  netDepositsRaw_gte?: Maybe<Scalars['BigInt']>;
  netDepositsRaw_lte?: Maybe<Scalars['BigInt']>;
  netDepositsRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  netDepositsRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalDepositedRaw?: Maybe<Scalars['BigInt']>;
  totalDepositedRaw_not?: Maybe<Scalars['BigInt']>;
  totalDepositedRaw_gt?: Maybe<Scalars['BigInt']>;
  totalDepositedRaw_lt?: Maybe<Scalars['BigInt']>;
  totalDepositedRaw_gte?: Maybe<Scalars['BigInt']>;
  totalDepositedRaw_lte?: Maybe<Scalars['BigInt']>;
  totalDepositedRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  totalDepositedRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalWithdrawnRaw?: Maybe<Scalars['BigInt']>;
  totalWithdrawnRaw_not?: Maybe<Scalars['BigInt']>;
  totalWithdrawnRaw_gt?: Maybe<Scalars['BigInt']>;
  totalWithdrawnRaw_lt?: Maybe<Scalars['BigInt']>;
  totalWithdrawnRaw_gte?: Maybe<Scalars['BigInt']>;
  totalWithdrawnRaw_lte?: Maybe<Scalars['BigInt']>;
  totalWithdrawnRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  totalWithdrawnRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSentRaw?: Maybe<Scalars['BigInt']>;
  totalSentRaw_not?: Maybe<Scalars['BigInt']>;
  totalSentRaw_gt?: Maybe<Scalars['BigInt']>;
  totalSentRaw_lt?: Maybe<Scalars['BigInt']>;
  totalSentRaw_gte?: Maybe<Scalars['BigInt']>;
  totalSentRaw_lte?: Maybe<Scalars['BigInt']>;
  totalSentRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSentRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalReceivedRaw?: Maybe<Scalars['BigInt']>;
  totalReceivedRaw_not?: Maybe<Scalars['BigInt']>;
  totalReceivedRaw_gt?: Maybe<Scalars['BigInt']>;
  totalReceivedRaw_lt?: Maybe<Scalars['BigInt']>;
  totalReceivedRaw_gte?: Maybe<Scalars['BigInt']>;
  totalReceivedRaw_lte?: Maybe<Scalars['BigInt']>;
  totalReceivedRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  totalReceivedRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  shareBalanceRaw?: Maybe<Scalars['BigInt']>;
  shareBalanceRaw_not?: Maybe<Scalars['BigInt']>;
  shareBalanceRaw_gt?: Maybe<Scalars['BigInt']>;
  shareBalanceRaw_lt?: Maybe<Scalars['BigInt']>;
  shareBalanceRaw_gte?: Maybe<Scalars['BigInt']>;
  shareBalanceRaw_lte?: Maybe<Scalars['BigInt']>;
  shareBalanceRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  shareBalanceRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSharesMintedRaw?: Maybe<Scalars['BigInt']>;
  totalSharesMintedRaw_not?: Maybe<Scalars['BigInt']>;
  totalSharesMintedRaw_gt?: Maybe<Scalars['BigInt']>;
  totalSharesMintedRaw_lt?: Maybe<Scalars['BigInt']>;
  totalSharesMintedRaw_gte?: Maybe<Scalars['BigInt']>;
  totalSharesMintedRaw_lte?: Maybe<Scalars['BigInt']>;
  totalSharesMintedRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSharesMintedRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSharesBurnedRaw?: Maybe<Scalars['BigInt']>;
  totalSharesBurnedRaw_not?: Maybe<Scalars['BigInt']>;
  totalSharesBurnedRaw_gt?: Maybe<Scalars['BigInt']>;
  totalSharesBurnedRaw_lt?: Maybe<Scalars['BigInt']>;
  totalSharesBurnedRaw_gte?: Maybe<Scalars['BigInt']>;
  totalSharesBurnedRaw_lte?: Maybe<Scalars['BigInt']>;
  totalSharesBurnedRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSharesBurnedRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSharesSentRaw?: Maybe<Scalars['BigInt']>;
  totalSharesSentRaw_not?: Maybe<Scalars['BigInt']>;
  totalSharesSentRaw_gt?: Maybe<Scalars['BigInt']>;
  totalSharesSentRaw_lt?: Maybe<Scalars['BigInt']>;
  totalSharesSentRaw_gte?: Maybe<Scalars['BigInt']>;
  totalSharesSentRaw_lte?: Maybe<Scalars['BigInt']>;
  totalSharesSentRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSharesSentRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSharesReceivedRaw?: Maybe<Scalars['BigInt']>;
  totalSharesReceivedRaw_not?: Maybe<Scalars['BigInt']>;
  totalSharesReceivedRaw_gt?: Maybe<Scalars['BigInt']>;
  totalSharesReceivedRaw_lt?: Maybe<Scalars['BigInt']>;
  totalSharesReceivedRaw_gte?: Maybe<Scalars['BigInt']>;
  totalSharesReceivedRaw_lte?: Maybe<Scalars['BigInt']>;
  totalSharesReceivedRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSharesReceivedRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum AccountVaultBalance_OrderBy {
  Id = 'id',
  Vault = 'vault',
  Account = 'account',
  UnderlyingToken = 'underlyingToken',
  ShareToken = 'shareToken',
  NetDeposits = 'netDeposits',
  TotalDeposited = 'totalDeposited',
  TotalWithdrawn = 'totalWithdrawn',
  TotalSent = 'totalSent',
  TotalReceived = 'totalReceived',
  ShareBalance = 'shareBalance',
  TotalSharesMinted = 'totalSharesMinted',
  TotalSharesBurned = 'totalSharesBurned',
  TotalSharesSent = 'totalSharesSent',
  TotalSharesReceived = 'totalSharesReceived',
  NetDepositsRaw = 'netDepositsRaw',
  TotalDepositedRaw = 'totalDepositedRaw',
  TotalWithdrawnRaw = 'totalWithdrawnRaw',
  TotalSentRaw = 'totalSentRaw',
  TotalReceivedRaw = 'totalReceivedRaw',
  ShareBalanceRaw = 'shareBalanceRaw',
  TotalSharesMintedRaw = 'totalSharesMintedRaw',
  TotalSharesBurnedRaw = 'totalSharesBurnedRaw',
  TotalSharesSentRaw = 'totalSharesSentRaw',
  TotalSharesReceivedRaw = 'totalSharesReceivedRaw',
}

export type Account_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
};

export enum Account_OrderBy {
  Id = 'id',
  VaultBalances = 'vaultBalances',
  Deposits = 'deposits',
  Withdrawals = 'withdrawals',
  ReceivedTransfers = 'receivedTransfers',
  SentTransfers = 'sentTransfers',
}

export type Action = {
  id: Scalars['ID'];
  vault: Vault;
  account: Account;
  amount: Scalars['BigInt'];
  shares: Scalars['BigInt'];
  pricePerFullShare: Scalars['BigInt'];
  vaultBalance: Scalars['BigInt'];
  totalSupply: Scalars['BigInt'];
  available: Scalars['BigInt'];
  transaction: Transaction;
};

export type Action_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  vault?: Maybe<Scalars['String']>;
  vault_not?: Maybe<Scalars['String']>;
  vault_gt?: Maybe<Scalars['String']>;
  vault_lt?: Maybe<Scalars['String']>;
  vault_gte?: Maybe<Scalars['String']>;
  vault_lte?: Maybe<Scalars['String']>;
  vault_in?: Maybe<Array<Scalars['String']>>;
  vault_not_in?: Maybe<Array<Scalars['String']>>;
  vault_contains?: Maybe<Scalars['String']>;
  vault_not_contains?: Maybe<Scalars['String']>;
  vault_starts_with?: Maybe<Scalars['String']>;
  vault_not_starts_with?: Maybe<Scalars['String']>;
  vault_ends_with?: Maybe<Scalars['String']>;
  vault_not_ends_with?: Maybe<Scalars['String']>;
  account?: Maybe<Scalars['String']>;
  account_not?: Maybe<Scalars['String']>;
  account_gt?: Maybe<Scalars['String']>;
  account_lt?: Maybe<Scalars['String']>;
  account_gte?: Maybe<Scalars['String']>;
  account_lte?: Maybe<Scalars['String']>;
  account_in?: Maybe<Array<Scalars['String']>>;
  account_not_in?: Maybe<Array<Scalars['String']>>;
  account_contains?: Maybe<Scalars['String']>;
  account_not_contains?: Maybe<Scalars['String']>;
  account_starts_with?: Maybe<Scalars['String']>;
  account_not_starts_with?: Maybe<Scalars['String']>;
  account_ends_with?: Maybe<Scalars['String']>;
  account_not_ends_with?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  shares?: Maybe<Scalars['BigInt']>;
  shares_not?: Maybe<Scalars['BigInt']>;
  shares_gt?: Maybe<Scalars['BigInt']>;
  shares_lt?: Maybe<Scalars['BigInt']>;
  shares_gte?: Maybe<Scalars['BigInt']>;
  shares_lte?: Maybe<Scalars['BigInt']>;
  shares_in?: Maybe<Array<Scalars['BigInt']>>;
  shares_not_in?: Maybe<Array<Scalars['BigInt']>>;
  pricePerFullShare?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_not?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_gt?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_lt?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_gte?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_lte?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_in?: Maybe<Array<Scalars['BigInt']>>;
  pricePerFullShare_not_in?: Maybe<Array<Scalars['BigInt']>>;
  vaultBalance?: Maybe<Scalars['BigInt']>;
  vaultBalance_not?: Maybe<Scalars['BigInt']>;
  vaultBalance_gt?: Maybe<Scalars['BigInt']>;
  vaultBalance_lt?: Maybe<Scalars['BigInt']>;
  vaultBalance_gte?: Maybe<Scalars['BigInt']>;
  vaultBalance_lte?: Maybe<Scalars['BigInt']>;
  vaultBalance_in?: Maybe<Array<Scalars['BigInt']>>;
  vaultBalance_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSupply?: Maybe<Scalars['BigInt']>;
  totalSupply_not?: Maybe<Scalars['BigInt']>;
  totalSupply_gt?: Maybe<Scalars['BigInt']>;
  totalSupply_lt?: Maybe<Scalars['BigInt']>;
  totalSupply_gte?: Maybe<Scalars['BigInt']>;
  totalSupply_lte?: Maybe<Scalars['BigInt']>;
  totalSupply_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSupply_not_in?: Maybe<Array<Scalars['BigInt']>>;
  available?: Maybe<Scalars['BigInt']>;
  available_not?: Maybe<Scalars['BigInt']>;
  available_gt?: Maybe<Scalars['BigInt']>;
  available_lt?: Maybe<Scalars['BigInt']>;
  available_gte?: Maybe<Scalars['BigInt']>;
  available_lte?: Maybe<Scalars['BigInt']>;
  available_in?: Maybe<Array<Scalars['BigInt']>>;
  available_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
};

export enum Action_OrderBy {
  Id = 'id',
  Vault = 'vault',
  Account = 'account',
  Amount = 'amount',
  Shares = 'shares',
  PricePerFullShare = 'pricePerFullShare',
  VaultBalance = 'vaultBalance',
  TotalSupply = 'totalSupply',
  Available = 'available',
  Transaction = 'transaction',
}

export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
};

export type Controller = {
  __typename?: 'Controller';
  /** Ethereum address */
  id: Scalars['ID'];
  vault: Vault;
  activeOnVaults?: Maybe<Array<Vault>>;
};

export type ControllerActiveOnVaultsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Vault_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Vault_Filter>;
};

export type Controller_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  vault?: Maybe<Scalars['String']>;
  vault_not?: Maybe<Scalars['String']>;
  vault_gt?: Maybe<Scalars['String']>;
  vault_lt?: Maybe<Scalars['String']>;
  vault_gte?: Maybe<Scalars['String']>;
  vault_lte?: Maybe<Scalars['String']>;
  vault_in?: Maybe<Array<Scalars['String']>>;
  vault_not_in?: Maybe<Array<Scalars['String']>>;
  vault_contains?: Maybe<Scalars['String']>;
  vault_not_contains?: Maybe<Scalars['String']>;
  vault_starts_with?: Maybe<Scalars['String']>;
  vault_not_starts_with?: Maybe<Scalars['String']>;
  vault_ends_with?: Maybe<Scalars['String']>;
  vault_not_ends_with?: Maybe<Scalars['String']>;
};

export enum Controller_OrderBy {
  Id = 'id',
  Vault = 'vault',
  ActiveOnVaults = 'activeOnVaults',
}

export type Deposit = Action & {
  __typename?: 'Deposit';
  id: Scalars['ID'];
  vault: Vault;
  account: Account;
  amount: Scalars['BigInt'];
  shares: Scalars['BigInt'];
  pricePerFullShare: Scalars['BigInt'];
  vaultBalance: Scalars['BigInt'];
  totalSupply: Scalars['BigInt'];
  available: Scalars['BigInt'];
  transaction: Transaction;
};

export type Deposit_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  vault?: Maybe<Scalars['String']>;
  vault_not?: Maybe<Scalars['String']>;
  vault_gt?: Maybe<Scalars['String']>;
  vault_lt?: Maybe<Scalars['String']>;
  vault_gte?: Maybe<Scalars['String']>;
  vault_lte?: Maybe<Scalars['String']>;
  vault_in?: Maybe<Array<Scalars['String']>>;
  vault_not_in?: Maybe<Array<Scalars['String']>>;
  vault_contains?: Maybe<Scalars['String']>;
  vault_not_contains?: Maybe<Scalars['String']>;
  vault_starts_with?: Maybe<Scalars['String']>;
  vault_not_starts_with?: Maybe<Scalars['String']>;
  vault_ends_with?: Maybe<Scalars['String']>;
  vault_not_ends_with?: Maybe<Scalars['String']>;
  account?: Maybe<Scalars['String']>;
  account_not?: Maybe<Scalars['String']>;
  account_gt?: Maybe<Scalars['String']>;
  account_lt?: Maybe<Scalars['String']>;
  account_gte?: Maybe<Scalars['String']>;
  account_lte?: Maybe<Scalars['String']>;
  account_in?: Maybe<Array<Scalars['String']>>;
  account_not_in?: Maybe<Array<Scalars['String']>>;
  account_contains?: Maybe<Scalars['String']>;
  account_not_contains?: Maybe<Scalars['String']>;
  account_starts_with?: Maybe<Scalars['String']>;
  account_not_starts_with?: Maybe<Scalars['String']>;
  account_ends_with?: Maybe<Scalars['String']>;
  account_not_ends_with?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  shares?: Maybe<Scalars['BigInt']>;
  shares_not?: Maybe<Scalars['BigInt']>;
  shares_gt?: Maybe<Scalars['BigInt']>;
  shares_lt?: Maybe<Scalars['BigInt']>;
  shares_gte?: Maybe<Scalars['BigInt']>;
  shares_lte?: Maybe<Scalars['BigInt']>;
  shares_in?: Maybe<Array<Scalars['BigInt']>>;
  shares_not_in?: Maybe<Array<Scalars['BigInt']>>;
  pricePerFullShare?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_not?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_gt?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_lt?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_gte?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_lte?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_in?: Maybe<Array<Scalars['BigInt']>>;
  pricePerFullShare_not_in?: Maybe<Array<Scalars['BigInt']>>;
  vaultBalance?: Maybe<Scalars['BigInt']>;
  vaultBalance_not?: Maybe<Scalars['BigInt']>;
  vaultBalance_gt?: Maybe<Scalars['BigInt']>;
  vaultBalance_lt?: Maybe<Scalars['BigInt']>;
  vaultBalance_gte?: Maybe<Scalars['BigInt']>;
  vaultBalance_lte?: Maybe<Scalars['BigInt']>;
  vaultBalance_in?: Maybe<Array<Scalars['BigInt']>>;
  vaultBalance_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSupply?: Maybe<Scalars['BigInt']>;
  totalSupply_not?: Maybe<Scalars['BigInt']>;
  totalSupply_gt?: Maybe<Scalars['BigInt']>;
  totalSupply_lt?: Maybe<Scalars['BigInt']>;
  totalSupply_gte?: Maybe<Scalars['BigInt']>;
  totalSupply_lte?: Maybe<Scalars['BigInt']>;
  totalSupply_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSupply_not_in?: Maybe<Array<Scalars['BigInt']>>;
  available?: Maybe<Scalars['BigInt']>;
  available_not?: Maybe<Scalars['BigInt']>;
  available_gt?: Maybe<Scalars['BigInt']>;
  available_lt?: Maybe<Scalars['BigInt']>;
  available_gte?: Maybe<Scalars['BigInt']>;
  available_lte?: Maybe<Scalars['BigInt']>;
  available_in?: Maybe<Array<Scalars['BigInt']>>;
  available_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
};

export enum Deposit_OrderBy {
  Id = 'id',
  Vault = 'vault',
  Account = 'account',
  Amount = 'amount',
  Shares = 'shares',
  PricePerFullShare = 'pricePerFullShare',
  VaultBalance = 'vaultBalance',
  TotalSupply = 'totalSupply',
  Available = 'available',
  Transaction = 'transaction',
}

export type Geyser = {
  __typename?: 'Geyser';
  id: Scalars['ID'];
  totalStaked: Scalars['BigInt'];
  stakeEvents: Array<StakedEvent>;
  unstakeEvents: Array<UnstakedEvent>;
};

export type GeyserStakeEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakedEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakedEvent_Filter>;
};

export type GeyserUnstakeEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UnstakedEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<UnstakedEvent_Filter>;
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
  totalStaked?: Maybe<Scalars['BigInt']>;
  totalStaked_not?: Maybe<Scalars['BigInt']>;
  totalStaked_gt?: Maybe<Scalars['BigInt']>;
  totalStaked_lt?: Maybe<Scalars['BigInt']>;
  totalStaked_gte?: Maybe<Scalars['BigInt']>;
  totalStaked_lte?: Maybe<Scalars['BigInt']>;
  totalStaked_in?: Maybe<Array<Scalars['BigInt']>>;
  totalStaked_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Geyser_OrderBy {
  Id = 'id',
  TotalStaked = 'totalStaked',
  StakeEvents = 'stakeEvents',
  UnstakeEvents = 'unstakeEvents',
}

export type Harvest = {
  __typename?: 'Harvest';
  id: Scalars['ID'];
  vault: Vault;
  strategy: Strategy;
  pricePerFullShareBefore: Scalars['BigDecimal'];
  pricePerFullShareAfter: Scalars['BigDecimal'];
  vaultBalanceBefore: Scalars['BigDecimal'];
  vaultBalanceAfter: Scalars['BigDecimal'];
  strategyBalanceBefore: Scalars['BigDecimal'];
  strategyBalanceAfter: Scalars['BigDecimal'];
  earnings: Scalars['BigDecimal'];
  pricePerFullShareBeforeRaw: Scalars['BigInt'];
  pricePerFullShareAfterRaw: Scalars['BigInt'];
  vaultBalanceBeforeRaw: Scalars['BigInt'];
  vaultBalanceAfterRaw: Scalars['BigInt'];
  strategyBalanceBeforeRaw: Scalars['BigInt'];
  strategyBalanceAfterRaw: Scalars['BigInt'];
  earningsRaw: Scalars['BigInt'];
  transaction: Transaction;
};

export type HarvestEvent = {
  __typename?: 'HarvestEvent';
  id: Scalars['ID'];
  sourceAddress: Scalars['String'];
  sourceId: Scalars['String'];
};

export type HarvestEvent_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  sourceAddress?: Maybe<Scalars['String']>;
  sourceAddress_not?: Maybe<Scalars['String']>;
  sourceAddress_gt?: Maybe<Scalars['String']>;
  sourceAddress_lt?: Maybe<Scalars['String']>;
  sourceAddress_gte?: Maybe<Scalars['String']>;
  sourceAddress_lte?: Maybe<Scalars['String']>;
  sourceAddress_in?: Maybe<Array<Scalars['String']>>;
  sourceAddress_not_in?: Maybe<Array<Scalars['String']>>;
  sourceAddress_contains?: Maybe<Scalars['String']>;
  sourceAddress_not_contains?: Maybe<Scalars['String']>;
  sourceAddress_starts_with?: Maybe<Scalars['String']>;
  sourceAddress_not_starts_with?: Maybe<Scalars['String']>;
  sourceAddress_ends_with?: Maybe<Scalars['String']>;
  sourceAddress_not_ends_with?: Maybe<Scalars['String']>;
  sourceId?: Maybe<Scalars['String']>;
  sourceId_not?: Maybe<Scalars['String']>;
  sourceId_gt?: Maybe<Scalars['String']>;
  sourceId_lt?: Maybe<Scalars['String']>;
  sourceId_gte?: Maybe<Scalars['String']>;
  sourceId_lte?: Maybe<Scalars['String']>;
  sourceId_in?: Maybe<Array<Scalars['String']>>;
  sourceId_not_in?: Maybe<Array<Scalars['String']>>;
  sourceId_contains?: Maybe<Scalars['String']>;
  sourceId_not_contains?: Maybe<Scalars['String']>;
  sourceId_starts_with?: Maybe<Scalars['String']>;
  sourceId_not_starts_with?: Maybe<Scalars['String']>;
  sourceId_ends_with?: Maybe<Scalars['String']>;
  sourceId_not_ends_with?: Maybe<Scalars['String']>;
};

export enum HarvestEvent_OrderBy {
  Id = 'id',
  SourceAddress = 'sourceAddress',
  SourceId = 'sourceId',
}

export type HarvestFarmEvent = {
  __typename?: 'HarvestFarmEvent';
  id: Scalars['ID'];
  sourceAddress: Scalars['Bytes'];
  sourceId: Scalars['String'];
  displayName: Scalars['String'];
  imageUrl: Scalars['String'];
};

export type HarvestFarmEvent_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  sourceAddress?: Maybe<Scalars['Bytes']>;
  sourceAddress_not?: Maybe<Scalars['Bytes']>;
  sourceAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  sourceAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sourceAddress_contains?: Maybe<Scalars['Bytes']>;
  sourceAddress_not_contains?: Maybe<Scalars['Bytes']>;
  sourceId?: Maybe<Scalars['String']>;
  sourceId_not?: Maybe<Scalars['String']>;
  sourceId_gt?: Maybe<Scalars['String']>;
  sourceId_lt?: Maybe<Scalars['String']>;
  sourceId_gte?: Maybe<Scalars['String']>;
  sourceId_lte?: Maybe<Scalars['String']>;
  sourceId_in?: Maybe<Array<Scalars['String']>>;
  sourceId_not_in?: Maybe<Array<Scalars['String']>>;
  sourceId_contains?: Maybe<Scalars['String']>;
  sourceId_not_contains?: Maybe<Scalars['String']>;
  sourceId_starts_with?: Maybe<Scalars['String']>;
  sourceId_not_starts_with?: Maybe<Scalars['String']>;
  sourceId_ends_with?: Maybe<Scalars['String']>;
  sourceId_not_ends_with?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  displayName_not?: Maybe<Scalars['String']>;
  displayName_gt?: Maybe<Scalars['String']>;
  displayName_lt?: Maybe<Scalars['String']>;
  displayName_gte?: Maybe<Scalars['String']>;
  displayName_lte?: Maybe<Scalars['String']>;
  displayName_in?: Maybe<Array<Scalars['String']>>;
  displayName_not_in?: Maybe<Array<Scalars['String']>>;
  displayName_contains?: Maybe<Scalars['String']>;
  displayName_not_contains?: Maybe<Scalars['String']>;
  displayName_starts_with?: Maybe<Scalars['String']>;
  displayName_not_starts_with?: Maybe<Scalars['String']>;
  displayName_ends_with?: Maybe<Scalars['String']>;
  displayName_not_ends_with?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  imageUrl_not?: Maybe<Scalars['String']>;
  imageUrl_gt?: Maybe<Scalars['String']>;
  imageUrl_lt?: Maybe<Scalars['String']>;
  imageUrl_gte?: Maybe<Scalars['String']>;
  imageUrl_lte?: Maybe<Scalars['String']>;
  imageUrl_in?: Maybe<Array<Scalars['String']>>;
  imageUrl_not_in?: Maybe<Array<Scalars['String']>>;
  imageUrl_contains?: Maybe<Scalars['String']>;
  imageUrl_not_contains?: Maybe<Scalars['String']>;
  imageUrl_starts_with?: Maybe<Scalars['String']>;
  imageUrl_not_starts_with?: Maybe<Scalars['String']>;
  imageUrl_ends_with?: Maybe<Scalars['String']>;
  imageUrl_not_ends_with?: Maybe<Scalars['String']>;
};

export enum HarvestFarmEvent_OrderBy {
  Id = 'id',
  SourceAddress = 'sourceAddress',
  SourceId = 'sourceId',
  DisplayName = 'displayName',
  ImageUrl = 'imageUrl',
}

export type Harvest_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  vault?: Maybe<Scalars['String']>;
  vault_not?: Maybe<Scalars['String']>;
  vault_gt?: Maybe<Scalars['String']>;
  vault_lt?: Maybe<Scalars['String']>;
  vault_gte?: Maybe<Scalars['String']>;
  vault_lte?: Maybe<Scalars['String']>;
  vault_in?: Maybe<Array<Scalars['String']>>;
  vault_not_in?: Maybe<Array<Scalars['String']>>;
  vault_contains?: Maybe<Scalars['String']>;
  vault_not_contains?: Maybe<Scalars['String']>;
  vault_starts_with?: Maybe<Scalars['String']>;
  vault_not_starts_with?: Maybe<Scalars['String']>;
  vault_ends_with?: Maybe<Scalars['String']>;
  vault_not_ends_with?: Maybe<Scalars['String']>;
  strategy?: Maybe<Scalars['String']>;
  strategy_not?: Maybe<Scalars['String']>;
  strategy_gt?: Maybe<Scalars['String']>;
  strategy_lt?: Maybe<Scalars['String']>;
  strategy_gte?: Maybe<Scalars['String']>;
  strategy_lte?: Maybe<Scalars['String']>;
  strategy_in?: Maybe<Array<Scalars['String']>>;
  strategy_not_in?: Maybe<Array<Scalars['String']>>;
  strategy_contains?: Maybe<Scalars['String']>;
  strategy_not_contains?: Maybe<Scalars['String']>;
  strategy_starts_with?: Maybe<Scalars['String']>;
  strategy_not_starts_with?: Maybe<Scalars['String']>;
  strategy_ends_with?: Maybe<Scalars['String']>;
  strategy_not_ends_with?: Maybe<Scalars['String']>;
  pricePerFullShareBefore?: Maybe<Scalars['BigDecimal']>;
  pricePerFullShareBefore_not?: Maybe<Scalars['BigDecimal']>;
  pricePerFullShareBefore_gt?: Maybe<Scalars['BigDecimal']>;
  pricePerFullShareBefore_lt?: Maybe<Scalars['BigDecimal']>;
  pricePerFullShareBefore_gte?: Maybe<Scalars['BigDecimal']>;
  pricePerFullShareBefore_lte?: Maybe<Scalars['BigDecimal']>;
  pricePerFullShareBefore_in?: Maybe<Array<Scalars['BigDecimal']>>;
  pricePerFullShareBefore_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  pricePerFullShareAfter?: Maybe<Scalars['BigDecimal']>;
  pricePerFullShareAfter_not?: Maybe<Scalars['BigDecimal']>;
  pricePerFullShareAfter_gt?: Maybe<Scalars['BigDecimal']>;
  pricePerFullShareAfter_lt?: Maybe<Scalars['BigDecimal']>;
  pricePerFullShareAfter_gte?: Maybe<Scalars['BigDecimal']>;
  pricePerFullShareAfter_lte?: Maybe<Scalars['BigDecimal']>;
  pricePerFullShareAfter_in?: Maybe<Array<Scalars['BigDecimal']>>;
  pricePerFullShareAfter_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  vaultBalanceBefore?: Maybe<Scalars['BigDecimal']>;
  vaultBalanceBefore_not?: Maybe<Scalars['BigDecimal']>;
  vaultBalanceBefore_gt?: Maybe<Scalars['BigDecimal']>;
  vaultBalanceBefore_lt?: Maybe<Scalars['BigDecimal']>;
  vaultBalanceBefore_gte?: Maybe<Scalars['BigDecimal']>;
  vaultBalanceBefore_lte?: Maybe<Scalars['BigDecimal']>;
  vaultBalanceBefore_in?: Maybe<Array<Scalars['BigDecimal']>>;
  vaultBalanceBefore_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  vaultBalanceAfter?: Maybe<Scalars['BigDecimal']>;
  vaultBalanceAfter_not?: Maybe<Scalars['BigDecimal']>;
  vaultBalanceAfter_gt?: Maybe<Scalars['BigDecimal']>;
  vaultBalanceAfter_lt?: Maybe<Scalars['BigDecimal']>;
  vaultBalanceAfter_gte?: Maybe<Scalars['BigDecimal']>;
  vaultBalanceAfter_lte?: Maybe<Scalars['BigDecimal']>;
  vaultBalanceAfter_in?: Maybe<Array<Scalars['BigDecimal']>>;
  vaultBalanceAfter_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  strategyBalanceBefore?: Maybe<Scalars['BigDecimal']>;
  strategyBalanceBefore_not?: Maybe<Scalars['BigDecimal']>;
  strategyBalanceBefore_gt?: Maybe<Scalars['BigDecimal']>;
  strategyBalanceBefore_lt?: Maybe<Scalars['BigDecimal']>;
  strategyBalanceBefore_gte?: Maybe<Scalars['BigDecimal']>;
  strategyBalanceBefore_lte?: Maybe<Scalars['BigDecimal']>;
  strategyBalanceBefore_in?: Maybe<Array<Scalars['BigDecimal']>>;
  strategyBalanceBefore_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  strategyBalanceAfter?: Maybe<Scalars['BigDecimal']>;
  strategyBalanceAfter_not?: Maybe<Scalars['BigDecimal']>;
  strategyBalanceAfter_gt?: Maybe<Scalars['BigDecimal']>;
  strategyBalanceAfter_lt?: Maybe<Scalars['BigDecimal']>;
  strategyBalanceAfter_gte?: Maybe<Scalars['BigDecimal']>;
  strategyBalanceAfter_lte?: Maybe<Scalars['BigDecimal']>;
  strategyBalanceAfter_in?: Maybe<Array<Scalars['BigDecimal']>>;
  strategyBalanceAfter_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  earnings?: Maybe<Scalars['BigDecimal']>;
  earnings_not?: Maybe<Scalars['BigDecimal']>;
  earnings_gt?: Maybe<Scalars['BigDecimal']>;
  earnings_lt?: Maybe<Scalars['BigDecimal']>;
  earnings_gte?: Maybe<Scalars['BigDecimal']>;
  earnings_lte?: Maybe<Scalars['BigDecimal']>;
  earnings_in?: Maybe<Array<Scalars['BigDecimal']>>;
  earnings_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  pricePerFullShareBeforeRaw?: Maybe<Scalars['BigInt']>;
  pricePerFullShareBeforeRaw_not?: Maybe<Scalars['BigInt']>;
  pricePerFullShareBeforeRaw_gt?: Maybe<Scalars['BigInt']>;
  pricePerFullShareBeforeRaw_lt?: Maybe<Scalars['BigInt']>;
  pricePerFullShareBeforeRaw_gte?: Maybe<Scalars['BigInt']>;
  pricePerFullShareBeforeRaw_lte?: Maybe<Scalars['BigInt']>;
  pricePerFullShareBeforeRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  pricePerFullShareBeforeRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  pricePerFullShareAfterRaw?: Maybe<Scalars['BigInt']>;
  pricePerFullShareAfterRaw_not?: Maybe<Scalars['BigInt']>;
  pricePerFullShareAfterRaw_gt?: Maybe<Scalars['BigInt']>;
  pricePerFullShareAfterRaw_lt?: Maybe<Scalars['BigInt']>;
  pricePerFullShareAfterRaw_gte?: Maybe<Scalars['BigInt']>;
  pricePerFullShareAfterRaw_lte?: Maybe<Scalars['BigInt']>;
  pricePerFullShareAfterRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  pricePerFullShareAfterRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  vaultBalanceBeforeRaw?: Maybe<Scalars['BigInt']>;
  vaultBalanceBeforeRaw_not?: Maybe<Scalars['BigInt']>;
  vaultBalanceBeforeRaw_gt?: Maybe<Scalars['BigInt']>;
  vaultBalanceBeforeRaw_lt?: Maybe<Scalars['BigInt']>;
  vaultBalanceBeforeRaw_gte?: Maybe<Scalars['BigInt']>;
  vaultBalanceBeforeRaw_lte?: Maybe<Scalars['BigInt']>;
  vaultBalanceBeforeRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  vaultBalanceBeforeRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  vaultBalanceAfterRaw?: Maybe<Scalars['BigInt']>;
  vaultBalanceAfterRaw_not?: Maybe<Scalars['BigInt']>;
  vaultBalanceAfterRaw_gt?: Maybe<Scalars['BigInt']>;
  vaultBalanceAfterRaw_lt?: Maybe<Scalars['BigInt']>;
  vaultBalanceAfterRaw_gte?: Maybe<Scalars['BigInt']>;
  vaultBalanceAfterRaw_lte?: Maybe<Scalars['BigInt']>;
  vaultBalanceAfterRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  vaultBalanceAfterRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  strategyBalanceBeforeRaw?: Maybe<Scalars['BigInt']>;
  strategyBalanceBeforeRaw_not?: Maybe<Scalars['BigInt']>;
  strategyBalanceBeforeRaw_gt?: Maybe<Scalars['BigInt']>;
  strategyBalanceBeforeRaw_lt?: Maybe<Scalars['BigInt']>;
  strategyBalanceBeforeRaw_gte?: Maybe<Scalars['BigInt']>;
  strategyBalanceBeforeRaw_lte?: Maybe<Scalars['BigInt']>;
  strategyBalanceBeforeRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  strategyBalanceBeforeRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  strategyBalanceAfterRaw?: Maybe<Scalars['BigInt']>;
  strategyBalanceAfterRaw_not?: Maybe<Scalars['BigInt']>;
  strategyBalanceAfterRaw_gt?: Maybe<Scalars['BigInt']>;
  strategyBalanceAfterRaw_lt?: Maybe<Scalars['BigInt']>;
  strategyBalanceAfterRaw_gte?: Maybe<Scalars['BigInt']>;
  strategyBalanceAfterRaw_lte?: Maybe<Scalars['BigInt']>;
  strategyBalanceAfterRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  strategyBalanceAfterRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  earningsRaw?: Maybe<Scalars['BigInt']>;
  earningsRaw_not?: Maybe<Scalars['BigInt']>;
  earningsRaw_gt?: Maybe<Scalars['BigInt']>;
  earningsRaw_lt?: Maybe<Scalars['BigInt']>;
  earningsRaw_gte?: Maybe<Scalars['BigInt']>;
  earningsRaw_lte?: Maybe<Scalars['BigInt']>;
  earningsRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  earningsRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
};

export enum Harvest_OrderBy {
  Id = 'id',
  Vault = 'vault',
  Strategy = 'strategy',
  PricePerFullShareBefore = 'pricePerFullShareBefore',
  PricePerFullShareAfter = 'pricePerFullShareAfter',
  VaultBalanceBefore = 'vaultBalanceBefore',
  VaultBalanceAfter = 'vaultBalanceAfter',
  StrategyBalanceBefore = 'strategyBalanceBefore',
  StrategyBalanceAfter = 'strategyBalanceAfter',
  Earnings = 'earnings',
  PricePerFullShareBeforeRaw = 'pricePerFullShareBeforeRaw',
  PricePerFullShareAfterRaw = 'pricePerFullShareAfterRaw',
  VaultBalanceBeforeRaw = 'vaultBalanceBeforeRaw',
  VaultBalanceAfterRaw = 'vaultBalanceAfterRaw',
  StrategyBalanceBeforeRaw = 'strategyBalanceBeforeRaw',
  StrategyBalanceAfterRaw = 'strategyBalanceAfterRaw',
  EarningsRaw = 'earningsRaw',
  Transaction = 'transaction',
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type Query = {
  __typename?: 'Query';
  vault?: Maybe<Vault>;
  vaults: Array<Vault>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  accountVaultBalance?: Maybe<AccountVaultBalance>;
  accountVaultBalances: Array<AccountVaultBalance>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  transfer?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  withdrawal?: Maybe<Withdrawal>;
  withdrawals: Array<Withdrawal>;
  harvest?: Maybe<Harvest>;
  harvests: Array<Harvest>;
  strategy?: Maybe<Strategy>;
  strategies: Array<Strategy>;
  controller?: Maybe<Controller>;
  controllers: Array<Controller>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  geyser?: Maybe<Geyser>;
  geysers: Array<Geyser>;
  stakedEvent?: Maybe<StakedEvent>;
  stakedEvents: Array<StakedEvent>;
  unstakedEvent?: Maybe<UnstakedEvent>;
  unstakedEvents: Array<UnstakedEvent>;
  harvestEvent?: Maybe<HarvestEvent>;
  harvestEvents: Array<HarvestEvent>;
  harvestFarmEvent?: Maybe<HarvestFarmEvent>;
  harvestFarmEvents: Array<HarvestFarmEvent>;
  action?: Maybe<Action>;
  actions: Array<Action>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};

export type QueryVaultArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryVaultsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Vault_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Vault_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Account_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Account_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryAccountVaultBalanceArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryAccountVaultBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AccountVaultBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AccountVaultBalance_Filter>;
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

export type QueryTransferArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transfer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Transfer_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryDepositArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryDepositsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Deposit_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Deposit_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryWithdrawalArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryWithdrawalsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Withdrawal_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Withdrawal_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryHarvestArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryHarvestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Harvest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Harvest_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryStrategyArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryStrategiesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Strategy_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Strategy_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryControllerArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryControllersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Controller_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Controller_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Transaction_Filter>;
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

export type QueryStakedEventArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryStakedEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakedEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakedEvent_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryUnstakedEventArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryUnstakedEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UnstakedEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<UnstakedEvent_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryHarvestEventArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryHarvestEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<HarvestEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<HarvestEvent_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryHarvestFarmEventArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryHarvestFarmEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<HarvestFarmEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<HarvestFarmEvent_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryActionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryActionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Action_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Action_Filter>;
  block?: Maybe<Block_Height>;
};

export type Query_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type StakedEvent = {
  __typename?: 'StakedEvent';
  id: Scalars['ID'];
  geyser: Geyser;
  user: Scalars['Bytes'];
  amount: Scalars['BigInt'];
  total: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  data: Scalars['Bytes'];
};

export type StakedEvent_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  geyser?: Maybe<Scalars['String']>;
  geyser_not?: Maybe<Scalars['String']>;
  geyser_gt?: Maybe<Scalars['String']>;
  geyser_lt?: Maybe<Scalars['String']>;
  geyser_gte?: Maybe<Scalars['String']>;
  geyser_lte?: Maybe<Scalars['String']>;
  geyser_in?: Maybe<Array<Scalars['String']>>;
  geyser_not_in?: Maybe<Array<Scalars['String']>>;
  geyser_contains?: Maybe<Scalars['String']>;
  geyser_not_contains?: Maybe<Scalars['String']>;
  geyser_starts_with?: Maybe<Scalars['String']>;
  geyser_not_starts_with?: Maybe<Scalars['String']>;
  geyser_ends_with?: Maybe<Scalars['String']>;
  geyser_not_ends_with?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['Bytes']>;
  user_not?: Maybe<Scalars['Bytes']>;
  user_in?: Maybe<Array<Scalars['Bytes']>>;
  user_not_in?: Maybe<Array<Scalars['Bytes']>>;
  user_contains?: Maybe<Scalars['Bytes']>;
  user_not_contains?: Maybe<Scalars['Bytes']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  total?: Maybe<Scalars['BigInt']>;
  total_not?: Maybe<Scalars['BigInt']>;
  total_gt?: Maybe<Scalars['BigInt']>;
  total_lt?: Maybe<Scalars['BigInt']>;
  total_gte?: Maybe<Scalars['BigInt']>;
  total_lte?: Maybe<Scalars['BigInt']>;
  total_in?: Maybe<Array<Scalars['BigInt']>>;
  total_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  blockNumber_not?: Maybe<Scalars['BigInt']>;
  blockNumber_gt?: Maybe<Scalars['BigInt']>;
  blockNumber_lt?: Maybe<Scalars['BigInt']>;
  blockNumber_gte?: Maybe<Scalars['BigInt']>;
  blockNumber_lte?: Maybe<Scalars['BigInt']>;
  blockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
  data?: Maybe<Scalars['Bytes']>;
  data_not?: Maybe<Scalars['Bytes']>;
  data_in?: Maybe<Array<Scalars['Bytes']>>;
  data_not_in?: Maybe<Array<Scalars['Bytes']>>;
  data_contains?: Maybe<Scalars['Bytes']>;
  data_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum StakedEvent_OrderBy {
  Id = 'id',
  Geyser = 'geyser',
  User = 'user',
  Amount = 'amount',
  Total = 'total',
  Timestamp = 'timestamp',
  BlockNumber = 'blockNumber',
  Data = 'data',
}

export type Strategy = {
  __typename?: 'Strategy';
  /** Ethereum address */
  id: Scalars['ID'];
  vault: Vault;
  totalEarnings: Scalars['BigDecimal'];
  totalEarningsRaw: Scalars['BigInt'];
  harvests: Array<Harvest>;
  activeOnVaults?: Maybe<Array<Vault>>;
};

export type StrategyHarvestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Harvest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Harvest_Filter>;
};

export type StrategyActiveOnVaultsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Vault_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Vault_Filter>;
};

export type Strategy_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  vault?: Maybe<Scalars['String']>;
  vault_not?: Maybe<Scalars['String']>;
  vault_gt?: Maybe<Scalars['String']>;
  vault_lt?: Maybe<Scalars['String']>;
  vault_gte?: Maybe<Scalars['String']>;
  vault_lte?: Maybe<Scalars['String']>;
  vault_in?: Maybe<Array<Scalars['String']>>;
  vault_not_in?: Maybe<Array<Scalars['String']>>;
  vault_contains?: Maybe<Scalars['String']>;
  vault_not_contains?: Maybe<Scalars['String']>;
  vault_starts_with?: Maybe<Scalars['String']>;
  vault_not_starts_with?: Maybe<Scalars['String']>;
  vault_ends_with?: Maybe<Scalars['String']>;
  vault_not_ends_with?: Maybe<Scalars['String']>;
  totalEarnings?: Maybe<Scalars['BigDecimal']>;
  totalEarnings_not?: Maybe<Scalars['BigDecimal']>;
  totalEarnings_gt?: Maybe<Scalars['BigDecimal']>;
  totalEarnings_lt?: Maybe<Scalars['BigDecimal']>;
  totalEarnings_gte?: Maybe<Scalars['BigDecimal']>;
  totalEarnings_lte?: Maybe<Scalars['BigDecimal']>;
  totalEarnings_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalEarnings_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalEarningsRaw?: Maybe<Scalars['BigInt']>;
  totalEarningsRaw_not?: Maybe<Scalars['BigInt']>;
  totalEarningsRaw_gt?: Maybe<Scalars['BigInt']>;
  totalEarningsRaw_lt?: Maybe<Scalars['BigInt']>;
  totalEarningsRaw_gte?: Maybe<Scalars['BigInt']>;
  totalEarningsRaw_lte?: Maybe<Scalars['BigInt']>;
  totalEarningsRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  totalEarningsRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Strategy_OrderBy {
  Id = 'id',
  Vault = 'vault',
  TotalEarnings = 'totalEarnings',
  TotalEarningsRaw = 'totalEarningsRaw',
  Harvests = 'harvests',
  ActiveOnVaults = 'activeOnVaults',
}

export type Subscription = {
  __typename?: 'Subscription';
  vault?: Maybe<Vault>;
  vaults: Array<Vault>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  accountVaultBalance?: Maybe<AccountVaultBalance>;
  accountVaultBalances: Array<AccountVaultBalance>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  transfer?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  withdrawal?: Maybe<Withdrawal>;
  withdrawals: Array<Withdrawal>;
  harvest?: Maybe<Harvest>;
  harvests: Array<Harvest>;
  strategy?: Maybe<Strategy>;
  strategies: Array<Strategy>;
  controller?: Maybe<Controller>;
  controllers: Array<Controller>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  geyser?: Maybe<Geyser>;
  geysers: Array<Geyser>;
  stakedEvent?: Maybe<StakedEvent>;
  stakedEvents: Array<StakedEvent>;
  unstakedEvent?: Maybe<UnstakedEvent>;
  unstakedEvents: Array<UnstakedEvent>;
  harvestEvent?: Maybe<HarvestEvent>;
  harvestEvents: Array<HarvestEvent>;
  harvestFarmEvent?: Maybe<HarvestFarmEvent>;
  harvestFarmEvents: Array<HarvestFarmEvent>;
  action?: Maybe<Action>;
  actions: Array<Action>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};

export type SubscriptionVaultArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionVaultsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Vault_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Vault_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Account_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Account_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionAccountVaultBalanceArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionAccountVaultBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AccountVaultBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AccountVaultBalance_Filter>;
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

export type SubscriptionTransferArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transfer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Transfer_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionDepositArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionDepositsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Deposit_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Deposit_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionWithdrawalArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionWithdrawalsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Withdrawal_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Withdrawal_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionHarvestArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionHarvestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Harvest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Harvest_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionStrategyArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionStrategiesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Strategy_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Strategy_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionControllerArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionControllersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Controller_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Controller_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Transaction_Filter>;
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

export type SubscriptionStakedEventArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionStakedEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakedEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakedEvent_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionUnstakedEventArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionUnstakedEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UnstakedEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<UnstakedEvent_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionHarvestEventArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionHarvestEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<HarvestEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<HarvestEvent_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionHarvestFarmEventArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionHarvestFarmEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<HarvestFarmEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<HarvestFarmEvent_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionActionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionActionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Action_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Action_Filter>;
  block?: Maybe<Block_Height>;
};

export type Subscription_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type Token = {
  __typename?: 'Token';
  id: Scalars['ID'];
  address: Scalars['Bytes'];
  decimals: Scalars['Int'];
  name: Scalars['String'];
  symbol: Scalars['String'];
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
  address?: Maybe<Scalars['Bytes']>;
  address_not?: Maybe<Scalars['Bytes']>;
  address_in?: Maybe<Array<Scalars['Bytes']>>;
  address_not_in?: Maybe<Array<Scalars['Bytes']>>;
  address_contains?: Maybe<Scalars['Bytes']>;
  address_not_contains?: Maybe<Scalars['Bytes']>;
  decimals?: Maybe<Scalars['Int']>;
  decimals_not?: Maybe<Scalars['Int']>;
  decimals_gt?: Maybe<Scalars['Int']>;
  decimals_lt?: Maybe<Scalars['Int']>;
  decimals_gte?: Maybe<Scalars['Int']>;
  decimals_lte?: Maybe<Scalars['Int']>;
  decimals_in?: Maybe<Array<Scalars['Int']>>;
  decimals_not_in?: Maybe<Array<Scalars['Int']>>;
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
};

export enum Token_OrderBy {
  Id = 'id',
  Address = 'address',
  Decimals = 'decimals',
  Name = 'name',
  Symbol = 'symbol',
}

export type Transaction = {
  __typename?: 'Transaction';
  /** ID = Transaction Hash */
  id: Scalars['ID'];
  timestamp: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
  deposits: Array<Deposit>;
  withdrawals: Array<Withdrawal>;
  transfers: Array<Transfer>;
  harvests: Array<Harvest>;
  /** List of Vaults that last updated on this transaction */
  vaultsUpdated: Array<Vault>;
};

export type TransactionDepositsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Deposit_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Deposit_Filter>;
};

export type TransactionWithdrawalsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Withdrawal_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Withdrawal_Filter>;
};

export type TransactionTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transfer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Transfer_Filter>;
};

export type TransactionHarvestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Harvest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Harvest_Filter>;
};

export type TransactionVaultsUpdatedArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Vault_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Vault_Filter>;
};

export type Transaction_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  blockNumber_not?: Maybe<Scalars['BigInt']>;
  blockNumber_gt?: Maybe<Scalars['BigInt']>;
  blockNumber_lt?: Maybe<Scalars['BigInt']>;
  blockNumber_gte?: Maybe<Scalars['BigInt']>;
  blockNumber_lte?: Maybe<Scalars['BigInt']>;
  blockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transactionHash?: Maybe<Scalars['Bytes']>;
  transactionHash_not?: Maybe<Scalars['Bytes']>;
  transactionHash_in?: Maybe<Array<Scalars['Bytes']>>;
  transactionHash_not_in?: Maybe<Array<Scalars['Bytes']>>;
  transactionHash_contains?: Maybe<Scalars['Bytes']>;
  transactionHash_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum Transaction_OrderBy {
  Id = 'id',
  Timestamp = 'timestamp',
  BlockNumber = 'blockNumber',
  TransactionHash = 'transactionHash',
  Deposits = 'deposits',
  Withdrawals = 'withdrawals',
  Transfers = 'transfers',
  Harvests = 'harvests',
  VaultsUpdated = 'vaultsUpdated',
}

export type Transfer = {
  __typename?: 'Transfer';
  id: Scalars['ID'];
  from: Account;
  to: Account;
  value: Scalars['BigInt'];
  amount: Scalars['BigInt'];
  vault: Vault;
  pricePerFullShare: Scalars['BigInt'];
  vaultBalance: Scalars['BigInt'];
  totalSupply: Scalars['BigInt'];
  available: Scalars['BigInt'];
  transaction: Transaction;
};

export type Transfer_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  from?: Maybe<Scalars['String']>;
  from_not?: Maybe<Scalars['String']>;
  from_gt?: Maybe<Scalars['String']>;
  from_lt?: Maybe<Scalars['String']>;
  from_gte?: Maybe<Scalars['String']>;
  from_lte?: Maybe<Scalars['String']>;
  from_in?: Maybe<Array<Scalars['String']>>;
  from_not_in?: Maybe<Array<Scalars['String']>>;
  from_contains?: Maybe<Scalars['String']>;
  from_not_contains?: Maybe<Scalars['String']>;
  from_starts_with?: Maybe<Scalars['String']>;
  from_not_starts_with?: Maybe<Scalars['String']>;
  from_ends_with?: Maybe<Scalars['String']>;
  from_not_ends_with?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  to_not?: Maybe<Scalars['String']>;
  to_gt?: Maybe<Scalars['String']>;
  to_lt?: Maybe<Scalars['String']>;
  to_gte?: Maybe<Scalars['String']>;
  to_lte?: Maybe<Scalars['String']>;
  to_in?: Maybe<Array<Scalars['String']>>;
  to_not_in?: Maybe<Array<Scalars['String']>>;
  to_contains?: Maybe<Scalars['String']>;
  to_not_contains?: Maybe<Scalars['String']>;
  to_starts_with?: Maybe<Scalars['String']>;
  to_not_starts_with?: Maybe<Scalars['String']>;
  to_ends_with?: Maybe<Scalars['String']>;
  to_not_ends_with?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['BigInt']>;
  value_not?: Maybe<Scalars['BigInt']>;
  value_gt?: Maybe<Scalars['BigInt']>;
  value_lt?: Maybe<Scalars['BigInt']>;
  value_gte?: Maybe<Scalars['BigInt']>;
  value_lte?: Maybe<Scalars['BigInt']>;
  value_in?: Maybe<Array<Scalars['BigInt']>>;
  value_not_in?: Maybe<Array<Scalars['BigInt']>>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  vault?: Maybe<Scalars['String']>;
  vault_not?: Maybe<Scalars['String']>;
  vault_gt?: Maybe<Scalars['String']>;
  vault_lt?: Maybe<Scalars['String']>;
  vault_gte?: Maybe<Scalars['String']>;
  vault_lte?: Maybe<Scalars['String']>;
  vault_in?: Maybe<Array<Scalars['String']>>;
  vault_not_in?: Maybe<Array<Scalars['String']>>;
  vault_contains?: Maybe<Scalars['String']>;
  vault_not_contains?: Maybe<Scalars['String']>;
  vault_starts_with?: Maybe<Scalars['String']>;
  vault_not_starts_with?: Maybe<Scalars['String']>;
  vault_ends_with?: Maybe<Scalars['String']>;
  vault_not_ends_with?: Maybe<Scalars['String']>;
  pricePerFullShare?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_not?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_gt?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_lt?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_gte?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_lte?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_in?: Maybe<Array<Scalars['BigInt']>>;
  pricePerFullShare_not_in?: Maybe<Array<Scalars['BigInt']>>;
  vaultBalance?: Maybe<Scalars['BigInt']>;
  vaultBalance_not?: Maybe<Scalars['BigInt']>;
  vaultBalance_gt?: Maybe<Scalars['BigInt']>;
  vaultBalance_lt?: Maybe<Scalars['BigInt']>;
  vaultBalance_gte?: Maybe<Scalars['BigInt']>;
  vaultBalance_lte?: Maybe<Scalars['BigInt']>;
  vaultBalance_in?: Maybe<Array<Scalars['BigInt']>>;
  vaultBalance_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSupply?: Maybe<Scalars['BigInt']>;
  totalSupply_not?: Maybe<Scalars['BigInt']>;
  totalSupply_gt?: Maybe<Scalars['BigInt']>;
  totalSupply_lt?: Maybe<Scalars['BigInt']>;
  totalSupply_gte?: Maybe<Scalars['BigInt']>;
  totalSupply_lte?: Maybe<Scalars['BigInt']>;
  totalSupply_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSupply_not_in?: Maybe<Array<Scalars['BigInt']>>;
  available?: Maybe<Scalars['BigInt']>;
  available_not?: Maybe<Scalars['BigInt']>;
  available_gt?: Maybe<Scalars['BigInt']>;
  available_lt?: Maybe<Scalars['BigInt']>;
  available_gte?: Maybe<Scalars['BigInt']>;
  available_lte?: Maybe<Scalars['BigInt']>;
  available_in?: Maybe<Array<Scalars['BigInt']>>;
  available_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
};

export enum Transfer_OrderBy {
  Id = 'id',
  From = 'from',
  To = 'to',
  Value = 'value',
  Amount = 'amount',
  Vault = 'vault',
  PricePerFullShare = 'pricePerFullShare',
  VaultBalance = 'vaultBalance',
  TotalSupply = 'totalSupply',
  Available = 'available',
  Transaction = 'transaction',
}

export type UnstakedEvent = {
  __typename?: 'UnstakedEvent';
  id: Scalars['ID'];
  geyser: Geyser;
  user: Scalars['Bytes'];
  amount: Scalars['BigInt'];
  total: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  data: Scalars['Bytes'];
};

export type UnstakedEvent_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  geyser?: Maybe<Scalars['String']>;
  geyser_not?: Maybe<Scalars['String']>;
  geyser_gt?: Maybe<Scalars['String']>;
  geyser_lt?: Maybe<Scalars['String']>;
  geyser_gte?: Maybe<Scalars['String']>;
  geyser_lte?: Maybe<Scalars['String']>;
  geyser_in?: Maybe<Array<Scalars['String']>>;
  geyser_not_in?: Maybe<Array<Scalars['String']>>;
  geyser_contains?: Maybe<Scalars['String']>;
  geyser_not_contains?: Maybe<Scalars['String']>;
  geyser_starts_with?: Maybe<Scalars['String']>;
  geyser_not_starts_with?: Maybe<Scalars['String']>;
  geyser_ends_with?: Maybe<Scalars['String']>;
  geyser_not_ends_with?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['Bytes']>;
  user_not?: Maybe<Scalars['Bytes']>;
  user_in?: Maybe<Array<Scalars['Bytes']>>;
  user_not_in?: Maybe<Array<Scalars['Bytes']>>;
  user_contains?: Maybe<Scalars['Bytes']>;
  user_not_contains?: Maybe<Scalars['Bytes']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  total?: Maybe<Scalars['BigInt']>;
  total_not?: Maybe<Scalars['BigInt']>;
  total_gt?: Maybe<Scalars['BigInt']>;
  total_lt?: Maybe<Scalars['BigInt']>;
  total_gte?: Maybe<Scalars['BigInt']>;
  total_lte?: Maybe<Scalars['BigInt']>;
  total_in?: Maybe<Array<Scalars['BigInt']>>;
  total_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  blockNumber_not?: Maybe<Scalars['BigInt']>;
  blockNumber_gt?: Maybe<Scalars['BigInt']>;
  blockNumber_lt?: Maybe<Scalars['BigInt']>;
  blockNumber_gte?: Maybe<Scalars['BigInt']>;
  blockNumber_lte?: Maybe<Scalars['BigInt']>;
  blockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
  data?: Maybe<Scalars['Bytes']>;
  data_not?: Maybe<Scalars['Bytes']>;
  data_in?: Maybe<Array<Scalars['Bytes']>>;
  data_not_in?: Maybe<Array<Scalars['Bytes']>>;
  data_contains?: Maybe<Scalars['Bytes']>;
  data_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum UnstakedEvent_OrderBy {
  Id = 'id',
  Geyser = 'geyser',
  User = 'user',
  Amount = 'amount',
  Total = 'total',
  Timestamp = 'timestamp',
  BlockNumber = 'blockNumber',
  Data = 'data',
}

export type Vault = {
  __typename?: 'Vault';
  id: Scalars['ID'];
  /** Amount of underlying token per 1 share */
  pricePerFullShare: Scalars['BigDecimal'];
  /** Total shares supply */
  totalSupply: Scalars['BigDecimal'];
  /** Full vault underlying token balance (vault + strategy) */
  vaultBalance: Scalars['BigDecimal'];
  /** Strategy underlying token balance */
  strategyBalance: Scalars['BigDecimal'];
  /** How much the vault allows to be borrowed */
  available: Scalars['BigDecimal'];
  /** Deposit token */
  underlyingToken: Token;
  shareToken: Token;
  currentController: Controller;
  currentStrategy: Strategy;
  /** Transaction metadata for the last update */
  transaction: Transaction;
  /** balance: totalDeposited - totalWithdrawn: all deposits of underlying made by external accounts */
  netDeposits: Scalars['BigDecimal'];
  totalDeposited: Scalars['BigDecimal'];
  totalWithdrawn: Scalars['BigDecimal'];
  /** totalActiveShares: totalSharesMinted - totalSharesBurned */
  totalActiveShares: Scalars['BigDecimal'];
  totalSharesMinted: Scalars['BigDecimal'];
  totalSharesBurned: Scalars['BigDecimal'];
  totalEarnings: Scalars['BigDecimal'];
  pricePerFullShareRaw: Scalars['BigInt'];
  totalSupplyRaw: Scalars['BigInt'];
  /** Balance of the Vault contract of underlying Token + balance of the Strategy contract of underlying Token */
  vaultBalanceRaw: Scalars['BigInt'];
  /** Balance of underlying Token specifically held in the strategy */
  strategyBalanceRaw: Scalars['BigInt'];
  /** How much the vault allows to be borrowed */
  availableRaw: Scalars['BigInt'];
  netDepositsRaw: Scalars['BigInt'];
  totalDepositedRaw: Scalars['BigInt'];
  totalWithdrawnRaw: Scalars['BigInt'];
  totalActiveSharesRaw: Scalars['BigInt'];
  totalSharesMintedRaw: Scalars['BigInt'];
  totalSharesBurnedRaw: Scalars['BigInt'];
  totalEarningsRaw: Scalars['BigInt'];
  totalHarvestCalls: Scalars['BigInt'];
  transfers: Array<Transfer>;
  deposits: Array<Deposit>;
  withdrawals: Array<Withdrawal>;
  harvests: Array<Harvest>;
  balances: Array<AccountVaultBalance>;
  strategies: Array<Strategy>;
  controllers: Array<Controller>;
};

export type VaultTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transfer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Transfer_Filter>;
};

export type VaultDepositsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Deposit_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Deposit_Filter>;
};

export type VaultWithdrawalsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Withdrawal_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Withdrawal_Filter>;
};

export type VaultHarvestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Harvest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Harvest_Filter>;
};

export type VaultBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AccountVaultBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AccountVaultBalance_Filter>;
};

export type VaultStrategiesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Strategy_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Strategy_Filter>;
};

export type VaultControllersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Controller_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Controller_Filter>;
};

export type Vault_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  pricePerFullShare?: Maybe<Scalars['BigDecimal']>;
  pricePerFullShare_not?: Maybe<Scalars['BigDecimal']>;
  pricePerFullShare_gt?: Maybe<Scalars['BigDecimal']>;
  pricePerFullShare_lt?: Maybe<Scalars['BigDecimal']>;
  pricePerFullShare_gte?: Maybe<Scalars['BigDecimal']>;
  pricePerFullShare_lte?: Maybe<Scalars['BigDecimal']>;
  pricePerFullShare_in?: Maybe<Array<Scalars['BigDecimal']>>;
  pricePerFullShare_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSupply?: Maybe<Scalars['BigDecimal']>;
  totalSupply_not?: Maybe<Scalars['BigDecimal']>;
  totalSupply_gt?: Maybe<Scalars['BigDecimal']>;
  totalSupply_lt?: Maybe<Scalars['BigDecimal']>;
  totalSupply_gte?: Maybe<Scalars['BigDecimal']>;
  totalSupply_lte?: Maybe<Scalars['BigDecimal']>;
  totalSupply_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSupply_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  vaultBalance?: Maybe<Scalars['BigDecimal']>;
  vaultBalance_not?: Maybe<Scalars['BigDecimal']>;
  vaultBalance_gt?: Maybe<Scalars['BigDecimal']>;
  vaultBalance_lt?: Maybe<Scalars['BigDecimal']>;
  vaultBalance_gte?: Maybe<Scalars['BigDecimal']>;
  vaultBalance_lte?: Maybe<Scalars['BigDecimal']>;
  vaultBalance_in?: Maybe<Array<Scalars['BigDecimal']>>;
  vaultBalance_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  strategyBalance?: Maybe<Scalars['BigDecimal']>;
  strategyBalance_not?: Maybe<Scalars['BigDecimal']>;
  strategyBalance_gt?: Maybe<Scalars['BigDecimal']>;
  strategyBalance_lt?: Maybe<Scalars['BigDecimal']>;
  strategyBalance_gte?: Maybe<Scalars['BigDecimal']>;
  strategyBalance_lte?: Maybe<Scalars['BigDecimal']>;
  strategyBalance_in?: Maybe<Array<Scalars['BigDecimal']>>;
  strategyBalance_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  available?: Maybe<Scalars['BigDecimal']>;
  available_not?: Maybe<Scalars['BigDecimal']>;
  available_gt?: Maybe<Scalars['BigDecimal']>;
  available_lt?: Maybe<Scalars['BigDecimal']>;
  available_gte?: Maybe<Scalars['BigDecimal']>;
  available_lte?: Maybe<Scalars['BigDecimal']>;
  available_in?: Maybe<Array<Scalars['BigDecimal']>>;
  available_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  underlyingToken?: Maybe<Scalars['String']>;
  underlyingToken_not?: Maybe<Scalars['String']>;
  underlyingToken_gt?: Maybe<Scalars['String']>;
  underlyingToken_lt?: Maybe<Scalars['String']>;
  underlyingToken_gte?: Maybe<Scalars['String']>;
  underlyingToken_lte?: Maybe<Scalars['String']>;
  underlyingToken_in?: Maybe<Array<Scalars['String']>>;
  underlyingToken_not_in?: Maybe<Array<Scalars['String']>>;
  underlyingToken_contains?: Maybe<Scalars['String']>;
  underlyingToken_not_contains?: Maybe<Scalars['String']>;
  underlyingToken_starts_with?: Maybe<Scalars['String']>;
  underlyingToken_not_starts_with?: Maybe<Scalars['String']>;
  underlyingToken_ends_with?: Maybe<Scalars['String']>;
  underlyingToken_not_ends_with?: Maybe<Scalars['String']>;
  shareToken?: Maybe<Scalars['String']>;
  shareToken_not?: Maybe<Scalars['String']>;
  shareToken_gt?: Maybe<Scalars['String']>;
  shareToken_lt?: Maybe<Scalars['String']>;
  shareToken_gte?: Maybe<Scalars['String']>;
  shareToken_lte?: Maybe<Scalars['String']>;
  shareToken_in?: Maybe<Array<Scalars['String']>>;
  shareToken_not_in?: Maybe<Array<Scalars['String']>>;
  shareToken_contains?: Maybe<Scalars['String']>;
  shareToken_not_contains?: Maybe<Scalars['String']>;
  shareToken_starts_with?: Maybe<Scalars['String']>;
  shareToken_not_starts_with?: Maybe<Scalars['String']>;
  shareToken_ends_with?: Maybe<Scalars['String']>;
  shareToken_not_ends_with?: Maybe<Scalars['String']>;
  currentController?: Maybe<Scalars['String']>;
  currentController_not?: Maybe<Scalars['String']>;
  currentController_gt?: Maybe<Scalars['String']>;
  currentController_lt?: Maybe<Scalars['String']>;
  currentController_gte?: Maybe<Scalars['String']>;
  currentController_lte?: Maybe<Scalars['String']>;
  currentController_in?: Maybe<Array<Scalars['String']>>;
  currentController_not_in?: Maybe<Array<Scalars['String']>>;
  currentController_contains?: Maybe<Scalars['String']>;
  currentController_not_contains?: Maybe<Scalars['String']>;
  currentController_starts_with?: Maybe<Scalars['String']>;
  currentController_not_starts_with?: Maybe<Scalars['String']>;
  currentController_ends_with?: Maybe<Scalars['String']>;
  currentController_not_ends_with?: Maybe<Scalars['String']>;
  currentStrategy?: Maybe<Scalars['String']>;
  currentStrategy_not?: Maybe<Scalars['String']>;
  currentStrategy_gt?: Maybe<Scalars['String']>;
  currentStrategy_lt?: Maybe<Scalars['String']>;
  currentStrategy_gte?: Maybe<Scalars['String']>;
  currentStrategy_lte?: Maybe<Scalars['String']>;
  currentStrategy_in?: Maybe<Array<Scalars['String']>>;
  currentStrategy_not_in?: Maybe<Array<Scalars['String']>>;
  currentStrategy_contains?: Maybe<Scalars['String']>;
  currentStrategy_not_contains?: Maybe<Scalars['String']>;
  currentStrategy_starts_with?: Maybe<Scalars['String']>;
  currentStrategy_not_starts_with?: Maybe<Scalars['String']>;
  currentStrategy_ends_with?: Maybe<Scalars['String']>;
  currentStrategy_not_ends_with?: Maybe<Scalars['String']>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  netDeposits?: Maybe<Scalars['BigDecimal']>;
  netDeposits_not?: Maybe<Scalars['BigDecimal']>;
  netDeposits_gt?: Maybe<Scalars['BigDecimal']>;
  netDeposits_lt?: Maybe<Scalars['BigDecimal']>;
  netDeposits_gte?: Maybe<Scalars['BigDecimal']>;
  netDeposits_lte?: Maybe<Scalars['BigDecimal']>;
  netDeposits_in?: Maybe<Array<Scalars['BigDecimal']>>;
  netDeposits_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalDeposited?: Maybe<Scalars['BigDecimal']>;
  totalDeposited_not?: Maybe<Scalars['BigDecimal']>;
  totalDeposited_gt?: Maybe<Scalars['BigDecimal']>;
  totalDeposited_lt?: Maybe<Scalars['BigDecimal']>;
  totalDeposited_gte?: Maybe<Scalars['BigDecimal']>;
  totalDeposited_lte?: Maybe<Scalars['BigDecimal']>;
  totalDeposited_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalDeposited_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalWithdrawn?: Maybe<Scalars['BigDecimal']>;
  totalWithdrawn_not?: Maybe<Scalars['BigDecimal']>;
  totalWithdrawn_gt?: Maybe<Scalars['BigDecimal']>;
  totalWithdrawn_lt?: Maybe<Scalars['BigDecimal']>;
  totalWithdrawn_gte?: Maybe<Scalars['BigDecimal']>;
  totalWithdrawn_lte?: Maybe<Scalars['BigDecimal']>;
  totalWithdrawn_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalWithdrawn_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalActiveShares?: Maybe<Scalars['BigDecimal']>;
  totalActiveShares_not?: Maybe<Scalars['BigDecimal']>;
  totalActiveShares_gt?: Maybe<Scalars['BigDecimal']>;
  totalActiveShares_lt?: Maybe<Scalars['BigDecimal']>;
  totalActiveShares_gte?: Maybe<Scalars['BigDecimal']>;
  totalActiveShares_lte?: Maybe<Scalars['BigDecimal']>;
  totalActiveShares_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalActiveShares_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSharesMinted?: Maybe<Scalars['BigDecimal']>;
  totalSharesMinted_not?: Maybe<Scalars['BigDecimal']>;
  totalSharesMinted_gt?: Maybe<Scalars['BigDecimal']>;
  totalSharesMinted_lt?: Maybe<Scalars['BigDecimal']>;
  totalSharesMinted_gte?: Maybe<Scalars['BigDecimal']>;
  totalSharesMinted_lte?: Maybe<Scalars['BigDecimal']>;
  totalSharesMinted_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSharesMinted_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSharesBurned?: Maybe<Scalars['BigDecimal']>;
  totalSharesBurned_not?: Maybe<Scalars['BigDecimal']>;
  totalSharesBurned_gt?: Maybe<Scalars['BigDecimal']>;
  totalSharesBurned_lt?: Maybe<Scalars['BigDecimal']>;
  totalSharesBurned_gte?: Maybe<Scalars['BigDecimal']>;
  totalSharesBurned_lte?: Maybe<Scalars['BigDecimal']>;
  totalSharesBurned_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSharesBurned_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalEarnings?: Maybe<Scalars['BigDecimal']>;
  totalEarnings_not?: Maybe<Scalars['BigDecimal']>;
  totalEarnings_gt?: Maybe<Scalars['BigDecimal']>;
  totalEarnings_lt?: Maybe<Scalars['BigDecimal']>;
  totalEarnings_gte?: Maybe<Scalars['BigDecimal']>;
  totalEarnings_lte?: Maybe<Scalars['BigDecimal']>;
  totalEarnings_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalEarnings_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  pricePerFullShareRaw?: Maybe<Scalars['BigInt']>;
  pricePerFullShareRaw_not?: Maybe<Scalars['BigInt']>;
  pricePerFullShareRaw_gt?: Maybe<Scalars['BigInt']>;
  pricePerFullShareRaw_lt?: Maybe<Scalars['BigInt']>;
  pricePerFullShareRaw_gte?: Maybe<Scalars['BigInt']>;
  pricePerFullShareRaw_lte?: Maybe<Scalars['BigInt']>;
  pricePerFullShareRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  pricePerFullShareRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSupplyRaw?: Maybe<Scalars['BigInt']>;
  totalSupplyRaw_not?: Maybe<Scalars['BigInt']>;
  totalSupplyRaw_gt?: Maybe<Scalars['BigInt']>;
  totalSupplyRaw_lt?: Maybe<Scalars['BigInt']>;
  totalSupplyRaw_gte?: Maybe<Scalars['BigInt']>;
  totalSupplyRaw_lte?: Maybe<Scalars['BigInt']>;
  totalSupplyRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSupplyRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  vaultBalanceRaw?: Maybe<Scalars['BigInt']>;
  vaultBalanceRaw_not?: Maybe<Scalars['BigInt']>;
  vaultBalanceRaw_gt?: Maybe<Scalars['BigInt']>;
  vaultBalanceRaw_lt?: Maybe<Scalars['BigInt']>;
  vaultBalanceRaw_gte?: Maybe<Scalars['BigInt']>;
  vaultBalanceRaw_lte?: Maybe<Scalars['BigInt']>;
  vaultBalanceRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  vaultBalanceRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  strategyBalanceRaw?: Maybe<Scalars['BigInt']>;
  strategyBalanceRaw_not?: Maybe<Scalars['BigInt']>;
  strategyBalanceRaw_gt?: Maybe<Scalars['BigInt']>;
  strategyBalanceRaw_lt?: Maybe<Scalars['BigInt']>;
  strategyBalanceRaw_gte?: Maybe<Scalars['BigInt']>;
  strategyBalanceRaw_lte?: Maybe<Scalars['BigInt']>;
  strategyBalanceRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  strategyBalanceRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  availableRaw?: Maybe<Scalars['BigInt']>;
  availableRaw_not?: Maybe<Scalars['BigInt']>;
  availableRaw_gt?: Maybe<Scalars['BigInt']>;
  availableRaw_lt?: Maybe<Scalars['BigInt']>;
  availableRaw_gte?: Maybe<Scalars['BigInt']>;
  availableRaw_lte?: Maybe<Scalars['BigInt']>;
  availableRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  availableRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  netDepositsRaw?: Maybe<Scalars['BigInt']>;
  netDepositsRaw_not?: Maybe<Scalars['BigInt']>;
  netDepositsRaw_gt?: Maybe<Scalars['BigInt']>;
  netDepositsRaw_lt?: Maybe<Scalars['BigInt']>;
  netDepositsRaw_gte?: Maybe<Scalars['BigInt']>;
  netDepositsRaw_lte?: Maybe<Scalars['BigInt']>;
  netDepositsRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  netDepositsRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalDepositedRaw?: Maybe<Scalars['BigInt']>;
  totalDepositedRaw_not?: Maybe<Scalars['BigInt']>;
  totalDepositedRaw_gt?: Maybe<Scalars['BigInt']>;
  totalDepositedRaw_lt?: Maybe<Scalars['BigInt']>;
  totalDepositedRaw_gte?: Maybe<Scalars['BigInt']>;
  totalDepositedRaw_lte?: Maybe<Scalars['BigInt']>;
  totalDepositedRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  totalDepositedRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalWithdrawnRaw?: Maybe<Scalars['BigInt']>;
  totalWithdrawnRaw_not?: Maybe<Scalars['BigInt']>;
  totalWithdrawnRaw_gt?: Maybe<Scalars['BigInt']>;
  totalWithdrawnRaw_lt?: Maybe<Scalars['BigInt']>;
  totalWithdrawnRaw_gte?: Maybe<Scalars['BigInt']>;
  totalWithdrawnRaw_lte?: Maybe<Scalars['BigInt']>;
  totalWithdrawnRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  totalWithdrawnRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalActiveSharesRaw?: Maybe<Scalars['BigInt']>;
  totalActiveSharesRaw_not?: Maybe<Scalars['BigInt']>;
  totalActiveSharesRaw_gt?: Maybe<Scalars['BigInt']>;
  totalActiveSharesRaw_lt?: Maybe<Scalars['BigInt']>;
  totalActiveSharesRaw_gte?: Maybe<Scalars['BigInt']>;
  totalActiveSharesRaw_lte?: Maybe<Scalars['BigInt']>;
  totalActiveSharesRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  totalActiveSharesRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSharesMintedRaw?: Maybe<Scalars['BigInt']>;
  totalSharesMintedRaw_not?: Maybe<Scalars['BigInt']>;
  totalSharesMintedRaw_gt?: Maybe<Scalars['BigInt']>;
  totalSharesMintedRaw_lt?: Maybe<Scalars['BigInt']>;
  totalSharesMintedRaw_gte?: Maybe<Scalars['BigInt']>;
  totalSharesMintedRaw_lte?: Maybe<Scalars['BigInt']>;
  totalSharesMintedRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSharesMintedRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSharesBurnedRaw?: Maybe<Scalars['BigInt']>;
  totalSharesBurnedRaw_not?: Maybe<Scalars['BigInt']>;
  totalSharesBurnedRaw_gt?: Maybe<Scalars['BigInt']>;
  totalSharesBurnedRaw_lt?: Maybe<Scalars['BigInt']>;
  totalSharesBurnedRaw_gte?: Maybe<Scalars['BigInt']>;
  totalSharesBurnedRaw_lte?: Maybe<Scalars['BigInt']>;
  totalSharesBurnedRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSharesBurnedRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalEarningsRaw?: Maybe<Scalars['BigInt']>;
  totalEarningsRaw_not?: Maybe<Scalars['BigInt']>;
  totalEarningsRaw_gt?: Maybe<Scalars['BigInt']>;
  totalEarningsRaw_lt?: Maybe<Scalars['BigInt']>;
  totalEarningsRaw_gte?: Maybe<Scalars['BigInt']>;
  totalEarningsRaw_lte?: Maybe<Scalars['BigInt']>;
  totalEarningsRaw_in?: Maybe<Array<Scalars['BigInt']>>;
  totalEarningsRaw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalHarvestCalls?: Maybe<Scalars['BigInt']>;
  totalHarvestCalls_not?: Maybe<Scalars['BigInt']>;
  totalHarvestCalls_gt?: Maybe<Scalars['BigInt']>;
  totalHarvestCalls_lt?: Maybe<Scalars['BigInt']>;
  totalHarvestCalls_gte?: Maybe<Scalars['BigInt']>;
  totalHarvestCalls_lte?: Maybe<Scalars['BigInt']>;
  totalHarvestCalls_in?: Maybe<Array<Scalars['BigInt']>>;
  totalHarvestCalls_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Vault_OrderBy {
  Id = 'id',
  PricePerFullShare = 'pricePerFullShare',
  TotalSupply = 'totalSupply',
  VaultBalance = 'vaultBalance',
  StrategyBalance = 'strategyBalance',
  Available = 'available',
  UnderlyingToken = 'underlyingToken',
  ShareToken = 'shareToken',
  CurrentController = 'currentController',
  CurrentStrategy = 'currentStrategy',
  Transaction = 'transaction',
  NetDeposits = 'netDeposits',
  TotalDeposited = 'totalDeposited',
  TotalWithdrawn = 'totalWithdrawn',
  TotalActiveShares = 'totalActiveShares',
  TotalSharesMinted = 'totalSharesMinted',
  TotalSharesBurned = 'totalSharesBurned',
  TotalEarnings = 'totalEarnings',
  PricePerFullShareRaw = 'pricePerFullShareRaw',
  TotalSupplyRaw = 'totalSupplyRaw',
  VaultBalanceRaw = 'vaultBalanceRaw',
  StrategyBalanceRaw = 'strategyBalanceRaw',
  AvailableRaw = 'availableRaw',
  NetDepositsRaw = 'netDepositsRaw',
  TotalDepositedRaw = 'totalDepositedRaw',
  TotalWithdrawnRaw = 'totalWithdrawnRaw',
  TotalActiveSharesRaw = 'totalActiveSharesRaw',
  TotalSharesMintedRaw = 'totalSharesMintedRaw',
  TotalSharesBurnedRaw = 'totalSharesBurnedRaw',
  TotalEarningsRaw = 'totalEarningsRaw',
  TotalHarvestCalls = 'totalHarvestCalls',
  Transfers = 'transfers',
  Deposits = 'deposits',
  Withdrawals = 'withdrawals',
  Harvests = 'harvests',
  Balances = 'balances',
  Strategies = 'strategies',
  Controllers = 'controllers',
}

export type Withdrawal = Action & {
  __typename?: 'Withdrawal';
  id: Scalars['ID'];
  vault: Vault;
  account: Account;
  amount: Scalars['BigInt'];
  shares: Scalars['BigInt'];
  pricePerFullShare: Scalars['BigInt'];
  vaultBalance: Scalars['BigInt'];
  totalSupply: Scalars['BigInt'];
  available: Scalars['BigInt'];
  transaction: Transaction;
};

export type Withdrawal_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  vault?: Maybe<Scalars['String']>;
  vault_not?: Maybe<Scalars['String']>;
  vault_gt?: Maybe<Scalars['String']>;
  vault_lt?: Maybe<Scalars['String']>;
  vault_gte?: Maybe<Scalars['String']>;
  vault_lte?: Maybe<Scalars['String']>;
  vault_in?: Maybe<Array<Scalars['String']>>;
  vault_not_in?: Maybe<Array<Scalars['String']>>;
  vault_contains?: Maybe<Scalars['String']>;
  vault_not_contains?: Maybe<Scalars['String']>;
  vault_starts_with?: Maybe<Scalars['String']>;
  vault_not_starts_with?: Maybe<Scalars['String']>;
  vault_ends_with?: Maybe<Scalars['String']>;
  vault_not_ends_with?: Maybe<Scalars['String']>;
  account?: Maybe<Scalars['String']>;
  account_not?: Maybe<Scalars['String']>;
  account_gt?: Maybe<Scalars['String']>;
  account_lt?: Maybe<Scalars['String']>;
  account_gte?: Maybe<Scalars['String']>;
  account_lte?: Maybe<Scalars['String']>;
  account_in?: Maybe<Array<Scalars['String']>>;
  account_not_in?: Maybe<Array<Scalars['String']>>;
  account_contains?: Maybe<Scalars['String']>;
  account_not_contains?: Maybe<Scalars['String']>;
  account_starts_with?: Maybe<Scalars['String']>;
  account_not_starts_with?: Maybe<Scalars['String']>;
  account_ends_with?: Maybe<Scalars['String']>;
  account_not_ends_with?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  shares?: Maybe<Scalars['BigInt']>;
  shares_not?: Maybe<Scalars['BigInt']>;
  shares_gt?: Maybe<Scalars['BigInt']>;
  shares_lt?: Maybe<Scalars['BigInt']>;
  shares_gte?: Maybe<Scalars['BigInt']>;
  shares_lte?: Maybe<Scalars['BigInt']>;
  shares_in?: Maybe<Array<Scalars['BigInt']>>;
  shares_not_in?: Maybe<Array<Scalars['BigInt']>>;
  pricePerFullShare?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_not?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_gt?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_lt?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_gte?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_lte?: Maybe<Scalars['BigInt']>;
  pricePerFullShare_in?: Maybe<Array<Scalars['BigInt']>>;
  pricePerFullShare_not_in?: Maybe<Array<Scalars['BigInt']>>;
  vaultBalance?: Maybe<Scalars['BigInt']>;
  vaultBalance_not?: Maybe<Scalars['BigInt']>;
  vaultBalance_gt?: Maybe<Scalars['BigInt']>;
  vaultBalance_lt?: Maybe<Scalars['BigInt']>;
  vaultBalance_gte?: Maybe<Scalars['BigInt']>;
  vaultBalance_lte?: Maybe<Scalars['BigInt']>;
  vaultBalance_in?: Maybe<Array<Scalars['BigInt']>>;
  vaultBalance_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSupply?: Maybe<Scalars['BigInt']>;
  totalSupply_not?: Maybe<Scalars['BigInt']>;
  totalSupply_gt?: Maybe<Scalars['BigInt']>;
  totalSupply_lt?: Maybe<Scalars['BigInt']>;
  totalSupply_gte?: Maybe<Scalars['BigInt']>;
  totalSupply_lte?: Maybe<Scalars['BigInt']>;
  totalSupply_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSupply_not_in?: Maybe<Array<Scalars['BigInt']>>;
  available?: Maybe<Scalars['BigInt']>;
  available_not?: Maybe<Scalars['BigInt']>;
  available_gt?: Maybe<Scalars['BigInt']>;
  available_lt?: Maybe<Scalars['BigInt']>;
  available_gte?: Maybe<Scalars['BigInt']>;
  available_lte?: Maybe<Scalars['BigInt']>;
  available_in?: Maybe<Array<Scalars['BigInt']>>;
  available_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
};

export enum Withdrawal_OrderBy {
  Id = 'id',
  Vault = 'vault',
  Account = 'account',
  Amount = 'amount',
  Shares = 'shares',
  PricePerFullShare = 'pricePerFullShare',
  VaultBalance = 'vaultBalance',
  TotalSupply = 'totalSupply',
  Available = 'available',
  Transaction = 'transaction',
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

export const HarvestFragmentDoc = gql`
  fragment Harvest on Harvest {
    id
    vault {
      id
      pricePerFullShare
      totalSupply
      vaultBalance
      strategyBalance
      available
    }
    transaction {
      id
      timestamp
      blockNumber
      transactionHash
    }
    earnings
    pricePerFullShareBefore
    pricePerFullShareAfter
    pricePerFullShareBeforeRaw
    pricePerFullShareAfterRaw
    vaultBalanceBeforeRaw
    vaultBalanceAfterRaw
    strategyBalanceBeforeRaw
    strategyBalanceAfterRaw
    earningsRaw
  }
`;
export const HarvestsDocument = gql`
  query Harvests($first: Int, $skip: Int, $orderBy: Harvest_orderBy, $orderDirection: OrderDirection) {
    harvests {
      ...Harvest
    }
  }
  ${HarvestFragmentDoc}
`;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (sdkFunction) => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Harvests(variables?: HarvestsQueryVariables, requestHeaders?: Dom.RequestInit['headers']): Promise<HarvestsQuery> {
      return withWrapper(() => client.request<HarvestsQuery>(print(HarvestsDocument), variables, requestHeaders));
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export type HarvestFragment = { __typename?: 'Harvest' } & Pick<
  Harvest,
  | 'id'
  | 'earnings'
  | 'pricePerFullShareBefore'
  | 'pricePerFullShareAfter'
  | 'pricePerFullShareBeforeRaw'
  | 'pricePerFullShareAfterRaw'
  | 'vaultBalanceBeforeRaw'
  | 'vaultBalanceAfterRaw'
  | 'strategyBalanceBeforeRaw'
  | 'strategyBalanceAfterRaw'
  | 'earningsRaw'
> & {
    vault: { __typename?: 'Vault' } & Pick<
      Vault,
      'id' | 'pricePerFullShare' | 'totalSupply' | 'vaultBalance' | 'strategyBalance' | 'available'
    >;
    transaction: { __typename?: 'Transaction' } & Pick<
      Transaction,
      'id' | 'timestamp' | 'blockNumber' | 'transactionHash'
    >;
  };

export type HarvestsQueryVariables = Exact<{
  first?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Harvest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
}>;

export type HarvestsQuery = { __typename?: 'Query' } & {
  harvests: Array<{ __typename?: 'Harvest' } & HarvestFragment>;
};
