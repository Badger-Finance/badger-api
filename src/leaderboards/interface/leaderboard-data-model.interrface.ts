import { Description, Example, Property, Title } from '@tsed/schema';
import { CachedBoost } from './cached-boost.interface';
import { LeaderBoardData } from './leaderboard-data.interrface';

export class LeaderBoardDataModel implements LeaderBoardData {
  @Title('data')
  @Description('Leaderboard page data')
  @Example([
    {
      leaderboard: 'bosst',
      rank: 1,
      address: '0xdeadbeef',
      boost: 3,
      stakeRatio: 100,
      nftMultiplier: 3,
      nativeBalance: 300234.23,
      nonNativeBalance: 3245.12,
    },
  ])
  @Property()
  public data: CachedBoost[];

  @Title('page')
  @Description('Leaderboard page')
  @Example(1)
  @Property()
  public page: number;

  @Title('size')
  @Description('Leaderboard page size')
  @Example(20)
  @Property()
  public size: number;

  @Title('count')
  @Description('Leaderboard entries')
  @Example(3087)
  @Property()
  public count: number;

  @Title('maxPage')
  @Description('Maximum leaderboard page')
  @Example(65)
  @Property()
  public maxPage: number;

  constructor(data: LeaderBoardData) {
    this.data = data.data;
    this.page = data.page;
    this.size = data.size;
    this.count = data.count;
    this.maxPage = data.maxPage;
  }
}
