import { KeyedDataBlob } from '../models/keyed-data-blob.model';
import { DataBlob } from './data-blob';

export abstract class ConvertableDataBlob {
  public keyedBlob: KeyedDataBlob;

  constructor(protected blob: DataBlob) {
    this.keyedBlob = Object.assign(new KeyedDataBlob(), {
      id: this.id(),
      data: blob,
    });
  }

  abstract id(): string;

  abstract toBlob(): DataBlob;
}
