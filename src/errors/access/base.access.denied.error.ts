import { BaseApiError } from '../base.error';
import { ApiErrorCode } from '../enums/error.codes.enum';
import { NetworkStatus } from '../enums/newtroks.status.enum';

export class AccessDeniedError extends BaseApiError {
  constructor(message: string, code: ApiErrorCode) {
    super(message || 'Access to resource denied', code, NetworkStatus.Forbidden);
  }
}
