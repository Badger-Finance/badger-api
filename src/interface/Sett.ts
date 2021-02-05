import { TokenBalance } from "./TokenBalance";
import { ValueSource } from "./ValueSource";
import { Geyser } from "./Geyser";

/**
 * Sett and geyser objects will be represented by the same
 * interface. The key difference between a sett and geyser
 * is the value sources which populate the entity. Geyser will
 * have emissions value sources while setts only have the
 * native underlying value source.
 */
export interface Sett {
  name: string,
  asset: string,
  ppfs: number,
  value: number,
  apy: number,
  tokens: TokenBalance[],
  sources: ValueSource[],
  geyser?: Geyser,
}

export interface SettSummary {
  name: string,
  asset: string,
  value: number,
  tokens: TokenBalance[],
}
