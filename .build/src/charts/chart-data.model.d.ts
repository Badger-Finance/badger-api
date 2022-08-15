export declare abstract class ChartData<T> {
  id: string;
  timestamp: number;
  abstract toBlankData(): T;
}
