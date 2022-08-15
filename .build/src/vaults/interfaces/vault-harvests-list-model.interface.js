"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultHarvestsMapModel = void 0;
const tslib_1 = require("tslib");
const schema_1 = require("@tsed/schema");
const vaults_harvests_map_mock_1 = require("../mocks/vaults-harvests-map.mock");
let VaultHarvestsMapModel = class VaultHarvestsMapModel {};
VaultHarvestsMapModel = tslib_1.__decorate(
  [
    (0, schema_1.Description)("Harvests by vaults map"),
    (0, schema_1.Example)(vaults_harvests_map_mock_1.vaultsHarvestsMapMock)
  ],
  VaultHarvestsMapModel
);
exports.VaultHarvestsMapModel = VaultHarvestsMapModel;
//# sourceMappingURL=vault-harvests-list-model.interface.js.map
