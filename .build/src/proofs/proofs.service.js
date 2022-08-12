"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProofsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const ethers_1 = require("ethers");
const s3_utils_1 = require("../aws/s3.utils");
const constants_1 = require("../config/constants");
const nodata_for_addr_error_1 = require("../errors/allocation/nodata.for.addr.error");
const nodata_for_chain_error_1 = require("../errors/allocation/nodata.for.chain.error");
let ProofsService = class ProofsService {
    /**
     * Load user bouncer proof. These proofs are used for vault guest lists.
     * @param address User Ethereum address.
     */
    async getBouncerProof(chain, address) {
        const fileName = `badger-bouncer-${chain.chainId}.json`;
        const bouncerFile = await (0, s3_utils_1.getObject)(constants_1.REWARD_DATA, fileName);
        if (!bouncerFile) {
            throw new nodata_for_chain_error_1.NodataForChainError(chain.network);
        }
        const fileContents = JSON.parse(bouncerFile.toString('utf-8'));
        const claim = fileContents.claims[ethers_1.ethers.utils.getAddress(address)];
        if (!claim) {
            throw new nodata_for_addr_error_1.NodataForAddrError(`${address}`);
        }
        return claim.proof;
    }
};
ProofsService = tslib_1.__decorate([
    (0, common_1.Service)()
], ProofsService);
exports.ProofsService = ProofsService;
//# sourceMappingURL=proofs.service.js.map