"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProofsV2Controller = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const schema_1 = require("@tsed/schema");
const chain_config_1 = require("../chains/config/chain.config");
const proofs_service_1 = require("./proofs.service");
let ProofsV2Controller = class ProofsV2Controller {
    async getBouncerProof(address, chain) {
        return this.proofsService.getBouncerProof(chain_config_1.Chain.getChain(chain), address);
    }
};
tslib_1.__decorate([
    (0, common_1.Inject)(),
    tslib_1.__metadata("design:type", proofs_service_1.ProofsService)
], ProofsV2Controller.prototype, "proofsService", void 0);
tslib_1.__decorate([
    (0, common_1.Get)('/:address'),
    (0, schema_1.ContentType)('json'),
    tslib_1.__param(0, (0, common_1.PathParams)('address')),
    tslib_1.__param(1, (0, common_1.QueryParams)('chain')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProofsV2Controller.prototype, "getBouncerProof", null);
ProofsV2Controller = tslib_1.__decorate([
    (0, schema_1.Deprecated)(),
    (0, common_1.Controller)('/proofs')
], ProofsV2Controller);
exports.ProofsV2Controller = ProofsV2Controller;
//# sourceMappingURL=proofs.v2.controller.js.map