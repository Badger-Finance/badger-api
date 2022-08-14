import { ApiErrorCode } from "../enums/error.codes.enum";
import { ValidationError } from "./base.validation.error";

export class QueryParamError extends ValidationError {
  constructor(param: string) {
    super(`Query param ${param} invalid`, ApiErrorCode.QueryParamInvalid);
  }
}
