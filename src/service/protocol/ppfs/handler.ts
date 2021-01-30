import { getGeysers, respond } from '../../util/util';

export const handler = async () => {
	try {
		const ppfsData = {} as Record<string, number>;
		const settData = (await getGeysers()).data.setts;
		settData.forEach((s) => (ppfsData[s.id] = s.pricePerFullShare / 1e18));
		return respond(200, ppfsData);
	} catch (err) {
		return respond(500, {
			statusCode: 500,
			message: `Unable to fetch PPFS ${JSON.stringify(err)}`,
		});
	}
};
