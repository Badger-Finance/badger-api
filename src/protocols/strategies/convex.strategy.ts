import { Erc20__factory, formatBalance, Network, Token } from '@badger-dao/sdk';
import { ethers } from 'ethers';

import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { VaultTokenBalance } from '../../aws/models/vault-token-balance.model';
import { YieldSource } from '../../aws/models/yield-source.model';
import { Chain } from '../../chains/config/chain.config';
import { request } from '../../common/request';
import { ContractRegistry } from '../../config/interfaces/contract-registry.interface';
import { TOKENS } from '../../config/tokens.config';
import {
  CurveBaseRegistry__factory,
  CurvePool__factory,
  CurvePool3__factory,
  CurveRegistry__factory,
} from '../../contracts';
import { TokenPrice } from '../../prices/interface/token-price.interface';
import { queryPrice } from '../../prices/prices.utils';
import { SourceType } from '../../rewards/enums/source-type.enum';
import { CachedTokenBalance } from '../../tokens/interfaces/cached-token-balance.interface';
import { getFullToken, getVaultTokens, toBalance } from '../../tokens/tokens.utils';
import { getCachedVault, queryYieldSources } from '../../vaults/vaults.utils';
import { createYieldSource } from '../../vaults/yields.utils';
import { CurveAPIResponse } from '../interfaces/curve-api-response.interrface';

/* Protocol Constants */
export const CURVE_API_URL = 'https://stats.curve.fi/raw-stats/apys.json';
export const CURVE_CRYPTO_API_URL = 'https://stats.curve.fi/raw-stats-crypto/apys.json';
export const CURVE_MATIC_API_URL = 'https://stats.curve.fi/raw-stats-polygon/apys.json';
export const CURVE_ARBITRUM_API_URL = 'https://stats.curve.fi/raw-stats-arbitrum/apys.json';
export const CURVE_FACTORY_APY = 'https://api.curve.fi/api/getFactoryAPYs';

/* Protocol Contracts */
export const CURVE_BASE_REGISTRY = '0x0000000022D53366457F9d5E68Ec105046FC4383';
export const HARVEST_FORWARDER = '0xA84B663837D94ec41B0f99903f37e1d69af9Ed3E';
export const BRIBES_PROCESSOR = '0xb2Bf1d48F2C2132913278672e6924efda3385de2';
export const OLD_BRIBES_PROCESSOR = '0xbeD8f323456578981952e33bBfbE80D23289246B';

/* Protocol Definitions */
const curvePoolApr: Record<string, string> = {
  [TOKENS.CRV_RENBTC]: 'ren2',
  [TOKENS.CRV_SBTC]: 'rens',
  [TOKENS.CRV_TBTC]: 'tbtc',
  [TOKENS.CRV_HBTC]: 'hbtc',
  [TOKENS.CRV_PBTC]: 'pbtc',
  [TOKENS.CRV_OBTC]: 'obtc',
  [TOKENS.CRV_BBTC]: 'bbtc',
  [TOKENS.CRV_TRICRYPTO]: 'tricrypto',
  [TOKENS.CRV_TRICRYPTO2]: 'tricrypto2',
  [TOKENS.MATIC_CRV_TRICRYPTO]: 'atricrypto',
  [TOKENS.MATIC_CRV_AMWBTC]: 'ren',
  [TOKENS.ARB_CRV_TRICRYPTO]: 'tricrypto',
  [TOKENS.ARB_CRV_RENBTC]: 'ren',
};

const nonRegistryPools: ContractRegistry = {
  [TOKENS.MATIC_CRV_TRICRYPTO]: '0x751B1e21756bDbc307CBcC5085c042a0e9AaEf36',
  [TOKENS.ARB_CRV_TRICRYPTO]: '0x960ea3e3C7FB317332d990873d354E18d7645590',
  [TOKENS.CRV_TRICRYPTO2]: '0xD51a44d3FaE010294C616388b506AcdA1bfAAE46',
  [TOKENS.CRV_BADGER]: '0x50f3752289e1456BfA505afd37B241bca23e685d',
  [TOKENS.CTDL]: TOKENS.CRV_CTDL,
  [TOKENS.CVXFXS]: '0xd658A338613198204DCa1143Ac3F01A722b5d94A',
};

interface FactoryAPYResonse {
  data: {
    poolDetails: {
      apy: number;
      poolAddress: string;
    }[];
  };
}

export class ConvexStrategy {
  static async getValueSources(chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<YieldSource[]> {
    switch (vaultDefinition.address) {
      case TOKENS.BVECVX:
        return [];
      case TOKENS.BCRV_CVXBVECVX:
        return getLiquiditySources(chain, vaultDefinition);
      default:
        return Promise.all([getCurvePerformance(chain, vaultDefinition)]);
    }
  }
}

async function getLiquiditySources(chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<YieldSource[]> {
  const bveCVXVault = await chain.vaults.getVault(TOKENS.BVECVX);
  const [bveCVXLP, bveCVXSources] = await Promise.all([
    getCachedVault(chain, vaultDefinition),
    queryYieldSources(bveCVXVault),
  ]);
  const vaultTokens = await getVaultTokens(chain, bveCVXLP);
  const bveCVXValue = vaultTokens
    .filter((t) => t.address === TOKENS.BVECVX)
    .map((t) => t.value)
    .reduce((total, val) => (total += val), 0);
  const scalar = bveCVXValue / bveCVXLP.value;
  const lpSources = bveCVXSources.map((s) => {
    const { apr, minApr, maxApr, name, type } = s;
    const scaledApr = apr * scalar;
    const min = apr > 0 ? minApr / apr : 0;
    const max = apr > 0 ? maxApr / apr : 0;
    return createYieldSource(vaultDefinition, type, name, scaledApr, { min, max });
  });
  const cachedTradeFees = await getCurvePerformance(chain, vaultDefinition);
  return [cachedTradeFees, ...lpSources];
}

export async function getCurvePerformance(chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<YieldSource> {
  let defaultUrl;
  switch (chain.network) {
    case Network.Polygon:
      defaultUrl = CURVE_MATIC_API_URL;
      break;
    case Network.Arbitrum:
      defaultUrl = CURVE_ARBITRUM_API_URL;
      break;
    default:
      defaultUrl = CURVE_API_URL;
  }
  let curveData = await request<CurveAPIResponse>(defaultUrl);
  const assetKey = vaultDefinition.depositToken;
  const missingEntry = () => !curveData.apy.week[curvePoolApr[assetKey]];

  // try the secondary apy options, if not avilable give up
  if (missingEntry()) {
    curveData = await request<CurveAPIResponse>(CURVE_CRYPTO_API_URL);
  }

  let tradeFeePerformance = 0;

  async function updateFactoryApy(version: string) {
    if (!missingEntry()) {
      tradeFeePerformance = curveData.apy.week[curvePoolApr[assetKey]] * 100;
    } else {
      const factoryAPY = await request<FactoryAPYResonse>(CURVE_FACTORY_APY, { version });
      const poolDetails = factoryAPY.data.poolDetails.find(
        (pool) => ethers.utils.getAddress(pool.poolAddress) === vaultDefinition.depositToken,
      );
      if (poolDetails) {
        tradeFeePerformance = poolDetails.apy;
      }
    }
  }

  await updateFactoryApy('2');
  if (tradeFeePerformance === 0) {
    await updateFactoryApy('crypto');
  }

  return createYieldSource(vaultDefinition, SourceType.TradeFee, 'Curve LP Fees', tradeFeePerformance);
}

export async function getCurveTokenPrice(chain: Chain, depositToken: string): Promise<TokenPrice> {
  const deposit = await getFullToken(chain, depositToken);
  const poolBalance = await getCurvePoolBalance(chain, depositToken);
  const token = Erc20__factory.connect(depositToken, chain.provider);
  const value = poolBalance.reduce((total, balance) => (total += balance.value), 0);
  const totalSupply = await token.totalSupply();
  const supply = formatBalance(totalSupply, deposit.decimals);
  const price = value / supply;
  return {
    address: deposit.address,
    price,
  };
}

export async function getCurvePoolBalance(chain: Chain, depositToken: string): Promise<CachedTokenBalance[]> {
  const baseRegistry = CurveBaseRegistry__factory.connect(CURVE_BASE_REGISTRY, chain.provider);
  const cachedBalances = [];
  const registryAddr = await baseRegistry.get_registry();
  let poolAddress;
  if (registryAddr !== ethers.constants.AddressZero) {
    const registry = CurveRegistry__factory.connect(registryAddr, chain.provider);
    poolAddress = await registry.get_pool_from_lp_token(depositToken);
  }
  // meta pools not in registry and no linkage - use a manually defined lookup
  if (!poolAddress || poolAddress === ethers.constants.AddressZero) {
    poolAddress = nonRegistryPools[depositToken] ?? depositToken;
  }
  const poolContracts = [
    CurvePool3__factory.connect(poolAddress, chain.provider),
    CurvePool__factory.connect(poolAddress, chain.provider),
  ];
  let option = 0;
  let coin = 0;
  while (true) {
    try {
      const pool = poolContracts[option];
      const tokenAddress = await pool.coins(coin);
      const token = await getFullToken(chain, ethers.utils.getAddress(tokenAddress));

      const balance = formatBalance(await pool.balances(coin), token.decimals);
      cachedBalances.push(await toBalance(token, balance));
      coin++;
    } catch (err) {
      if (coin > 0) {
        break;
      }
      option++;
      if (option >= poolContracts.length) {
        break;
      }
    }
  }

  return cachedBalances;
}

export async function getCurveVaultTokenBalance(
  chain: Chain,
  vaultDefinition: VaultDefinitionModel,
): Promise<VaultTokenBalance> {
  const { depositToken, address } = vaultDefinition;
  const cachedTokens = await getCurvePoolBalance(chain, depositToken);
  const contract = Erc20__factory.connect(depositToken, chain.provider);
  const vault = await getCachedVault(chain, vaultDefinition);
  const totalSupply = parseFloat(ethers.utils.formatEther(await contract.totalSupply()));
  const scalar = vault.balance / totalSupply;
  cachedTokens.forEach((cachedToken) => {
    cachedToken.balance *= scalar;
    cachedToken.value *= scalar;
  });
  return Object.assign(new VaultTokenBalance(), {
    vault: address,
    tokenBalances: cachedTokens,
  });
}

// this should really only be used on 50:50 curve v2 crypto pools
export async function resolveCurvePoolTokenPrice(chain: Chain, token: Token): Promise<TokenPrice> {
  const balances = await getCurvePoolBalance(chain, nonRegistryPools[token.address]);
  if (balances.length != 2) {
    throw new Error('Pool has unexpected number of tokens!');
  }
  const requestTokenIndex = balances[0].address === token.address ? 0 : 1;
  const requestToken = balances[requestTokenIndex];
  const pairToken = balances[1 - requestTokenIndex];
  const requestTokenPrice = pairToken.value / requestToken.balance;
  return {
    address: token.address,
    price: requestTokenPrice,
  };
}

export async function resolveCurveStablePoolTokenPrice(chain: Chain, token: Token): Promise<TokenPrice> {
  // TODO: figure out how to get this from the registry or crypto registry (?) properly
  const pool = nonRegistryPools[token.address];
  const balances = await getCurvePoolBalance(chain, pool);
  const sdk = await chain.getSdk();

  try {
    if (balances.length != 2) {
      throw new Error('Pool has unexpected number of tokens!');
    }

    // we can calculate "x" in terms of "y" - this is our token in terms of some known token
    const swapPool = CurvePool3__factory.connect(pool, sdk.provider);

    const requestTokenIndex = balances[0].address === token.address ? 0 : 1;
    const pairToken = balances[1 - requestTokenIndex];

    // token 0 in terms of token 1
    const tokenOutRatio = formatBalance(await swapPool.price_oracle());
    const scalar = requestTokenIndex === 0 ? 1 / tokenOutRatio : tokenOutRatio;
    const { price } = await queryPrice(pairToken.address);
    const requestTokenPrice = scalar * price;

    return {
      address: token.address,
      price: requestTokenPrice,
    };
  } catch (err) {
    console.error({ err, message: `Unable to price ${token.name}` });
  }

  return {
    address: token.address,
    price: 0,
  };
}
