import { UNISWAP_URL } from '../../config/constants';
import { EventInput } from '../../config/util';
import { SettFragment } from '../../graphql/generated/badger';
import { getLiquidityPrice } from '../../protocols/common/swap-util';
import { indexAsset } from '../indexer';

export const handler = async (event: EventInput) => {
  const getPrice = async (settFragment: SettFragment) => await getLiquidityPrice(UNISWAP_URL, settFragment.token.id);
  return await indexAsset(event, getPrice);
};
