import { ValidationError } from "./base.validation.error";
export declare class UnsupportedChainError extends ValidationError {
  constructor(chain: string);
}
