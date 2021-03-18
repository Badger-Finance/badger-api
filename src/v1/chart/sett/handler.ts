import { ASSET_DATA } from '../../util/constants';
import { EventInput, getAssetData, respond } from '../../util/util';

export const handler = async (event: EventInput) => {
  const asset = event.pathParameters!.settName;
  if (!asset) return respond(400, { statusCode: 400, message: 'settName is a required path parameter' });
  const count = event.queryStringParameters ? Number(event.queryStringParameters.count) : null;
  const data = await getAssetData(ASSET_DATA, asset, count);
  if (!data) return respond(500);

  const points = data.map((item) => ({ x: item.timestamp, y: item.value }));
  return respond(200, points);
};
