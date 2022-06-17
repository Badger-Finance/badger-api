import { ApiErrorCode } from '../enums/error.codes.enum';
import { NotFoundError } from './not.found.error';

export class NodataForChainError extends NotFoundError {
  constructor(chain: string) {
    super(`${chain} does not have requested data`, ApiErrorCode.NoDataForChain);
  }
}
