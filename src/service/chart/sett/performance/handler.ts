import { EventInput, getAssetData, respond } from '../../../util/util';

const ASSET_DATA = process.env.ASSET_DATA || ''; // FIXME: sane defaults?

export const handler = async (event: EventInput) => {
	if (event.source === 'serverless-plugin-warmup') {
		return 200;
	}

	const asset = event.pathParameters ? event.pathParameters.settName : null;
	const count = event.queryStringParameters ? Number(event.queryStringParameters.count) : null;

	const data = await getAssetData(ASSET_DATA, asset, count);
	if (!data) return respond(500);

	const initialRatioDiff = data.length > 0 ? parseFloat(data[0].ratio) - 1 : 0;

	const points = data.map((item) => ({ x: item.timestamp, y: item.ratio - initialRatioDiff }));
	return respond(200, points);
};
