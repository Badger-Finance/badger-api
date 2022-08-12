"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const sdk_1 = tslib_1.__importDefault(require("@badger-dao/sdk"));
const chain_1 = require("../chains/chain");
const chain_config_1 = require("../chains/config/chain.config");
const constants_1 = require("../test/constants");
const tests_utils_1 = require("../test/tests.utils");
const vault_harvests_on_chain_1 = require("../vaults/mocks/vault-harvests-on-chain");
const vaultsUtils = tslib_1.__importStar(require("../vaults/vaults.utils"));
const harvest_compound_indexer_1 = require("./harvest-compound-indexer");
describe('harvest-compound.indexer', () => {
    let put;
    beforeEach(() => {
        (0, tests_utils_1.mockChainVaults)();
        console.log = jest.fn();
        console.error = jest.fn();
        console.warn = jest.fn();
        put = jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'put').mockImplementation();
        jest.spyOn(vaultsUtils, 'getLastCompoundHarvest').mockImplementation(async () => null);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        jest.spyOn(vaultsUtils, 'getVaultHarvestsOnChain').mockImplementation(async (chain, vault, fromBlock) => {
            let onChainHarvests = vault_harvests_on_chain_1.vaultHarvestsOnChainMock[vault];
            if (fromBlock) {
                onChainHarvests = onChainHarvests.filter((harvest) => harvest.block > fromBlock);
            }
            return onChainHarvests;
        });
        jest.spyOn(sdk_1.default.prototype, 'ready').mockImplementation();
        jest.spyOn(chain_config_1.Chain.prototype, 'getSdk').mockImplementation();
    });
    describe('indexVaultsHarvestsCompund', () => {
        it('should save all harvests from all chains to ddb', async () => {
            await (0, harvest_compound_indexer_1.indexVaultsHarvestsCompund)();
            expect(put.mock.calls.length).toBe(chain_1.SUPPORTED_CHAINS.length * vault_harvests_on_chain_1.vaultHarvestsOnChainMock[constants_1.MOCK_VAULT_DEFINITION.address].length);
        });
        it('should get and save harvests only after the block of the last in ddb', async () => {
            const blocks = vault_harvests_on_chain_1.vaultHarvestsOnChainMock[constants_1.MOCK_VAULT_DEFINITION.address].map((h) => h.block).sort();
            const cutoffBlock = blocks[1];
            const conformingHarvests = vault_harvests_on_chain_1.vaultHarvestsOnChainMock[constants_1.MOCK_VAULT_DEFINITION.address].filter((h) => h.block > cutoffBlock);
            jest
                .spyOn(vaultsUtils, 'getLastCompoundHarvest')
                .mockImplementation(async () => ({ block: cutoffBlock }));
            await (0, harvest_compound_indexer_1.indexVaultsHarvestsCompund)();
            // mock data intentionally includes
            expect(put.mock.calls.length).toBe(chain_1.SUPPORTED_CHAINS.length * conformingHarvests.length);
        });
    });
});
//# sourceMappingURL=harvest-compound-indexer.spec.js.map