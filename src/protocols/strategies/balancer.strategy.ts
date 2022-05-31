import { formatBalance } from '@badger-dao/sdk';
import { Chain } from '../../chains/config/chain.config';
import { BalancerVault__factory, WeightedPool__factory } from '../../contracts';
import { TokenPrice } from '../../prices/interface/token-price.interface';
import { CachedTokenBalance } from '../../tokens/interfaces/cached-token-balance.interface';
import { getFullToken, toBalance } from '../../tokens/tokens.utils';

export async function getBPTPrice(chain: Chain, token: string): Promise<TokenPrice> {
  const sdk = await chain.getSdk();
  const pool = WeightedPool__factory.connect(token, sdk.provider);
  const totalSupply = await pool.totalSupply();
  const tokens = await getBPTokens(chain, token);
  const price = tokens.map((t) => t.value).reduce((total, value) => (total += value), 0);
  return {
    address: token,
    price: price / formatBalance(totalSupply),
  };
}

export async function getBPTokens(chain: Chain, token: string): Promise<CachedTokenBalance[]> {
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
