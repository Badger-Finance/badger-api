import { Erc20__factory, formatBalance } from '@badger-dao/sdk';
import { ethers } from 'ethers';

import { VaultTokenBalance } from '../../aws/models/vault-token-balance.model';
import { Chain } from '../../chains/config/chain.config';
import { BalancerVault__factory, WeightedPool__factory } from '../../contracts';
import { TokenPrice } from '../../prices/interface/token-price.interface';
import { CachedTokenBalance } from '../../tokens/interfaces/cached-token-balance.interface';
import { getFullToken, toBalance } from '../../tokens/tokens.utils';
import { getCachedVault, getVaultDefinition } from '../../vaults/vaults.utils';

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
