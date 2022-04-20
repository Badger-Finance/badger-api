import { Network } from '@badger-dao/sdk';
import { loadChains } from '../../chains/chain';

const citadelChains = new Set([Network.Ethereum]);

const chains = loadChains().filter((c) => citadelChains.has(c.network));
const tokens = new Set(chains.flatMap((c) => Object.keys(c.tokens)));
const vaults = new Set(chains.flatMap((c) => c.vaults.map((v) => v.vaultToken)));
vaults.forEach((v) => tokens.delete(v));

export const TRACKED_TOKENS = [...tokens];
export const TRACKED_VAULTS = [...vaults];

export const CITADEL_TREASURY_ADDRESS = '';
