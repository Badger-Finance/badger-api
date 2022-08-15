import { NotFoundError } from "./not.found.error";
export declare class NodataForVaultError extends NotFoundError {
  constructor(vault: string);
}
