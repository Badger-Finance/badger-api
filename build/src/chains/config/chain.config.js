"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chain = void 0;
const tslib_1 = require("tslib");
const sdk_1 = tslib_1.__importStar(require("@badger-dao/sdk"));
const exceptions_1 = require("@tsed/exceptions");
const ethers_1 = require("ethers");
const tokens_config_1 = require("../../config/tokens.config");
const chain_vaults_1 = require("../vaults/chain.vaults");
class Chain {
    constructor(network, tokens, rpcUrl, strategy, emissionControl) {
        this.network = network;
        this.tokens = tokens;
        this.rpcUrl = rpcUrl;
        const config = (0, sdk_1.getNetworkConfig)(network);
        const { chainId } = config;
        this.chainId = chainId;
        this.vaults = new chain_vaults_1.ChainVaults(network);
        this.sdk = new sdk_1.default({ network, provider: rpcUrl });
        this.strategy = strategy;
        this.emissionControl = emissionControl;
    }
    get provider() {
        return this.sdk.provider;
    }
    static register(network, chain) {
        if (Chain.chains[network]) {
            return;
        }
        // Register chain objects
        Chain.chains[network] = chain;
        Chain.chainsByNetworkId[chain.chainId] = chain;
        if (network === sdk_1.Network.Polygon) {
            Chain.chains['matic'] = chain;
        }
        if (network === sdk_1.Network.BinanceSmartChain) {
            Chain.chains['binancesmartchain'] = chain;
        }
        // Register sdk objects
        const { sdk } = chain;
        Chain.sdks[network] = sdk;
        if (network === sdk_1.Network.Polygon) {
            Chain.sdks['matic'] = sdk;
        }
        if (network === sdk_1.Network.BinanceSmartChain) {
            Chain.sdks['binancesmartchain'] = sdk;
        }
    }
    static getChain(network) {
        if (!network) {
            network = sdk_1.Network.Ethereum;
        }
        const chain = this.chains[network];
        if (!chain) {
            throw new exceptions_1.BadRequest(`${network} is not a supported chain`);
        }
        return chain;
    }
    static getChainById(id) {
        if (!id) {
            id = '1';
        }
        const chain = Chain.chainsByNetworkId[id];
        if (!chain) {
            throw new exceptions_1.NotFound(`Could not find chain for '${id}'`);
        }
        return chain;
    }
    async getSdk() {
        const sdk = Chain.sdks[this.network];
        await sdk.ready();
        return sdk;
    }
    getBadgerTokenAddress() {
        return tokens_config_1.TOKENS.BADGER;
    }
    async getGasPrices() {
        let gasPrice;
        try {
            gasPrice = Number(ethers_1.ethers.utils.formatUnits(await this.provider.getGasPrice(), 9));
        }
        catch (err) {
            console.log(err);
            gasPrice = this.network === sdk_1.Network.Ethereum ? 60 : 5;
        }
        if (this.network === sdk_1.Network.Ethereum) {
            const defaultPriorityFee = 2;
            return {
                rapid: {
                    maxPriorityFeePerGas: defaultPriorityFee,
                    maxFeePerGas: this.sanitizePrice(gasPrice * 2),
                },
                fast: {
                    maxPriorityFeePerGas: defaultPriorityFee,
                    maxFeePerGas: this.sanitizePrice(gasPrice * 1.8),
                },
                standard: {
                    maxPriorityFeePerGas: defaultPriorityFee,
                    maxFeePerGas: this.sanitizePrice(gasPrice * 1.6),
                },
                slow: {
                    maxPriorityFeePerGas: defaultPriorityFee,
                    maxFeePerGas: this.sanitizePrice(gasPrice * 1.4),
                },
            };
        }
        // we don't have a mempool based guess here just define a spread
        return {
            rapid: this.sanitizePrice(gasPrice * 1.2),
            fast: this.sanitizePrice(gasPrice * 1.1),
            standard: this.sanitizePrice(gasPrice),
            slow: this.sanitizePrice(gasPrice * 0.9),
        };
    }
    sanitizePrice(price) {
        return Math.max(1, price);
    }
}
exports.Chain = Chain;
Chain.chains = {};
Chain.chainsByNetworkId = {};
Chain.sdks = {};
//# sourceMappingURL=chain.config.js.map