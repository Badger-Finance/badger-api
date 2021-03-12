import { EventInput } from '../../config/util';
import { SettFragment } from '../../graphql/generated/badger';
import { TokenPrice } from '../../interface/TokenPrice';
import { getTokenPrice } from '../../prices/PricesService';
import { indexAsset } from '../indexer';

export const handler = async (event: EventInput) => {
	const getPrice = async (_settFragment: SettFragment): Promise<TokenPrice> => getTokenPrice('bitcoin');
	return await indexAsset(event, getPrice);
};
