"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVault = exports.getLpTokenBalances = exports.constructVaultDefinition = exports.vaultToSnapshot = void 0;
const sdk_1 = require("@badger-dao/sdk");
const exceptions_1 = require("@tsed/exceptions");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const vault_definition_model_1 = require("../aws/models/vault-definition.model");
const vault_token_balance_model_1 = require("../aws/models/vault-token-balance.model");
const constants_1 = require("../config/constants");
const stage_enum_1 = require("../config/enums/stage.enum");
const prices_utils_1 = require("../prices/prices.utils");
const swap_utils_1 = require("../protocols/common/swap.utils");
const tokens_utils_1 = require("../tokens/tokens.utils");
const vaults_service_1 = require("../vaults/vaults.service");
const vaults_utils_1 = require("../vaults/vaults.utils");
async function vaultToSnapshot(chain, vaultDefinition) {
    var _a;
    const sdk = await chain.getSdk();
    const { address, totalSupply, balance, pricePerFullShare, available } = await sdk.vaults.loadVault({
        address: vaultDefinition.address,
        requireRegistry: false,
        state: sdk_1.VaultState.Open,
        version: (_a = vaultDefinition.version) !== null && _a !== void 0 ? _a : sdk_1.VaultVersion.v1,
        update: true,
    });
    let block = 0;
    try {
        block = await chain.provider.getBlockNumber();
    }
    catch (err) { } // block is not super important here - just continue on
    const [tokenPriceData, strategyInfo, boostWeight, cachedVault] = await Promise.all([
        (0, prices_utils_1.getPrice)(vaultDefinition.depositToken),
        (0, vaults_utils_1.getStrategyInfo)(chain, vaultDefinition),
        (0, vaults_utils_1.getBoostWeight)(chain, vaultDefinition),
        vaults_service_1.VaultsService.loadVault(chain, vaultDefinition),
    ]);
    const value = balance * tokenPriceData.price;
    const { yieldProjection: { yieldPeriodApr, harvestPeriodApr, nonHarvestApr }, } = cachedVault;
    return {
        block,
        timestamp: Date.now(),
        address,
        balance,
        strategyBalance: balance - available,
        pricePerFullShare,
        value: parseFloat(value.toFixed(2)),
        totalSupply,
        available,
        strategy: strategyInfo,
        boostWeight: boostWeight.toNumber(),
        apr: cachedVault.apr,
        yieldApr: yieldPeriodApr + nonHarvestApr,
        harvestApr: harvestPeriodApr + nonHarvestApr,
    };
}
exports.vaultToSnapshot = vaultToSnapshot;
async function constructVaultDefinition(chain, vault) {
    var _a, _b, _c, _d;
    const { address } = vault;
    const sdk = await chain.getSdk();
    const { sett } = await sdk.graph.loadSett({ id: address.toLowerCase() });
    if (!sett) {
        console.warn(`Cant fetch vault data from The Graph for chain ${chain.network}, ${address}`);
        return null;
    }
    const { createdAt, releasedAt, lastUpdatedAt } = sett;
    return Object.assign(new vault_definition_model_1.VaultDefinitionModel(), {
        id: (0, dynamodb_utils_1.getVaultEntityId)(chain, vault),
        address,
        createdAt: Number(createdAt),
        chain: chain.network,
        isProduction: 1,
        version: vault.version,
        state: vault.state,
        name: ((_a = vault.metadata) === null || _a === void 0 ? void 0 : _a.name) || vault.name,
        protocol: ((_b = vault.metadata) === null || _b === void 0 ? void 0 : _b.protocol) || sdk_1.Protocol.Badger,
        behavior: ((_c = vault.metadata) === null || _c === void 0 ? void 0 : _c.behavior) || sdk_1.VaultBehavior.None,
        client: ((_d = vault.metadata) === null || _d === void 0 ? void 0 : _d.client) || '',
        depositToken: vault.token.address,
        updatedAt: Number(lastUpdatedAt),
        releasedAt: Number(releasedAt),
        stage: vault.state === sdk_1.VaultState.Experimental ? stage_enum_1.Stage.Staging : stage_enum_1.Stage.Production,
        bouncer: sdk_1.BouncerType.None,
        isNew: Date.now() / 1000 - Number(releasedAt) <= constants_1.ONE_WEEK_SECONDS * 2,
    });
}
exports.constructVaultDefinition = constructVaultDefinition;
async function getLpTokenBalances(chain, vault) {
    const { depositToken, address } = vault;
    try {
        const liquidityData = await (0, swap_utils_1.getLiquidityData)(chain, depositToken);
        const { token0, token1, reserve0, reserve1, totalSupply } = liquidityData;
        const tokenData = await (0, tokens_utils_1.getFullTokens)(chain, [token0, token1]);
        const t0Token = tokenData[token0];
        const t1Token = tokenData[token1];
        // poolData returns the full liquidity pool, valueScalar acts to calculate the portion within the sett
        const settSnapshot = await (0, vaults_utils_1.getCachedVault)(chain, vault);
        const valueScalar = totalSupply > 0 ? settSnapshot.balance / totalSupply : 0;
        const t0TokenBalance = reserve0 * valueScalar;
        const t1TokenBalance = reserve1 * valueScalar;
        const tokenBalances = await Promise.all([(0, tokens_utils_1.toBalance)(t0Token, t0TokenBalance), (0, tokens_utils_1.toBalance)(t1Token, t1TokenBalance)]);
        return Object.assign(new vault_token_balance_model_1.VaultTokenBalance(), {
            vault: address,
            tokenBalances,
        });
    }
    catch (err) {
        throw new exceptions_1.NotFound(`${vault.protocol} pool pair ${depositToken} does not exist`);
    }
}
exports.getLpTokenBalances = getLpTokenBalances;
async function getVault(chain, contract, block) {
    const sdk = await chain.getSdk();
    const settId = contract.toLowerCase();
    const vars = { id: settId };
    if (block) {
        return sdk.graph.loadSett({ ...vars, block: { number: block } });
    }
    return sdk.graph.loadSett(vars);
}
exports.getVault = getVault;
//# sourceMappingURL=indexer.utils.js.map