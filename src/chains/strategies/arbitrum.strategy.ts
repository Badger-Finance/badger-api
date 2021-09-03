import { ChainNetwork } from '../enums/chain-network.enum';
import { BaseStrategy } from './base.strategy';

export class ArbitrumStrategy extends BaseStrategy {
  constructor(tokens: string[]) {
    super(ChainNetwork.Arbitrum, tokens);
  }
}
