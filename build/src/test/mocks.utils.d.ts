/// <reference types="jest" />
import { QueryIterator, StringToAnyObjectMap } from "@aws/dynamodb-data-mapper";
import { Currency, Token, TokenValue } from "@badger-dao/sdk";
import { TestEthereum } from "../chains/config/teth.config";
export declare function setupMockChain(): TestEthereum;
export declare function mockBalance(token: Token, balance: number, currency?: Currency): TokenValue;
export declare function mockQueryResults(
  items: unknown[],
  filter?: (items: unknown[]) => unknown[]
): jest.SpyInstance<
  QueryIterator<StringToAnyObjectMap>,
  [parameters: import("@aws/dynamodb-data-mapper").QueryParameters<StringToAnyObjectMap>]
>;
