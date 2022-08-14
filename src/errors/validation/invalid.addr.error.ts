import { ApiErrorCode } from "../enums/error.codes.enum";
import { ValidationError } from "./base.validation.error";

export class InvalidAddrError extends ValidationError {
  constructor(addr: string) {
    super(`Addr ${addr} is not a valid account`, ApiErrorCode.InvalidAddress);
  }
}
