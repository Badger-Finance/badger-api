import { BaseApiError } from '../base.error';
import { ApiErrorCode } from '../enums/error.codes.enum';
import { NetworkStatus } from '../enums/newtroks.status.enum';

export class ValidationError extends BaseApiError {
  constructor(message: string, code: ApiErrorCode) {
    super(message || 'Validation failed', code, NetworkStatus.BadRequest);
  }
}
