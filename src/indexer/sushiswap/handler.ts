import { EventInput, getSushiswapPrice } from '../../config/util';
import { SettFragment } from '../../graphql/generated/badger';
import { indexAsset } from '../indexer';

export const handler = async (event: EventInput) => {
	const getPrice = async (settFragment: SettFragment) => await getSushiswapPrice(settFragment.token.id);
	return await indexAsset(event, getPrice);
};
