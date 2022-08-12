"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupTestVault = exports.setupDdbHarvests = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const sdk_1 = tslib_1.__importStar(require("@badger-dao/sdk"));
const common_1 = require("@tsed/common");
const exceptions_1 = require("@tsed/exceptions");
const jest_create_mock_instance_1 = tslib_1.__importDefault(require("jest-create-mock-instance"));
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const tokens_config_1 = require("../config/tokens.config");
const source_type_enum_1 = require("../rewards/enums/source-type.enum");
const Server_1 = require("../Server");
const tests_utils_1 = require("../test/tests.utils");
const full_token_mock_1 = require("../tokens/mocks/full-token.mock");
const tokensUtils = tslib_1.__importStar(require("../tokens/tokens.utils"));
const tokens_utils_1 = require("../tokens/tokens.utils");
const vaults_harvests_map_mock_1 = require("./mocks/vaults-harvests-map.mock");
const vaultsUtils = tslib_1.__importStar(require("./vaults.utils"));
const yields_utils_1 = require("./yields.utils");
const TEST_VAULT = tokens_config_1.TOKENS.BCRV_SBTC;
function setupDdbHarvests() {
    (0, tests_utils_1.mockChainVaults)();
    jest.spyOn(sdk_1.default.prototype, 'ready').mockImplementation();
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'query').mockImplementation((_model, _condition) => {
        // @ts-ignore
        const qi = (0, jest_create_mock_instance_1.default)(dynamodb_data_mapper_1.QueryIterator);
        // @ts-ignore
        qi[Symbol.iterator] = jest.fn(() => {
            return (vaults_harvests_map_mock_1.vaultsHarvestsMapMock[_condition.vault] || []).values();
        });
        return qi;
    });
    /* eslint-enable @typescript-eslint/ban-ts-comment */
}
exports.setupDdbHarvests = setupDdbHarvests;
function setupTestVault() {
    (0, tests_utils_1.mockChainVaults)();
    jest.spyOn(tokensUtils, 'getFullToken').mockImplementation(async (_, tokenAddr) => {
        return full_token_mock_1.fullTokenMockMap[tokenAddr] || full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER];
    });
    const baseTime = 1656606946;
    jest.spyOn(Date, 'now').mockImplementation(() => baseTime * 1000 + sdk_1.ONE_DAY_MS * 14);
    jest.spyOn(vaultsUtils, 'queryYieldEstimate').mockImplementation(async (vaultDefinition) => ({
        vault: vaultDefinition.address,
        yieldTokens: [(0, tokens_utils_1.mockBalance)(full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.CVX], 10)],
        harvestTokens: [(0, tokens_utils_1.mockBalance)(full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.CVX], 10)],
        lastHarvestedAt: baseTime,
        lastMeasuredAt: baseTime,
        previousYieldTokens: [(0, tokens_utils_1.mockBalance)(full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.CVX], 10)],
        previousHarvestTokens: [(0, tokens_utils_1.mockBalance)(full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.CVX], 10)],
        duration: 60000,
        lastReportedAt: 0,
    }));
    jest
        .spyOn(vaultsUtils, 'getCachedVault')
        .mockImplementation(async (chain, vaultDefinition) => {
        const vault = await vaultsUtils.defaultVault(chain, vaultDefinition);
        vault.value = parseInt(vaultDefinition.address.slice(0, 7), 16);
        vault.balance = 10;
        return vault;
    });
    jest
        .spyOn(vaultsUtils, 'queryYieldSources')
        .mockImplementation(async (vault) => {
        const performance = parseInt(vault.address.slice(0, 5), 16) / 100;
        const underlying = (0, yields_utils_1.createYieldSource)(vault, source_type_enum_1.SourceType.Compound, vaultsUtils.VAULT_SOURCE, performance);
        const badger = (0, yields_utils_1.createYieldSource)(vault, source_type_enum_1.SourceType.Emission, 'Badger Rewards', performance);
        const fees = (0, yields_utils_1.createYieldSource)(vault, source_type_enum_1.SourceType.TradeFee, 'Curve LP Fees', performance);
        return [underlying, badger, fees];
    });
    jest
        .spyOn(tokensUtils, 'getVaultTokens')
        .mockImplementation(async (_chain, vault, _currency) => {
        const token = full_token_mock_1.fullTokenMockMap[vault.underlyingToken] || full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER];
        if (token.lpToken) {
            const bal0 = parseInt(token.address.slice(0, 4), 16);
            const bal1 = parseInt(token.address.slice(0, 6), 16);
            return [(0, tokens_utils_1.mockBalance)(token, bal0), (0, tokens_utils_1.mockBalance)(token, bal1)];
        }
        return [(0, tokens_utils_1.mockBalance)(token, parseInt(token.address.slice(0, 4), 16))];
    });
}
exports.setupTestVault = setupTestVault;
describe('VaultsController', () => {
    let request;
    beforeAll(common_1.PlatformTest.bootstrap(Server_1.Server));
    beforeAll(async () => {
        request = (0, supertest_1.default)(common_1.PlatformTest.callback());
    });
    afterAll(common_1.PlatformTest.reset);
    describe('GET /v2/vaults', () => {
        describe('with no specified chain', () => {
            it('returns eth vaults', async (done) => {
                setupTestVault();
                const { body } = await request.get('/v2/vaults').expect(200);
                expect(body).toMatchSnapshot();
                done();
            });
        });
        describe('with a specified chain', () => {
            it('returns the vaults for eth', async (done) => {
                setupTestVault();
                const { body } = await request.get('/v2/vaults?chain=ethereum').expect(200);
                expect(body).toMatchSnapshot();
                done();
            });
            it('returns the vaults for bsc', async (done) => {
                setupTestVault();
                const { body } = await request.get('/v2/vaults?chain=binancesmartchain').expect(200);
                expect(body).toMatchSnapshot();
                done();
            });
        });
        describe('with an invalid specified chain', () => {
            it('returns a 400', async (done) => {
                const { body } = await request.get('/v2/vaults?chain=invalid').expect(exceptions_1.BadRequest.STATUS);
                expect(body).toMatchSnapshot();
                done();
            });
        });
    });
    describe('GET /v2/harvests', () => {
        beforeEach(setupDdbHarvests);
        describe('success cases', () => {
            it('Return extended harvest for chain vaults', async (done) => {
                const { body } = await request.get('/v2/vaults/harvests').expect(200);
                expect(body).toMatchSnapshot();
                done();
            });
        });
        describe('error cases', () => {
            it('returns a 400 for invalide chain', async (done) => {
                const { body } = await request.get('/v2/vaults/harvests?chain=invalid').expect(exceptions_1.BadRequest.STATUS);
                expect(body).toMatchSnapshot();
                done();
            });
        });
    });
    describe('GET /v2/harvests/:vault', () => {
        beforeEach(setupDdbHarvests);
        describe('success cases', () => {
            it('Return extended harvests for chain vault by addr', async (done) => {
                const { body } = await request.get(`/v2/vaults/harvests/${TEST_VAULT}`).expect(200);
                expect(body).toMatchSnapshot();
                done();
            });
        });
        describe('error cases', () => {
            it('returns a 400 for invalide chain', async (done) => {
                const { body } = await request.get(`/v2/vaults/harvests/${TEST_VAULT}?chain=invalid`).expect(exceptions_1.BadRequest.STATUS);
                expect(body).toMatchSnapshot();
                done();
            });
        });
    });
});
//# sourceMappingURL=vaults.v2.controller.spec.js.map