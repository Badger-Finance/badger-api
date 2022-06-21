import { Network } from '@badger-dao/sdk';

import { SUPPORTED_CHAINS } from '../../chains/chain';
import { STAGE } from '../../config/constants';
import { Stage } from '../../config/enums/stage.enum';

const citadelChains = new Set([Network.Ethereum]);

const chains = SUPPORTED_CHAINS.filter((c) => citadelChains.has(c.network));
const tokens = new Set(chains.flatMap((c) => Object.keys(c.tokens)));
const vaults = new Set(chains.flatMap((c) => c.vaults.map((v) => v.vaultToken)));
vaults.forEach((v) => tokens.delete(v));

export const TRACKED_TOKENS = [...tokens];
export const TRACKED_VAULTS = [...vaults];

export const CITADEL_TREASURY_ADDRESS =
  STAGE === Stage.Staging ? '0x38724146C8dc1Aa49c3395091cf86B789c37F52c' : '0xb7Bf6c956da0f013BC59ecDB0748f73d0473cd3a';
