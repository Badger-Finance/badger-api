import { ApiErrorCode } from '../enums/error.codes.enum';
import { NotFoundError } from './not.found.error';

export class UnknownVaultError extends NotFoundError {
  constructor(vault: string) {
    super(`Unknown vault address: ${vault}`, ApiErrorCode.UnknownVault);
  }
}
