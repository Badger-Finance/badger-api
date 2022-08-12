"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@badger-dao/sdk");
const leaderboards_config_1 = require("./leaderboards.config");
describe('leaderboards.config', () => {
    describe('getBadgerType', () => {
        it.each([
            [sdk_1.BadgerType.Basic, 1, 19],
            [sdk_1.BadgerType.Neo, 20, 199],
            [sdk_1.BadgerType.Hero, 200, 599],
            [sdk_1.BadgerType.Hyper, 600, 1399],
            [sdk_1.BadgerType.Frenzy, 1400, 2000],
        ])('returns %s badger for scores %d to %d', (badgerType, start, end) => {
            for (let i = start; i < end; i++) {
                expect((0, leaderboards_config_1.getBadgerType)(i)).toEqual(badgerType);
            }
        });
    });
});
//# sourceMappingURL=leaderboards.config.spec.js.map