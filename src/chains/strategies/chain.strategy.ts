import { ChainType } from '../enums/chain-type.enum';

type Strategies = { [key in ChainType]: ChainStrategy }

export interface ChainStrategy {

}

export abstract class ChainStrategy {
  private static strategies: Strategies = {} as Strategies;

  static register(types: ChainType[], strategy: ChainStrategy): void {
    for (const type of types) {
      ChainStrategy.strategies[type] = strategy;
    }
  }
}
