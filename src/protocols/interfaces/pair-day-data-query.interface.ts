import { PairDayData } from "./pair-day-data.interface";

export interface PairDayDataQuery {
  data: {
    pairDayDatas: PairDayData[];
  };
  errors?: unknown;
}
