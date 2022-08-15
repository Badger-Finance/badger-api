import { ApiErrorCode } from '../enums/error.codes.enum';
import { NotFoundError } from './not.found.error';

export class NodataForAddrError extends NotFoundError {
  constructor(addr: string) {
    super(`No data for specified address: ${addr}`, ApiErrorCode.NoDataForAddress);
  }
}
