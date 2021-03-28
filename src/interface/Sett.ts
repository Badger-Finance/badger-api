import { Protocol } from '../config/constants';
import { ValueSource } from '../protocols/interfaces/value-source.interface';
import { Geyser } from './Geyser';
import { TokenBalance } from './TokenBalance';

/**
 * Sett and geyser objects will be represented by the same
 * interface. The key difference between a sett and geyser
 * is the value sources which populate the entity. Geyser will
 * have emissions value sources while setts only have the
 * native underlying value source.
 */
export interface Sett extends SettSummary {
  ppfs: number;
  apy: number;
  vaultToken: string;
  underlyingToken: string;
  sources: ValueSource[];
  geyser?: Geyser;
}

export interface SettSummary {
  name: string;
  asset: string;
  value: number;
  tokens: TokenBalance[];
}

export interface SettDefinition {
  name: string;
  symbol: string;
  depositToken: string;
  settToken: string;
  geyserAddress?: string;
  protocol?: Protocol;
}
