import * as t from 'io-ts';

export const CachedSettSnapshot = t.type({
  address: t.string,
  balance: t.number,
  ratio: t.number,
  settValue: t.number,
  supply: t.number,
  updatedAt: t.number,
});

export type CachedSettSnapshot = t.TypeOf<typeof CachedSettSnapshot>;
