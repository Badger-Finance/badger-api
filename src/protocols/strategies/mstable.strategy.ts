import { UnprocessableEntity } from '@tsed/exceptions';
import { Chain } from '../../chains/config/chain.config';
import { ONE_YEAR_MS, ONE_YEAR_SECONDS } from '../../config/constants';
import { TOKENS } from '../../config/tokens.config';
import { Mhbtc__factory } from '../../contracts';
import { Imbtc__factory } from '../../contracts/factories/Imbtc__factory';
import { MstableVault__factory } from '../../contracts/factories/MstableVault__factory';
import { valueSourceToCachedValueSource } from '../../indexers/indexer.utils';
import { getPrice } from '../../prices/prices.utils';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { Token } from '../../tokens/interfaces/token.interface';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { formatBalance, getToken } from '../../tokens/tokens.utils';
import { CachedValueSource } from '../interfaces/cached-value-source.interface';
import { uniformPerformance } from '../interfaces/performance.interface';
import { createValueSource } from '../interfaces/value-source.interface';
import { tokenEmission } from '../protocols.utils';
import { BigNumber } from 'ethers';

const MSTABLE_MBTC_VAULT = '0xF38522f63f40f9Dd81aBAfD2B8EFc2EC958a3016';
const MSTABLE_HMBTC_VAULT = '0xF65D53AA6e2E4A5f4F026e73cb3e22C22D75E35C';

export class mStableStrategy {
  static async getValueSources(chain: Chain, VaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
    switch (VaultDefinition.depositToken) {
      case TOKENS.MHBTC:
        return Promise.all([getVaultSource(chain, VaultDefinition, MSTABLE_HMBTC_VAULT)]);
      case TOKENS.IMBTC:
      default:
        return getImBtcValuceSource(chain, VaultDefinition);
    }
  }
}

export async function getImBtcPrice(chain: Chain, token: Token): Promise<TokenPrice> {
  const imbtc = Imbtc__factory.connect(token.address, chain.provider);
  const [exchangeRate, mbtcPrice] = await Promise.all([imbtc.exchangeRate(), getPrice(TOKENS.MBTC)]);
  const exchangeRateScalar = formatBalance(exchangeRate);
  return {
    name: token.name,
    address: token.address,
    usd: mbtcPrice.usd * exchangeRateScalar,
    eth: mbtcPrice.eth * exchangeRateScalar,
  };
}

export async function getMhBtcPrice(chain: Chain, token: Token): Promise<TokenPrice> {
  const mhbtc = Mhbtc__factory.connect(token.address, chain.provider);
  const [mbtcPrice, mhbtcPrice, totalSupply] = await Promise.all([
    getPrice(TOKENS.MBTC),
    mhbtc.getPrice(),
    mhbtc.totalSupply(),
  ]);
  const mbtcBalance = formatBalance(mhbtcPrice.k);
  const mhbtcBalance = formatBalance(totalSupply);
  const exchangeRateScalar = mbtcBalance / mhbtcBalance;
  return {
    name: token.name,
    address: token.address,
    usd: mbtcPrice.usd * exchangeRateScalar,
    eth: mbtcPrice.eth * exchangeRateScalar,
  };
}

async function getImBtcValuceSource(chain: Chain, VaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
  // getMAssetValueSource(VaultDefinition),
  return Promise.all([getVaultSource(chain, VaultDefinition, MSTABLE_MBTC_VAULT)]);
}

async function getVaultSource(
  chain: Chain,
  VaultDefinition: VaultDefinition,
  vaultAddress: string,
): Promise<CachedValueSource> {
  const vault = MstableVault__factory.connect(vaultAddress, chain.provider);
  if (!VaultDefinition.strategy) {
    throw new UnprocessableEntity(`${VaultDefinition.name} requires strategy`);
  }
  const { strategy } = VaultDefinition;
  const [balance, userData, depositTokenPrice, mtaPrice] = await Promise.all([
    vault.rawBalanceOf(strategy),
    vault.userData(strategy),
    getPrice(VaultDefinition.depositToken),
    getPrice(TOKENS.MTA),
  ]);
  const vaultBalance = formatBalance(balance);
  const now = Date.now();
  let valueSource = createValueSource('Vested MTA Rewards', uniformPerformance(0));
  const { rewardCount } = userData;
  const requests = [];
  for (let i = Math.max(rewardCount.toNumber() - 8, 0); i < rewardCount.toNumber(); i++) {
    requests.push(vault.userRewards(strategy, i));
  }
  const rewards = await Promise.all(requests);
  if (rewards.length > 0) {
    const cutoff = Number((now / 1000 - ONE_YEAR_SECONDS / 2).toFixed());
    const activeRewards = rewards
      .filter((r) => r.start.gte(cutoff))
      .sort((a, b) => b.start.toNumber() - a.start.toNumber());
    if (activeRewards.length > 0) {
      const totalRewards = activeRewards
        .map((r) => r.rate.mul(r.finish.sub(r.start)))
        .reduce((total, value) => total.add(value), BigNumber.from(0));
      const finalUnlock = activeRewards[0].start.toNumber() * 1000;
      const firstUnlock = activeRewards[activeRewards.length - 1].start.toNumber() * 1000;
      const scalar = ONE_YEAR_MS / (finalUnlock - firstUnlock);
      const rewardsValue = mtaPrice.usd * formatBalance(totalRewards);
      const vaultAssets = vaultBalance * depositTokenPrice.usd;
      const apr = ((rewardsValue * scalar) / vaultAssets) * 100;
      valueSource = createValueSource('Vested MTA Rewards', uniformPerformance(apr));
    }
  }
  return valueSourceToCachedValueSource(valueSource, VaultDefinition, tokenEmission(getToken(TOKENS.MTA)));
}
