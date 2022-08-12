import { NotFoundError } from './not.found.error';
export declare class UnknownVaultError extends NotFoundError {
    constructor(vault: string);
}
