import { EventInput, getUniswapPrice } from '../../config/util';
import { SettFragment } from '../../graphql/generated/badger';
import { indexAsset } from '../indexer';

export const handler = async (event: EventInput) => {
	const getPrice = async (settFragment: SettFragment) => await getUniswapPrice(settFragment.token.id);
	return await indexAsset(event, getPrice);
};
