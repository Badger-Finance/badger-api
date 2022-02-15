import { Network, Protocol, VaultState } from '@badger-dao/sdk';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { bscTokensConfig } from '../../tokens/config/bsc-tokens.config';
import { Chain } from './chain.config';
import { BaseStrategy } from '../strategies/base.strategy';

export class BinanceSmartChain extends Chain {
  constructor() {
    super(
      'BinanceSmartChain',
      'bsc',
      '0x38',
      Network.BinanceSmartChain,
      bscTokensConfig,
      bscSetts,
      rpc[Network.BinanceSmartChain],
      new BaseStrategy(Network.BinanceSmartChain, Object.keys(bscTokensConfig)),
      10512000,
    );
    Chain.register(this.network, this);
  }

  async getGasPrices(): Promise<GasPrices> {
    return this.defaultGasPrice();
  }

  getBadgerTokenAddress(): string {
    return TOKENS.MULTI_BADGER;
  }
}

export const bscSetts: VaultDefinition[] = [
  {
    name: 'BNB/BTCB',
    createdBlock: 5516404,
    depositToken: TOKENS.PANCAKE_BNB_BTCB,
    vaultToken: TOKENS.BPANCAKE_BNB_BTCB,
    state: VaultState.Deprecated,
    protocol: Protocol.Pancakeswap,
  },
  {
    name: 'bBADGER/BTCB',
    createdBlock: 5712803,
    depositToken: TOKENS.PANCAKE_BBADGER_BTCB,
    vaultToken: TOKENS.BPANCAKE_BBADGER_BTCB,
    state: VaultState.Deprecated,
    protocol: Protocol.Pancakeswap,
  },
  {
    name: 'bDIGG/BTCB',
    createdBlock: 5712807,
    depositToken: TOKENS.PANCAKE_BDIGG_BTCB,
    vaultToken: TOKENS.BPANCAKE_BDIGG_BTCB,
    state: VaultState.Deprecated,
    protocol: Protocol.Pancakeswap,
  },
];
