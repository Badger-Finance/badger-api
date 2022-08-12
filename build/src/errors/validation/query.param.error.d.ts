import { ValidationError } from './base.validation.error';
export declare class QueryParamError extends ValidationError {
    constructor(param: string);
}
