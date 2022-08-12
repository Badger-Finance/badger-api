import { ValidationError } from './base.validation.error';
export declare class InvalidAddrError extends ValidationError {
    constructor(addr: string);
}
