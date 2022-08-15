import { ApiErrorCode } from './enums/error.codes.enum';
import { NetworkStatus } from './enums/network-status.enum';

export class BaseApiError extends Error {
  readonly message: string;
  readonly code: number;
  readonly status: number;

  constructor(message: string, code: ApiErrorCode, status: NetworkStatus) {
    super(message);

    this.message = message;
    this.code = code;
    this.status = status;
  }

  toString(): string {
    return `${this.message}; \n Api Code: ${this.code}; \n Network Status ${this.status}`;
  }
}
