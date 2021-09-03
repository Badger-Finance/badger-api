import { BADGER_ARBITRUM_URL } from '../../config/constants';
import rpc from '../../config/rpc.config';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { arbitrumTokensConfig } from '../../tokens/config/arbitrum-tokens.config';
import { ChainNetwork } from '../enums/chain-network.enum';
import { ArbitrumStrategy } from '../strategies/arbitrum.strategy';
import { Chain } from './chain.config';

export class Arbitrum extends Chain {
  constructor() {
    super(
      'Arbitrum',
      'arbitrum',
      '0xa4b1',
      ChainNetwork.Arbitrum,
      arbitrumTokensConfig,
      arbitrumSetts,
      rpc[ChainNetwork.Arbitrum],
      new ArbitrumStrategy(Object.keys(arbitrumTokensConfig)),
      BADGER_ARBITRUM_URL,
      // TODO: handle proper arbitrum blocks - this is matic
      15768000,
      '0x663EfC293ca8d8DD6355AE6E99b71352BED9E895',
      '0x599D92B453C010b1050d31C364f6ee17E819f193',
    );
    Chain.register(this.network, this);
  }
}

export const arbitrumSetts: SettDefinition[] = [];
