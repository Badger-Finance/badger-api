import { LeaderBoardData, UserBoostData } from "@badger-dao/sdk";
export declare class LeaderBoardDataModel implements LeaderBoardData {
  data: UserBoostData[];
  page: number;
  size: number;
  count: number;
  maxPage: number;
  constructor(data: LeaderBoardData);
}
