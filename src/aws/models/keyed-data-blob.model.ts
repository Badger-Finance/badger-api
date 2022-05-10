import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { PROTOCOL_DATA } from '../../config/constants';

type dataType = Map<string, string | number | unknown | dataType>;

@table(PROTOCOL_DATA)
export class KeyedDataBlob {
  @hashKey()
  id!: string;

  @attribute({ memberType: { type: 'Any' } })
  data!: dataType;

  getProperty<T>(property: string): T {
    let result: T;

    // When we've added nested objects in Map
    // ddb serialized it as plain js Object
    if (this.data instanceof Map) {
      result = <T>this.data.get(property);
    } else {
      result = this.data[property];
    }

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
