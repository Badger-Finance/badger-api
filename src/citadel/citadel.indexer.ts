import { formatBalance } from '@badger-dao/sdk';
import { Ethereum } from '../chains/config/eth.config';
import { TRACKED_TOKENS, TRACKED_VAULTS } from './config/citadel-treasury.config';
import { TreasuryPosition } from './interfaces/treasy-position.interface';

export async function snapshotTreasury() {
  const chain = new Ethereum();
  const sdk = await chain.getSdk();

  const lookupTokens = TRACKED_TOKENS.concat(TRACKED_VAULTS);
  const tokenBalances = await sdk.tokens.loadBalances(lookupTokens);
  const tokenInformation = await sdk.tokens.loadTokens(lookupTokens);

  const vaultPositions = new Set(TRACKED_VAULTS);
  const treasuryPositions: TreasuryPosition[] = Object.entries(tokenBalances).map((e) => {
    const [token, balance] = e;
    const isFarming = vaultPositions.has(token);
    const tokenInfo = tokenInformation[token];
    if (!isFarming) {
      return {
        token: tokenInfo,
        amount: formatBalance(balance, tokenInfo.decimals),
        value: 0,
        apr: 0,
      };
    }
    return {
      token: tokenInfo,
      amount: formatBalance(balance, tokenInfo.decimals),
      value: 0,
      apr: 0,
    };
  });
}
