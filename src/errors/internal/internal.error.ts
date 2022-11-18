import { BaseApiError } from '../base.error';
import { ApiErrorCode } from '../enums/error.codes.enum';
import { NetworkStatus } from '../enums/network-status.enum';

export class InternalError extends BaseApiError {
  constructor(message: string, code: ApiErrorCode) {
    super(message || 'Internal error', code, NetworkStatus.Internal);
  }
}
