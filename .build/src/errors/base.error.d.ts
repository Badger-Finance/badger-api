import { ApiErrorCode } from './enums/error.codes.enum';
import { NetworkStatus } from './enums/network-status.enum';
export declare class BaseApiError extends Error {
    readonly message: string;
    readonly code: number;
    readonly status: number;
    constructor(message: string, code: ApiErrorCode, status: NetworkStatus);
    toString(): string;
}
