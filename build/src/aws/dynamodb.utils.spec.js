"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eth_config_1 = require("../chains/config/eth.config");
const dynamodb_utils_1 = require("./dynamodb.utils");
describe('rewards.utils', () => {
    describe('getChainStartBlockKey', () => {
        it('returns underscore delimited string comprised of chain network and requested block', () => {
            expect((0, dynamodb_utils_1.getChainStartBlockKey)(new eth_config_1.Ethereum(), 13500000)).toEqual(`ethereum_13500000`);
        });
    });
});
//# sourceMappingURL=dynamodb.utils.spec.js.map