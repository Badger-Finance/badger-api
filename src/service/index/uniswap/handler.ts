import { EventInput, getUniswapPrice, SettData } from '../../util/util';
import { indexAsset } from '../indexer';

exports.handler = async (event: EventInput) => {
	const getPrice = async (settData: SettData) => await getUniswapPrice(settData.data.sett.token.id);
	return await indexAsset(event, getPrice);
};
