import { Network, SDKProvider } from '@badger-dao/sdk';

import { BaseStrategy } from '../strategies/base.strategy';
import { Chain } from './chain.config';
// import mockTokensMap from '@badger-dao/sdk-mocks/generated/ethereum/api/loadTokens.json';
// import { TokenConfig } from '../../tokens/interfaces/token-config.interface';

export class TestEthereum extends Chain {
  constructor(provider: SDKProvider) {
    super(
      Network.Ethereum,
      {},
      provider,
      new BaseStrategy(Network.Ethereum, Object.keys({})),
      '0x31825c0a6278b89338970e3eb979b05b27faa263',
    );
    Chain.register(this.network, this);
  }
}
