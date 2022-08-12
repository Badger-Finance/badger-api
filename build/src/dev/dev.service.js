"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevelopmentService = void 0;
const tslib_1 = require("tslib");
const di_1 = require("@tsed/di");
const dev_constants_1 = require("./dev.constants");
const dev_utils_1 = require("./dev.utils");
let DevelopmentService = class DevelopmentService {
    async updateDynamoDbSeeds() {
        const vaultsDefinitions = await (0, dev_utils_1.getVaultsDefinitionSeedData)();
        (0, dev_utils_1.saveSeedJSONFile)(vaultsDefinitions, dev_constants_1.VAULT_DEFINITION_SEED_NAME);
        return { status: 'success' };
    }
};
DevelopmentService = tslib_1.__decorate([
    (0, di_1.Service)()
], DevelopmentService);
exports.DevelopmentService = DevelopmentService;
//# sourceMappingURL=dev.service.js.map