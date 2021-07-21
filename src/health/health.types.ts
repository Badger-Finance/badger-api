import { RequestDocument } from 'graphql-request/dist/types';

export type ContractFunctionIo = { internalType: string; name: string; type: string };

export type ContractFunction = {
  inputs: ContractFunctionIo[];
  name: string;
  outputs: ContractFunctionIo[];
  stateMutability: string;
  type: 'function';
};

export type Abi = ContractFunction[];

export type Contract = {
  address: string;
  abi: Abi;
  name: string;
};

export type ContractToAbis = {
  [provider: string]: Contract[];
};

export type Result = {
  error?: string;
  isError: boolean;
  name: string;
  result: string;
};

export type ContractError = Pick<Result, 'error' | 'isError'>;

export type ContractResult = {
  address: string;
  error: ContractError;
  name: string;
  viewMethodResults: Result[];
};

export type ChainResult = {
  chain: string;
  contractResults: ContractResult[];
};

export type Endpoint = {
  name: string;
  url: URL;
};

export type Subgraph = {
  name: string;
  query: RequestDocument;
  url: URL;
};

export type SubgraphResult = {
  isError: boolean;
  result: unknown;
  subgraph: Subgraph;
};

export type HealthSnapshot = {
  dateTime: string;
  name: string;
  results: SubgraphResult[] | ChainResult[] | Result[];
};

export interface Links {
  [rel: string]: URL;
}
