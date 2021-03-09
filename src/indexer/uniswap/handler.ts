import { EventInput, getUniswapPrice, SettData } from '../../config/util';
import { indexAsset } from '../indexer';

export const handler = async (event: EventInput) => {
	const getPrice = async (settData: SettData) => await getUniswapPrice(settData.data.sett.token.id);
	return await indexAsset(event, getPrice);
};
