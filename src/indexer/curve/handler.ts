import { TokenPrice } from '../../interface/TokenPrice';
import { getTokenPrice } from '../../prices/PricesService';
import { EventInput, SettData } from '../../util/util';
import { indexAsset } from '../indexer';

export const handler = async (event: EventInput) => {
	const getPrice = async (_settData: SettData): Promise<TokenPrice> => getTokenPrice('bitcoin');
	return await indexAsset(event, getPrice);
};
