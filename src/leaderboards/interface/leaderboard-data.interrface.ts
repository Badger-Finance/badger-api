import { CachedBoost } from './cached-boost.interface';

export interface LeaderBoardData {
  data: CachedBoost[];
  page: number;
  size: number;
  count: number;
  maxPage: number;
}
