"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushHistoricSnapshots = exports.checkTimeframeCondition = exports.getMigrationData = void 0;
const sdk_1 = require("@badger-dao/sdk");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const chart_data_blob_model_1 = require("../aws/models/chart-data-blob.model");
const migration_process_model_1 = require("../aws/models/migration-process.model");
const charts_utils_1 = require("../charts/charts.utils");
async function getMigrationData(id) {
    const mapper = (0, dynamodb_utils_1.getDataMapper)();
    let data = null;
    for await (const item of mapper.query(migration_process_model_1.MigrationProcessData, { id }, { limit: 1 })) {
        data = item;
    }
    return data;
}
exports.getMigrationData = getMigrationData;
function checkTimeframeCondition(timestamp, timeframe) {
    const difference = Date.now() - timestamp;
    let update;
    switch (timeframe) {
        case sdk_1.ChartTimeFrame.Year:
            update = difference <= sdk_1.ONE_DAY_MS * 365;
            break;
        case sdk_1.ChartTimeFrame.ThreeMonth:
            update = difference <= sdk_1.ONE_DAY_MS * 90;
            break;
        case sdk_1.ChartTimeFrame.Month:
            update = difference <= sdk_1.ONE_DAY_MS * 30;
            break;
        case sdk_1.ChartTimeFrame.Week:
            update = difference <= sdk_1.ONE_DAY_MS * 7;
            break;
        case sdk_1.ChartTimeFrame.Day:
            update = difference <= sdk_1.ONE_DAY_MS;
            break;
        case sdk_1.ChartTimeFrame.Max:
            update = true;
            break;
        case sdk_1.ChartTimeFrame.YTD:
            update = new Date(timestamp).getFullYear() === 2022;
            break;
        default:
            update = false;
    }
    return update;
}
exports.checkTimeframeCondition = checkTimeframeCondition;
async function pushHistoricSnapshots(namespace, snapshot) {
    let updatedCount = 0;
    const mapper = (0, dynamodb_utils_1.getDataMapper)();
    for (const timeframe of Object.values(sdk_1.ChartTimeFrame)) {
        const searchKey = Object.assign(new chart_data_blob_model_1.ChartDataBlob(), {
            id: (0, charts_utils_1.toChartDataKey)(namespace, snapshot.id, timeframe),
        });
        let cachedChart;
        try {
            cachedChart = await mapper.get(searchKey);
        }
        catch (_) {
            cachedChart = undefined;
        }
        if (!cachedChart) {
            const blob = (0, charts_utils_1.toChartDataBlob)(searchKey.id, timeframe, []);
            console.log(`New chart blob created ${searchKey.id}`);
            try {
                cachedChart = await mapper.put(blob);
            }
            catch (err) {
                console.error(`Unable to save chart data for ${searchKey.id}`);
                continue;
            }
        }
        const { data } = cachedChart;
        const prevSnapshot = data[0];
        const inTimeFrameCondition = checkTimeframeCondition(snapshot.timestamp, timeframe);
        const frequencyGapMatch = !prevSnapshot || (prevSnapshot && (0, charts_utils_1.shouldUpdate)(snapshot.timestamp, prevSnapshot.timestamp, timeframe));
        if (inTimeFrameCondition && frequencyGapMatch) {
            cachedChart.data.unshift(snapshot);
            try {
                await mapper.put(cachedChart);
            }
            catch (err) {
                console.error({ message: 'Unable to save blob', err });
            }
            updatedCount++;
        }
    }
    return updatedCount;
}
exports.pushHistoricSnapshots = pushHistoricSnapshots;
//# sourceMappingURL=migration.utils.js.map