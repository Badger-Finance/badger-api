import { Erc20__factory, formatBalance, Token } from '@badger-dao/sdk';
import { ethers } from 'ethers';

import { VaultTokenBalance } from '../../aws/models/vault-token-balance.model';
import { Chain } from '../../chains/config/chain.config';
import { BalancerVault__factory, StablePool__factory, WeightedPool__factory } from '../../contracts';
import { TokenPrice } from '../../prices/interface/token-price.interface';
import { CachedTokenBalance } from '../../tokens/interfaces/cached-token-balance.interface';
import { getFullToken, toBalance } from '../../tokens/tokens.utils';
import { getCachedVault, getVaultDefinition } from '../../vaults/vaults.utils';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

export async function getBPTPrice(chain: Chain, token: string): Promise<TokenPrice> {
  const sdk = await chain.getSdk();
  const pool = WeightedPool__factory.connect(token, sdk.provider);
  const totalSupply = await pool.totalSupply();
  const tokens = await getBalancerPoolTokens(chain, token);
  const price = tokens.map((t) => t.value).reduce((total, value) => (total += value), 0);
  return {
    address: token,
    price: price / formatBalance(totalSupply),
  };
}

export async function getBalancerPoolTokens(chain: Chain, token: string): Promise<CachedTokenBalance[]> {
  const sdk = await chain.getSdk();
  const pool = WeightedPool__factory.connect(token, sdk.provider);
  const [vault, poolId] = await Promise.all([pool.getVault(), pool.getPoolId()]);
  const vaultContract = BalancerVault__factory.connect(vault, sdk.provider);
  const poolTokens = await vaultContract.getPoolTokens(poolId);

  const tokens: CachedTokenBalance[] = [];

  for (let i = 0; i < poolTokens.balances.length; i++) {
    const token = await getFullToken(chain, poolTokens.tokens[i]);
    const balance = formatBalance(poolTokens.balances[i], token.decimals);
    const tokenBalance = await toBalance(token, balance);
    tokens.push(tokenBalance);
  }

  return tokens;
}

export async function getBalancerVaultTokenBalance(chain: Chain, token: string): Promise<VaultTokenBalance> {
  const vaultDefinition = getVaultDefinition(chain, token);
  const { depositToken, vaultToken } = vaultDefinition;
  const cachedTokens = await getBalancerPoolTokens(chain, depositToken);
  const contract = Erc20__factory.connect(depositToken, chain.provider);
  const sett = await getCachedVault(chain, vaultDefinition);
  const totalSupply = parseFloat(ethers.utils.formatEther(await contract.totalSupply()));
  const scalar = sett.balance / totalSupply;
  cachedTokens.forEach((cachedToken) => {
    cachedToken.balance *= scalar;
    cachedToken.value *= scalar;
  });
  const vaultTokenBalance = {
    vault: vaultToken,
    tokenBalances: cachedTokens,
  };
  return Object.assign(new VaultTokenBalance(), vaultTokenBalance);
}

export async function resolveBalancerPoolTokenPrice(chain: Chain, token: Token, pool?: string): Promise<TokenPrice> {
  const balances = await getBalancerPoolTokens(chain, pool!);
  const sdk = await chain.getSdk();

  const maybeWeightedPool = WeightedPool__factory.connect(pool!, sdk.provider);
  try {
    const weights = await maybeWeightedPool.getNormalizedWeights();
    const targetIndex = balances.findIndex((b) => b.address === token.address);

    if (targetIndex < 0) {
      throw new Error(`${token.name} not found in target BPT (${pool})`);
    }

    const targetBalance = balances[targetIndex];
    const expectedWeight = formatBalance(weights[targetIndex]);
    const totalOtherValue = balances
      .filter((b) => b.address !== token.address)
      .reduce((total, balance) => (total += balance.value), 0);
    const multiplier = expectedWeight / (1 - expectedWeight);
    const tokenPrice = (totalOtherValue * multiplier) / targetBalance.balance;

    return {
      address: token.address,
      price: tokenPrice,
    };
  } catch {
    // Attempt instead, to evaluate as a stable pool
    // We will assume stable pools, by nature, to have two assets - presuambly pegged

    try {
      if (balances.length != 2) {
        throw new Error('Pool has unexpected number of tokens!');
      }

      // we can calculate "x" in terms of "y" - this is our token in terms of some known token
      const probablyStablePool = StablePool__factory.connect(pool!, sdk.provider);

      // derivation adapted from https://twitter.com/0xa9a/status/1514192791689179137
      const [amplificationParameter, lastInvariantData] = await Promise.all([
        probablyStablePool.getAmplificationParameter(),
        probablyStablePool.getLastInvariant(),
      ]);

      const requestTokenIndex = balances[0].address === token.address ? 0 : 1;
      const requestToken = balances[requestTokenIndex];
      const pairToken = balances[1 - requestTokenIndex];

      const amplificiation =
        4 * (amplificationParameter.value.toNumber() / amplificationParameter.precision.toNumber());
      const invariant = formatBalance(lastInvariantData.lastInvariant);

      // calculate scalar y/x
      const scalar = pairToken.balance / requestToken.balance;
      const divisor = Math.pow(invariant, 3);

      // calculate numerator
      const numeratorTop = 2 * amplificiation * Math.pow(requestToken.balance, 2) * pairToken.balance;
      const numerator = 1 + numeratorTop / divisor;

      // calculate denominator
      const denominatorTop = 2 * amplificiation * Math.pow(pairToken.balance, 2) * requestToken.balance;
      const denominator = 1 + denominatorTop / divisor;

      const resultScalar = scalar * (numerator / denominator);
      const requestTokenPrice = resultScalar * (pairToken.value / pairToken.balance);

      return {
        address: token.address,
        price: requestTokenPrice,
      };
    } catch (err) {
      console.error({ err, message: `Unable to price ${token.name}` });
    }
  }

  return {
    address: token.address,
    price: 0,
  };
}
