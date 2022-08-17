import { IS_TEST } from '../config/constants';
import { setupMockChain } from '../test/mocks.utils';
import { Arbitrum } from './config/arbitrum.config';
import { BinanceSmartChain } from './config/bsc.config';
import { Ethereum } from './config/eth.config';
import { Fantom } from './config/fantom.config';
import { Optimism } from './config/optimism.config';
import { Polygon } from './config/polygon.config';

export const SUPPORTED_CHAINS = IS_TEST
  ? [setupMockChain()]
  : [new Ethereum(), new BinanceSmartChain(), new Polygon(), new Arbitrum(), new Fantom(), new Optimism()];
