import * as t from 'io-ts';

export const CachedValueSource = t.type({
  apy: t.number,
  name: t.string,
  oneDay: t.number,
  threeDay: t.number,
  sevenDay: t.number,
  thirtyDay: t.number,
  harvestable: t.boolean,
  address: t.string,
  type: t.string,
  updatedAt: t.number,
});

export type CachedValueSource = t.TypeOf<typeof CachedValueSource>;
