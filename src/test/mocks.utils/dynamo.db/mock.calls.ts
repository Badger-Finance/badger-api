/* eslint-disable @typescript-eslint/ban-ts-comment */

import { DataMapper, QueryIterator, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import { ConditionExpressionPredicate } from '@aws/dynamodb-expressions';
import createMockInstance from 'jest-create-mock-instance';

import { Nullable } from '../../../utils/types.utils';

type ddbKeysCondition = {
  [propertyName: string]: ConditionExpressionPredicate | any;
};

export function mockQuery<T, M>(
  items: T[],
  filter: Nullable<(model: M, keyCondition: ddbKeysCondition) => (items: T[]) => T[]> = null,
) {
  // @ts-ignore
  return jest.spyOn(DataMapper.prototype, 'query').mockImplementation((model, keyCondition: ddbKeysCondition) => {
    // @ts-ignore
    const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);
    let result = items;
    if (filter) result = filter(model, keyCondition)(items);
    // @ts-ignore
    qi[Symbol.iterator] = jest.fn(() => result.map((obj) => Object.assign(new model(), obj)).values());
    return qi;
  });
}

export function mockBatchGet(items: unknown[], filter?: (items: unknown[]) => unknown[]) {
  // @ts-ignore
  const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);
  let result = items;
  if (filter) {
    result = filter(items);
  }
  // @ts-ignore
  qi[Symbol.iterator] = jest.fn(() => result.values());
  return jest.spyOn(DataMapper.prototype, 'batchGet').mockImplementation(() => qi);
}

export function mockBatchPut(items: unknown[]) {
  // @ts-ignore
  const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);
  // @ts-ignore
  qi[Symbol.iterator] = jest.fn(() => items.values());
  return jest.spyOn(DataMapper.prototype, 'batchPut').mockImplementation(() => qi);
}

export function mockBatchDelete(items: unknown[]) {
  // @ts-ignore
  const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);
  // @ts-ignore
  qi[Symbol.iterator] = jest.fn(() => items.values());
  return jest.spyOn(DataMapper.prototype, 'batchDelete').mockImplementation(() => qi);
}
