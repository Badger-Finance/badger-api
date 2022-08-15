declare type dataType = Map<string, string | number | unknown | dataType>;
export declare class KeyedDataBlob {
  id: string;
  data: dataType;
  getProperty<T>(property: string): T;
  getString(property: string): string;
  getNumber(property: string): number;
}
export {};
