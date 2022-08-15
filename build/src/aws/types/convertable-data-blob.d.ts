import { KeyedDataBlob } from "../models/keyed-data-blob.model";
import { DataBlob } from "./data-blob";
export declare abstract class ConvertableDataBlob {
  protected blob: DataBlob;
  keyedBlob: KeyedDataBlob;
  constructor(blob: DataBlob);
  abstract id(): string;
  abstract toBlob(): DataBlob;
}
