import { Geyser } from './Geyser';
import { TokenBalance } from './TokenBalance';
import { ValueSource } from './ValueSource';

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
