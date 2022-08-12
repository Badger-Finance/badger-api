import { BaseApiError } from '../base.error';
import { ApiErrorCode } from '../enums/error.codes.enum';
export declare class ValidationError extends BaseApiError {
    constructor(message: string, code: ApiErrorCode);
}
