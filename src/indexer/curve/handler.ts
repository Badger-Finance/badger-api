import { EventInput, getContractPrice, getTokenPrice, SettData } from '../../util/util';

import { indexAsset } from '../indexer';

export const handler = async (event: EventInput) => {
	const getPrice = async (settData: SettData) => {
		const price = await getContractPrice(settData.data.sett.token.id);
		if (price) {
			return price;
		}
		return await getTokenPrice('bitcoin');
	};
	return await indexAsset(event, getPrice);
};
