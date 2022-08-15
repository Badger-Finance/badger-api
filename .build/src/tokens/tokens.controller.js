"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensController = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const schema_1 = require("@tsed/schema");
const chain_config_1 = require("../chains/config/chain.config");
const token_config_model_interface_1 = require("./interfaces/token-config-model.interface");
const tokens_utils_1 = require("./tokens.utils");
let TokensController = class TokensController {
  async getTokens(chain) {
    const requestChain = chain_config_1.Chain.getChain(chain);
    const chainTokens = Object.keys(requestChain.tokens);
    return (0, tokens_utils_1.getFullTokens)(requestChain, chainTokens);
  }
};
tslib_1.__decorate(
  [
    (0, common_1.Get)(),
    (0, common_1.UseCache)(),
    (0, schema_1.ContentType)("json"),
    (0, schema_1.Summary)("Get a summary of tokens related to the Badger Protocol"),
    (0, schema_1.Returns)(200, token_config_model_interface_1.TokenConfigModel),
    (0, schema_1.Description)("Return a map of checksum contract address to token information."),
    tslib_1.__param(0, (0, common_1.QueryParams)("chain")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
  ],
  TokensController.prototype,
  "getTokens",
  null
);
TokensController = tslib_1.__decorate([(0, common_1.Controller)("/tokens")], TokensController);
exports.TokensController = TokensController;
//# sourceMappingURL=tokens.controller.js.map
