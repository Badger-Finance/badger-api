"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenNotFound = exports.TokenError = void 0;
class TokenError extends Error {
    constructor(msg) {
        super(msg);
    }
}
exports.TokenError = TokenError;
class TokenNotFound extends TokenError {
    constructor(addr) {
        super(`Token not found addr: ${addr}`);
    }
}
exports.TokenNotFound = TokenNotFound;
//# sourceMappingURL=token.error.js.map