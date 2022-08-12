"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderBoardDataModel = void 0;
const tslib_1 = require("tslib");
const schema_1 = require("@tsed/schema");
class LeaderBoardDataModel {
    constructor(data) {
        this.data = data.data;
        this.page = data.page;
        this.size = data.size;
        this.count = data.count;
        this.maxPage = data.maxPage;
    }
}
tslib_1.__decorate([
    (0, schema_1.Title)('data'),
    (0, schema_1.Description)('Leaderboard page data'),
    (0, schema_1.Example)([
        {
            leaderboard: 'bosst',
            rank: 1,
            address: '0xdeadbeef',
            boost: 3,
            stakeRatio: 100,
            nftMultiplier: 3,
            nativeBalance: 300234.23,
            nonNativeBalance: 3245.12,
        },
    ]),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Array)
], LeaderBoardDataModel.prototype, "data", void 0);
tslib_1.__decorate([
    (0, schema_1.Title)('page'),
    (0, schema_1.Description)('Leaderboard page'),
    (0, schema_1.Example)(1),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
], LeaderBoardDataModel.prototype, "page", void 0);
tslib_1.__decorate([
    (0, schema_1.Title)('size'),
    (0, schema_1.Description)('Leaderboard page size'),
    (0, schema_1.Example)(20),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
], LeaderBoardDataModel.prototype, "size", void 0);
tslib_1.__decorate([
    (0, schema_1.Title)('count'),
    (0, schema_1.Description)('Leaderboard entries'),
    (0, schema_1.Example)(3087),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
], LeaderBoardDataModel.prototype, "count", void 0);
tslib_1.__decorate([
    (0, schema_1.Title)('maxPage'),
    (0, schema_1.Description)('Maximum leaderboard page'),
    (0, schema_1.Example)(65),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
], LeaderBoardDataModel.prototype, "maxPage", void 0);
exports.LeaderBoardDataModel = LeaderBoardDataModel;
//# sourceMappingURL=leaderboard-data-model.interrface.js.map