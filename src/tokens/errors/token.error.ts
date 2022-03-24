export class TokenError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class TokenNotFound extends TokenError {
  constructor(addr: string) {
    super(`Token not found addr: ${addr}`);
  }
}
