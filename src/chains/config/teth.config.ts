import { Network, SDKProvider } from '@badger-dao/sdk';
import mockTokensMap from '@badger-dao/sdk-mocks/generated/ethereum/api/loadTokens.json';

import { TokenConfig } from '../../tokens/interfaces/token-config.interface';
import { TestStrategy } from '../strategies/test.strategy';
import { Chain } from './chain.config';

export class TestEthereum extends Chain {
  constructor(provider: SDKProvider) {
    super(
      Network.Ethereum,
      mockTokensMap as TokenConfig,
      provider,
      new TestStrategy(),
      '0x31825c0a6278b89338970e3eb979b05b27faa263',
    );
    Chain.register(this.network, this);
  }
}
