import { Network } from '@badger-dao/sdk';
import { BaseStrategy } from './base.strategy';

export class xDaiStrategy extends BaseStrategy {
  constructor(tokens: string[]) {
    super(Network.xDai, tokens);
  }
}
