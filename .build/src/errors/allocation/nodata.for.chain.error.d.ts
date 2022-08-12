import { NotFoundError } from './not.found.error';
export declare class NodataForChainError extends NotFoundError {
    constructor(chain: string);
}
