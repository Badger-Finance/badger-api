import { EventInput, getTokenPrice } from '../../util/util';
import { indexAsset } from '../indexer';

export const handler = async (event: EventInput) => {
	const getPrice = async () => await getTokenPrice(event.token!);
	return await indexAsset(event, getPrice);
};
