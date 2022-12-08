import { ApiErrorCode } from '../enums/error.codes.enum';
import { InternalError } from './internal.error';

export class DdbError extends InternalError {
  constructor(error: string) {
    super(`Ddb internal error: ${error}`, ApiErrorCode.DdbError);
  }
}
