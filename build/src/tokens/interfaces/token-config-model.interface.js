"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenConfigModel = void 0;
const tslib_1 = require("tslib");
const schema_1 = require("@tsed/schema");
const full_token_mock_1 = require("../mocks/full-token.mock");
let TokenConfigModel = class TokenConfigModel {};
TokenConfigModel = tslib_1.__decorate(
  [
    (0, schema_1.Description)("Mapping of checksum token address to token metadata"),
    (0, schema_1.Example)(full_token_mock_1.fullTokenMockMap)
  ],
  TokenConfigModel
);
exports.TokenConfigModel = TokenConfigModel;
//# sourceMappingURL=token-config-model.interface.js.map
