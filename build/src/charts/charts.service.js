"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsService = void 0;
const tslib_1 = require("tslib");
const di_1 = require("@tsed/di");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const historic_vault_snapshot_model_1 = require("../aws/models/historic-vault-snapshot.model");
const charts_utils_1 = require("./charts.utils");
let ChartsService = class ChartsService {
    async loadVaultChartData(address, timeframe, chain) {
        // validate vault request is correct and valid
        const requestedVault = await chain.vaults.getVault(address);
        const vaultBlobId = (0, dynamodb_utils_1.getVaultEntityId)(chain, requestedVault);
        const dataKey = (0, charts_utils_1.toChartDataKey)(historic_vault_snapshot_model_1.HistoricVaultSnapshotModel.NAMESPACE, vaultBlobId, timeframe);
        return (0, charts_utils_1.queryVaultCharts)(dataKey);
    }
};
ChartsService = tslib_1.__decorate([
    (0, di_1.Service)()
], ChartsService);
exports.ChartsService = ChartsService;
//# sourceMappingURL=charts.service.js.map