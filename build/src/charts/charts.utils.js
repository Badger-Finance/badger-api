"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryVaultCharts = exports.updateSnapshots = exports.shouldTrim = exports.shouldUpdate = exports.toChartDataKey = exports.toChartDataBlob = exports.CHART_GRANULARITY_TIMEFRAMES = void 0;
const sdk_1 = require("@badger-dao/sdk");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const chart_data_blob_model_1 = require("../aws/models/chart-data-blob.model");
// list of ChartTimeFrame enums that contain unique capture granularities for searching
exports.CHART_GRANULARITY_TIMEFRAMES = [sdk_1.ChartTimeFrame.Max, sdk_1.ChartTimeFrame.Week, sdk_1.ChartTimeFrame.Day];
/**
 *
 * @param id
 * @param timeframe
 * @param data
 * @returns
 */
function toChartDataBlob(id, timeframe, data) {
    return Object.assign(new chart_data_blob_model_1.ChartDataBlob(), {
        id,
        timeframe,
        data,
    });
}
exports.toChartDataBlob = toChartDataBlob;
/**
 *
 * @param namespace
 * @param id
 * @param timeframe
 * @returns
 */
function toChartDataKey(namespace, id, timeframe) {
    return [namespace, id, timeframe].join('_');
}
exports.toChartDataKey = toChartDataKey;
/**
 *
 * @param reference
 * @param timestamp
 * @param timeframe
 * @returns
 */
function shouldUpdate(reference, timestamp, timeframe) {
    const difference = reference - timestamp;
    let update = false;
    switch (timeframe) {
        case sdk_1.ChartTimeFrame.Max:
        case sdk_1.ChartTimeFrame.Year:
        case sdk_1.ChartTimeFrame.ThreeMonth:
        case sdk_1.ChartTimeFrame.Month:
        case sdk_1.ChartTimeFrame.YTD:
            update = difference >= sdk_1.ONE_DAY_MS;
            break;
        case sdk_1.ChartTimeFrame.Week:
            update = difference >= sdk_1.ONE_HOUR_MS * 6;
            break;
        default:
            update = difference >= sdk_1.ONE_HOUR_MS;
    }
    return update;
}
exports.shouldUpdate = shouldUpdate;
/**
 *
 * @param reference
 * @param timestamp
 * @param timeframe
 * @returns
 */
function shouldTrim(reference, timestamp, timeframe) {
    const difference = reference - timestamp;
    let update;
    switch (timeframe) {
        case sdk_1.ChartTimeFrame.Year:
            update = difference >= sdk_1.ONE_DAY_MS * 365;
            break;
        case sdk_1.ChartTimeFrame.ThreeMonth:
            update = difference >= sdk_1.ONE_DAY_MS * 90;
            break;
        case sdk_1.ChartTimeFrame.Month:
            update = difference >= sdk_1.ONE_DAY_MS * 30;
            break;
        case sdk_1.ChartTimeFrame.Week:
            update = difference >= sdk_1.ONE_DAY_MS * 7;
            break;
        case sdk_1.ChartTimeFrame.Day:
            update = difference >= sdk_1.ONE_DAY_MS;
            break;
        // Year to date needs a full clear - so we will never trim
        case sdk_1.ChartTimeFrame.YTD:
        default:
            update = false;
    }
    return update;
}
exports.shouldTrim = shouldTrim;
/**
 *
 * @param namespace
 * @param snapshot
 */
async function updateSnapshots(namespace, snapshot) {
    const mapper = (0, dynamodb_utils_1.getDataMapper)();
    const isFirstOfYear = (date) => date.getDay() === 0 && date.getMonth() === 0;
    const { id, timestamp: now } = snapshot;
    for (const timeframe of Object.values(sdk_1.ChartTimeFrame)) {
        const searchKey = Object.assign(new chart_data_blob_model_1.ChartDataBlob(), {
            id: toChartDataKey(namespace, id, timeframe),
        });
        let cachedChart;
        try {
            cachedChart = await mapper.get(searchKey);
            if (timeframe === sdk_1.ChartTimeFrame.YTD) {
                const date = new Date(now);
                if (isFirstOfYear(date) && cachedChart.data.length > 1) {
                    // new year, force a new object to be created
                    cachedChart = undefined;
                }
            }
        }
        catch (err) {
            console.debug({ message: 'Unable to query cached chart, may simply not exist', err });
        } // no item found
        let updateCache = false;
        if (!cachedChart) {
            const blob = toChartDataBlob(searchKey.id, timeframe, []);
            console.debug(`Create blob for ${searchKey.id}`);
            try {
                cachedChart = await mapper.put(blob);
            }
            catch (err) {
                console.error({ message: 'Unable to save blob', err });
            }
            updateCache = true;
        }
        else {
            const { timeframe, data } = cachedChart;
            const recentSnapshot = data[0].timestamp;
            updateCache = shouldUpdate(now, recentSnapshot, timeframe);
            const lastSnapshot = data[data.length - 1].timestamp;
            if (shouldTrim(now, lastSnapshot, timeframe)) {
                cachedChart.data = cachedChart.data.slice(0, data.length - 1);
            }
        }
        if (updateCache && cachedChart) {
            cachedChart.data.splice(0, 0, snapshot);
            console.debug(`Update ${searchKey.id} (${cachedChart.data.length} entries)`);
            try {
                await mapper.put(cachedChart);
            }
            catch (err) {
                console.error({ message: 'Unable to save blob', err });
            }
        }
    }
}
exports.updateSnapshots = updateSnapshots;
async function queryVaultCharts(id) {
    try {
        const mapper = (0, dynamodb_utils_1.getDataMapper)();
        for await (const item of mapper.query(chart_data_blob_model_1.ChartDataBlob, { id }, { limit: 1, scanIndexForward: false })) {
            return item.data;
        }
        return [];
    }
    catch (err) {
        console.error(err);
        return [];
    }
}
exports.queryVaultCharts = queryVaultCharts;
//# sourceMappingURL=charts.utils.js.map