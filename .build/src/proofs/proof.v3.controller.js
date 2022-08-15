"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProofsV3Controller = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const schema_1 = require("@tsed/schema");
const chain_config_1 = require("../chains/config/chain.config");
const query_param_error_1 = require("../errors/validation/query.param.error");
const proofs_service_1 = require("./proofs.service");
let ProofsV3Controller = class ProofsV3Controller {
  async getBouncerProof(address, chain) {
    if (!address) throw new query_param_error_1.QueryParamError("address");
    return this.proofsService.getBouncerProof(chain_config_1.Chain.getChain(chain), address);
  }
};
tslib_1.__decorate(
  [(0, common_1.Inject)(), tslib_1.__metadata("design:type", proofs_service_1.ProofsService)],
  ProofsV3Controller.prototype,
  "proofsService",
  void 0
);
tslib_1.__decorate(
  [
    (0, common_1.Get)(),
    (0, schema_1.ContentType)("json"),
    tslib_1.__param(0, (0, common_1.QueryParams)("address")),
    tslib_1.__param(1, (0, common_1.QueryParams)("chain")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
  ],
  ProofsV3Controller.prototype,
  "getBouncerProof",
  null
);
ProofsV3Controller = tslib_1.__decorate([(0, common_1.Controller)("/proof")], ProofsV3Controller);
exports.ProofsV3Controller = ProofsV3Controller;
//# sourceMappingURL=proof.v3.controller.js.map
