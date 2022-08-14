import { ApiErrorCode } from "../enums/error.codes.enum";
import { AccessDeniedError } from "./base.access.denied.error";

export class AccessDeniedDevError extends AccessDeniedError {
  constructor(message = "") {
    super(message || "Access denied", ApiErrorCode.AccessDeniedDevModeOnly);
  }
}
