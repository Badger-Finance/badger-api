import { EventInput, SettData } from '../../config/util';
import { TokenPrice } from '../../interface/TokenPrice';
import { getTokenPrice } from '../../prices/PricesService';
import { indexAsset } from '../indexer';

export const handler = async (event: EventInput) => {
	const getPrice = async (_settData: SettData): Promise<TokenPrice> => getTokenPrice('bitcoin');
	return await indexAsset(event, getPrice);
};
