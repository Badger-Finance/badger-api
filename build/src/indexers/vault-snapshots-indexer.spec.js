"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const chain_1 = require("../chains/chain");
const chartUtils = tslib_1.__importStar(require("../charts/charts.utils"));
const constants_1 = require("../test/constants");
const tests_utils_1 = require("../test/tests.utils");
const indexerUtils = tslib_1.__importStar(require("./indexer.utils"));
const vault_snapshots_indexer_1 = require("./vault-snapshots-indexer");
describe('refreshVaultSnapshots', () => {
    const supportedAddresses = Array.from({ length: chain_1.SUPPORTED_CHAINS.length }, () => constants_1.MOCK_VAULT_DEFINITION.address);
    let vaultToSnapshot;
    let put;
    beforeEach(async () => {
        (0, tests_utils_1.mockChainVaults)();
        jest.spyOn(chartUtils, 'updateSnapshots').mockImplementation();
        const baseSnapshot = JSON.parse(JSON.stringify(constants_1.MOCK_VAULT_SNAPSHOT));
        baseSnapshot.address = constants_1.MOCK_VAULT_DEFINITION.address;
        vaultToSnapshot = jest.spyOn(indexerUtils, 'vaultToSnapshot').mockImplementation(async (_c, _v) => baseSnapshot);
        put = jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'put').mockImplementation();
        await (0, vault_snapshots_indexer_1.refreshVaultSnapshots)();
    });
    it('fetches vaults for all chains', async () => {
        const requestedAddresses = vaultToSnapshot.mock.calls.map((calls) => calls[1].address);
        expect(requestedAddresses.sort()).toEqual(supportedAddresses);
    });
    it('saves vaults in dynamo db', () => {
        const requestedAddresses = [];
        // Verify each saved object.
        for (const input of put.mock.calls) {
            // force convert input as jest overload mock causes issues
            const snapshot = input[0];
            expect(snapshot).toMatchObject({
                address: expect.any(String),
                balance: expect.any(Number),
                totalSupply: expect.any(Number),
                pricePerFullShare: expect.any(Number),
                value: expect.any(Number),
                strategy: {
                    address: expect.any(String),
                    withdrawFee: expect.any(Number),
                    performanceFee: expect.any(Number),
                    strategistFee: expect.any(Number),
                },
                block: expect.any(Number),
                boostWeight: expect.any(Number),
                timestamp: expect.any(Number),
                available: expect.any(Number),
            });
            requestedAddresses.push(snapshot.address);
        }
        // Verify addresses match supported setts.
        expect(requestedAddresses.sort()).toEqual(supportedAddresses);
    });
});
//# sourceMappingURL=vault-snapshots-indexer.spec.js.map