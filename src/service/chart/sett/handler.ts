import { ASSET_DATA } from '../../util/constants';
import { EventInput, getAssetData, respond } from '../../util/util';

exports.handler = async (event: EventInput) => {
	if (event.source === 'serverless-plugin-warmup') {
		return respond(200);
	}

	const asset = event.pathParameters!.settName;
	const count = event.queryStringParameters ? Number(event.queryStringParameters.count) : null;
	const data = await getAssetData(ASSET_DATA, asset, count);
	if (!data) return respond(500);

	const points = data.map((item) => ({ x: item.timestamp, y: item.value }));

	return respond(200, points);
};
