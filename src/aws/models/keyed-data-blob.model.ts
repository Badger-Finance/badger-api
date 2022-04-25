import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { PROTOCOL_DATA } from '../../config/constants';

@table(PROTOCOL_DATA)
export class KeyedDataBlob {
  @hashKey()
  id!: string;

  @attribute({ memberType: { type: 'Any' } })
  data!: Map<string, string | number | unknown>;

  getProperty<T>(property: string): T {
    const result = this.data.get(property) as T;
    if (result === undefined) {
      throw new Error(`Unable to resolve ${property}`);
    }
    return result;
  }

  getString(property: string): string {
    return this.getProperty<string>(property);
  }

  getNumber(property: string): number {
    return this.getProperty<number>(property);
  }
}
