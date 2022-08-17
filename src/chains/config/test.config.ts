import { GasPrices, Network, SDKProvider } from '@badger-dao/sdk';
import mockTokensMap from '@badger-dao/sdk-mocks/generated/ethereum/api/loadTokens.json';

import { TokenConfig } from '../../tokens/interfaces/token-config.interface';
import { TestStrategy } from '../strategies/test.strategy';
import { Chain } from './chain.config';

export class TestEthereum extends Chain {
  constructor(provider: SDKProvider, network = Network.Ethereum) {
    super(
      network,
      mockTokensMap as TokenConfig,
      provider,
      new TestStrategy(),
      '0x31825c0a6278b89338970e3eb979b05b27faa263',
    );
    Chain.register(this.network, this);
  }

  async getGasPrices(): Promise<GasPrices> {
    return {
      rapid: { maxFeePerGas: 223.06, maxPriorityFeePerGas: 3.04 },
      fast: { maxFeePerGas: 221.96, maxPriorityFeePerGas: 1.94 },
      standard: { maxFeePerGas: 221.91, maxPriorityFeePerGas: 1.89 },
      slow: { maxFeePerGas: 221.81, maxPriorityFeePerGas: 1.79 },
    };
  }
}
