import { setts } from '../setts';
import { EventInput, getGeysers, getPrices, getUsdValue, respond } from '../util/util';

const formatFloat = (value: string) => parseFloat(parseFloat(value).toFixed(2));

export const handler = async (event: EventInput) => {
	const includeToken = event.queryStringParameters ? event.queryStringParameters.tokens : false;
	const assetValues = {} as Record<string, unknown>;

	const data = await Promise.all([getPrices(), getGeysers()]);
	const prices = data[0];
	const geyserData = data[1];
	const settData = geyserData.data.setts;

	let totalValue = 0;
	for (const key of Object.keys(setts)) {
		const asset = setts[key].asset.toLowerCase();
		const tokenValueKey = asset + 'Tokens';
		const settInfo = settData.find((s) => s.id === key);
		if (!settInfo) {
			assetValues[asset] = 0;
			if (includeToken) {
				assetValues[tokenValueKey] = 0;
			}
			continue;
		}
		let tokens;
		if (asset === 'digg') {
			tokens = settInfo.balance / 1e9;
		} else {
			tokens = settInfo.balance / 1e18;
		}
		const value = formatFloat(getUsdValue(settInfo.token.id, tokens, prices).toString());
		assetValues[asset] = value;
		if (includeToken) {
			assetValues[tokenValueKey] = tokens;
		}
		totalValue += value;
	}
	assetValues.totalValue = totalValue;

	return respond(200, assetValues);
};
