export declare class TokenError extends Error {
  constructor(msg: string);
}
export declare class TokenNotFound extends TokenError {
  constructor(addr: string);
}
