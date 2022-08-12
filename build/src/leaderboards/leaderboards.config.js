"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBadgerType = exports.BADGER_RANKS = void 0;
const sdk_1 = require("@badger-dao/sdk");
exports.BADGER_RANKS = {
    [sdk_1.BadgerType.Basic]: 1,
    [sdk_1.BadgerType.Neo]: 20,
    [sdk_1.BadgerType.Hero]: 200,
    [sdk_1.BadgerType.Hyper]: 600,
    [sdk_1.BadgerType.Frenzy]: 1400,
};
function getBadgerType(score) {
    if (score >= exports.BADGER_RANKS[sdk_1.BadgerType.Frenzy]) {
        return sdk_1.BadgerType.Frenzy;
    }
    if (score >= exports.BADGER_RANKS[sdk_1.BadgerType.Hyper]) {
        return sdk_1.BadgerType.Hyper;
    }
    if (score >= exports.BADGER_RANKS[sdk_1.BadgerType.Hero]) {
        return sdk_1.BadgerType.Hero;
    }
    if (score >= exports.BADGER_RANKS[sdk_1.BadgerType.Neo]) {
        return sdk_1.BadgerType.Neo;
    }
    return sdk_1.BadgerType.Basic;
}
exports.getBadgerType = getBadgerType;
//# sourceMappingURL=leaderboards.config.js.map