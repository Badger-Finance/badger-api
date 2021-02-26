import { EventInput, getSushiswapPrice, SettData } from '../../util/util';
import { indexAsset } from '../indexer';

export const handler = async (event: EventInput) => {
	const getPrice = async (settData: SettData) => await getSushiswapPrice(settData.data.sett.token.id);
	return await indexAsset(event, getPrice);
};
