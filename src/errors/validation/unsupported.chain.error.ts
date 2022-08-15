import { ApiErrorCode } from '../enums/error.codes.enum';
import { ValidationError } from './base.validation.error';

export class UnsupportedChainError extends ValidationError {
  constructor(chain: string) {
    super(`${chain} is not supportable for request`, ApiErrorCode.UnsupportedChain);
  }
}
