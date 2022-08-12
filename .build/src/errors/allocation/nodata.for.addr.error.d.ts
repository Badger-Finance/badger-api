import { NotFoundError } from './not.found.error';
export declare class NodataForAddrError extends NotFoundError {
    constructor(addr: string);
}
