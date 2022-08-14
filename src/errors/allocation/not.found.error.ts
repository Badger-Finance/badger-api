import { BaseApiError } from "../base.error";
import { ApiErrorCode } from "../enums/error.codes.enum";
import { NetworkStatus } from "../enums/network-status.enum";

export class NotFoundError extends BaseApiError {
  constructor(message: string, code: ApiErrorCode) {
    super(message || "NotFound", code, NetworkStatus.NotFound);
  }
}
