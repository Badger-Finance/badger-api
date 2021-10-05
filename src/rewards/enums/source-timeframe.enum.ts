import { Performance } from '../../protocols/interfaces/performance.interface';

export enum SourceTimeFrame {
  OneDay = 1,
  ThreeDays = 3,
  SevenDays = 7,
  ThirtyDays = 30,
}

export const SOURCE_TIME_FRAMES = [
  SourceTimeFrame.OneDay,
  SourceTimeFrame.ThreeDays,
  SourceTimeFrame.SevenDays,
  SourceTimeFrame.ThirtyDays,
];

export function updatePerformance(performance: Performance, timeframe: SourceTimeFrame, value: number): Performance {
  switch (timeframe) {
    case SourceTimeFrame.OneDay:
      performance.oneDay = value;
      break;
    case SourceTimeFrame.ThreeDays:
      performance.threeDay = value;
      break;
    case SourceTimeFrame.SevenDays:
      performance.sevenDay = value;
      break;
    case SourceTimeFrame.ThirtyDays:
      performance.thirtyDay = value;
      break;
    default:
      throw new Error('Unsupported source time frame');
  }
  return performance;
}
