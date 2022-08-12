"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVaultEntityId = exports.getChainStartBlockKey = exports.getLeaderboardKey = exports.getDataMapper = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const aws_sdk_1 = tslib_1.__importDefault(require("aws-sdk"));
const leaderboard_type_enum_1 = require("../leaderboards/enums/leaderboard-type.enum");
const offline = process.env.IS_OFFLINE;
function getDataMapper() {
    let client;
    if (offline) {
        // client = new AWS.DynamoDB({
        //   region: 'localhost',
        //   endpoint: 'http://localhost:8000',
        //   accessKeyId: '',
        //   secretAccessKey: '',
        // });
        client = new aws_sdk_1.default.DynamoDB();
    }
    else {
        client = new aws_sdk_1.default.DynamoDB();
    }
    return new dynamodb_data_mapper_1.DataMapper({ client });
}
exports.getDataMapper = getDataMapper;
function getLeaderboardKey(chain) {
    return `${chain.network}_${leaderboard_type_enum_1.LeaderBoardType.BadgerBoost}`;
}
exports.getLeaderboardKey = getLeaderboardKey;
function getChainStartBlockKey(chain, block) {
    return `${chain.network}_${block}`;
}
exports.getChainStartBlockKey = getChainStartBlockKey;
function getVaultEntityId({ network }, { address }) {
    return `${network}-${address}`;
}
exports.getVaultEntityId = getVaultEntityId;
//# sourceMappingURL=dynamodb.utils.js.map