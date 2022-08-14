import { ApiErrorCode } from "../enums/error.codes.enum";
import { NotFoundError } from "./not.found.error";

export class NodataForVaultError extends NotFoundError {
  constructor(vault: string) {
    super(`Vault ${vault} doest have any data`, ApiErrorCode.NoDataForVault);
  }
}
