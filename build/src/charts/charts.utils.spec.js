"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@badger-dao/sdk");
const chart_data_model_1 = require("./chart-data.model");
const charts_utils_1 = require("./charts.utils");
describe('charts.utils', () => {
    describe('toChartDataBlob', () => {
        it('converts arbitrary data array into a chart data blob', () => {
            class AnimalData extends chart_data_model_1.ChartData {
                toBlankData() {
                    const copy = JSON.parse(JSON.stringify(this));
                    copy.animal = '';
                    copy.noise = '';
                    return copy;
                }
            }
            const arbitraryData = [
                Object.assign(new AnimalData(), {
                    id: 'sighting-0',
                    timestamp: 10,
                    animal: 'cow',
                    noise: 'moo',
                }),
                Object.assign(new AnimalData(), {
                    id: 'sighting-1',
                    timestamp: 20,
                    animal: 'dog',
                    noise: 'bark',
                }),
                Object.assign(new AnimalData(), {
                    id: 'sighting-2',
                    timestamp: 30,
                    animal: 'cat',
                    noise: 'lmeow',
                }),
            ];
            const result = (0, charts_utils_1.toChartDataBlob)('animals', sdk_1.ChartTimeFrame.Week, arbitraryData);
            expect(result).toMatchSnapshot();
        });
    });
    describe('toChartDataKey', () => {
        it('creates data keys for chart data inputs', () => expect((0, charts_utils_1.toChartDataKey)('animal', 'noise', sdk_1.ChartTimeFrame.Day)).toEqual('animal_noise_24h'));
    });
    describe('shouldUpdate', () => {
        it.each([
            [1, 0, sdk_1.ChartTimeFrame.Day, false],
            [-1 + sdk_1.ONE_HOUR_MS * 6, 0, sdk_1.ChartTimeFrame.Week, false],
            [-1 + sdk_1.ONE_DAY_MS, 0, sdk_1.ChartTimeFrame.YTD, false],
            [-1 + sdk_1.ONE_DAY_MS, 0, sdk_1.ChartTimeFrame.Month, false],
            [-1 + sdk_1.ONE_DAY_MS, 0, sdk_1.ChartTimeFrame.ThreeMonth, false],
            [-1 + sdk_1.ONE_DAY_MS, 0, sdk_1.ChartTimeFrame.Year, false],
            [-1 + sdk_1.ONE_DAY_MS, 0, sdk_1.ChartTimeFrame.Max, false],
            [1 + sdk_1.ONE_HOUR_MS, 0, sdk_1.ChartTimeFrame.Day, true],
            [sdk_1.ONE_HOUR_MS * 6, 0, sdk_1.ChartTimeFrame.Week, true],
            [sdk_1.ONE_DAY_MS, 0, sdk_1.ChartTimeFrame.YTD, true],
            [sdk_1.ONE_DAY_MS, 0, sdk_1.ChartTimeFrame.Month, true],
            [sdk_1.ONE_DAY_MS, 0, sdk_1.ChartTimeFrame.ThreeMonth, true],
            [sdk_1.ONE_DAY_MS, 0, sdk_1.ChartTimeFrame.Year, true],
            [sdk_1.ONE_DAY_MS, 0, sdk_1.ChartTimeFrame.Max, true],
        ])('%d to %d on %s timeframe returns %s', (start, end, timeframe, result) => {
            expect((0, charts_utils_1.shouldUpdate)(start, end, timeframe)).toEqual(result);
        });
    });
    describe('shouldTrim', () => {
        it.each([
            [-1 + sdk_1.ONE_DAY_MS, 0, sdk_1.ChartTimeFrame.Day, false],
            [-1 + sdk_1.ONE_DAY_MS, 0, sdk_1.ChartTimeFrame.Week, false],
            [-1 + sdk_1.ONE_DAY_MS, 0, sdk_1.ChartTimeFrame.YTD, false],
            [-1 + sdk_1.ONE_DAY_MS, 0, sdk_1.ChartTimeFrame.Month, false],
            [-1 + sdk_1.ONE_DAY_MS, 0, sdk_1.ChartTimeFrame.ThreeMonth, false],
            [-1 + sdk_1.ONE_DAY_MS, 0, sdk_1.ChartTimeFrame.Year, false],
            [-1 + sdk_1.ONE_DAY_MS, 0, sdk_1.ChartTimeFrame.Max, false],
            [sdk_1.ONE_DAY_MS, 0, sdk_1.ChartTimeFrame.Day, true],
            [sdk_1.ONE_DAY_MS * 7, 0, sdk_1.ChartTimeFrame.Week, true],
            [sdk_1.ONE_DAY_MS * 180, 0, sdk_1.ChartTimeFrame.YTD, false],
            [sdk_1.ONE_DAY_MS * 30, 0, sdk_1.ChartTimeFrame.Month, true],
            [sdk_1.ONE_DAY_MS * 90, 0, sdk_1.ChartTimeFrame.ThreeMonth, true],
            [sdk_1.ONE_DAY_MS * 365, 0, sdk_1.ChartTimeFrame.Year, true],
            [sdk_1.ONE_DAY_MS * 730, 0, sdk_1.ChartTimeFrame.Max, false],
        ])('%d to %d on %s timeframe returns %s', (start, end, timeframe, result) => {
            expect((0, charts_utils_1.shouldTrim)(start, end, timeframe)).toEqual(result);
        });
    });
});
//# sourceMappingURL=charts.utils.spec.js.map