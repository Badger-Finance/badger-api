import { ApiErrorCode } from '../enums/error.codes.enum';
import { ValidationError } from './base.validation.error';

export class OutOfRangeError extends ValidationError {
  constructor(num: number) {
    super(`${num} is out of range`, ApiErrorCode.OutOfRange);
  }
}
