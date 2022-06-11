import {
  chunkQueryFilter,
  Erc20__factory,
  evaluateEvents,
  formatBalance,
  Network,
  Token,
  HarvestDistributor,
  HarvestDistributor__factory,
  BribesProcessor__factory,
  BribesProcessor,
  parseHarvestEvents,
  VaultHarvestData,
} from '@badger-dao/sdk';
import { UnprocessableEntity } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { Chain } from '../../chains/config/chain.config';
import { ContractRegistry } from '../../config/interfaces/contract-registry.interface';
import { TOKENS } from '../../config/tokens.config';
import {
  CurveBaseRegistry__factory,
  CurvePool__factory,
  CurvePool3__factory,
  CurveRegistry__factory,
} from '../../contracts';
import { SourceType } from '../../rewards/enums/source-type.enum';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import {
  estimateVaultPerformance,
  getCachedVault,
  getVaultCachedValueSources,
  getVaultDefinition,
} from '../../vaults/vaults.utils';
import { VaultTokenBalance } from '../../aws/models/vault-token-balance.model';
import { CachedTokenBalance } from '../../tokens/interfaces/cached-token-balance.interface';
import { getFullToken, getVaultTokens, toBalance } from '../../tokens/tokens.utils';
import { CachedValueSource } from '../../aws/models/apy-snapshots.model';
import { createValueSource } from '../interfaces/value-source.interface';
import { request } from '../../common/request';
import { CurveAPIResponse } from '../interfaces/curve-api-response.interrface';
import { valueSourceToCachedValueSource } from '../../rewards/rewards.utils';
import { TokenPrice } from '../../prices/interface/token-price.interface';
import { ONE_DAY_SECONDS } from '../../config/constants';
import { TreeDistributionEvent, TreeDistributionEventFilter } from '@badger-dao/sdk/lib/contracts/HarvestDistributor';
import {
  TreeDistributionEvent as BribeProcessorTreeDistributionEvent,
  TreeDistributionEventFilter as BribeProcessorTreeDistributionEventFilter,
} from '@badger-dao/sdk/lib/contracts/BribesProcessor';

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
  static async getValueSources(chain: Chain, vaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
    switch (vaultDefinition.vaultToken) {
      case TOKENS.BVECVX:
        return retrieveHarvestForwarderData(chain, vaultDefinition);
      case TOKENS.BCRV_CVXBVECVX:
        return getLiquiditySources(chain, vaultDefinition);
      default:
        return Promise.all([getCurvePerformance(chain, vaultDefinition)]);
    }
  }
}

async function getLiquiditySources(chain: Chain, vaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
  const bveCVXVault = getVaultDefinition(chain, TOKENS.BVECVX);
  const [bveCVXLP, bveCVX, bveCVXSources] = await Promise.all([
    getCachedVault(chain, vaultDefinition),
    getCachedVault(chain, bveCVXVault),
    getVaultCachedValueSources(bveCVXVault),
  ]);
  const vaultTokens = await getVaultTokens(chain, bveCVXLP, bveCVXLP.balance);
  const bveCVXValue = vaultTokens
    .filter((t) => t.address === TOKENS.BVECVX)
    .map((t) => t.value)
    .reduce((total, val) => (total += val), 0);
  const scalar = bveCVXValue / bveCVXLP.value;
  const vaultToken = await getFullToken(chain, bveCVX.vaultToken);
  const lpSources = bveCVXSources.map((s) => {
    if (s.type === SourceType.Compound || s.type === SourceType.PreCompound) {
      s.name = `${vaultToken.name} ${s.name}`;
      const sourceTypeName = `${s.type === SourceType.Compound ? 'Derivative ' : ''}${vaultToken.name} ${s.type}`;
      s.addressValueSourceType = s.addressValueSourceType.replace(
        s.type,
        sourceTypeName.replace(/ /g, '_').toLowerCase(),
      );
    }
    // rewrite object keys to simulate sources from the lp vault
    s.addressValueSourceType = s.addressValueSourceType.replace(bveCVX.vaultToken, bveCVXLP.vaultToken);
    s.address = bveCVXLP.vaultToken;
    s.apr *= scalar;
    s.maxApr *= scalar;
    s.minApr *= scalar;
    return s;
  });
  const cachedTradeFees = await getCurvePerformance(chain, vaultDefinition);
  const forwardedDistributions = await retrieveHarvestForwarderData(chain, vaultDefinition);
  return [cachedTradeFees, ...lpSources, ...forwardedDistributions];
}

export async function getCurvePerformance(chain: Chain, vaultDefinition: VaultDefinition): Promise<CachedValueSource> {
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

  const valueSource = createValueSource('Curve LP Fees', tradeFeePerformance);
  return valueSourceToCachedValueSource(valueSource, vaultDefinition, SourceType.TradeFee);
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

export async function getCurveVaultTokenBalance(chain: Chain, token: string): Promise<VaultTokenBalance> {
  const vaultDefinition = getVaultDefinition(chain, token);
  const { protocol, depositToken, vaultToken } = vaultDefinition;
  if (!protocol) {
    throw new UnprocessableEntity('Cannot get curve vault token balances, requires a vault definition');
  }
  const cachedTokens = await getCurvePoolBalance(chain, depositToken);
  const contract = Erc20__factory.connect(depositToken, chain.provider);
  const sett = await getCachedVault(chain, vaultDefinition);
  const totalSupply = parseFloat(ethers.utils.formatEther(await contract.totalSupply()));
  const scalar = sett.balance / totalSupply;
  cachedTokens.forEach((cachedToken) => {
    cachedToken.balance *= scalar;
    cachedToken.value *= scalar;
  });
  return Object.assign(new VaultTokenBalance(), {
    vault: vaultToken,
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

async function retrieveHarvestForwarderData(chain: Chain, vault: VaultDefinition): Promise<CachedValueSource[]> {
  const sdk = await chain.getSdk();
  const harvestForwarder = HarvestDistributor__factory.connect(HARVEST_FORWARDER, sdk.provider);

  const treeDistributionFilter = harvestForwarder.filters.TreeDistribution();

  const endBlock = await sdk.provider.getBlockNumber();
  // cut off after 21 days in blocks, this is in seconds by 13 second blocks
  const startBlock = Math.floor(endBlock - (21 * ONE_DAY_SECONDS) / 13);
  const allTreeDistributions = await chunkQueryFilter<
    HarvestDistributor,
    TreeDistributionEventFilter,
    TreeDistributionEvent
  >(harvestForwarder, treeDistributionFilter, startBlock, endBlock);

  const distributions = allTreeDistributions
    .filter((d) => d.args.beneficiary === vault.vaultToken)
    .map((d) => ({
      timestamp: d.args.block_timestamp.toNumber(),
      block: d.args.block_number.toNumber(),
      token: d.args.token,
      amount: d.args.amount,
    }));

  // cut off after 21 days in seconds
  const timestampCutoff = Math.floor(Date.now() / 1000 - 21 * ONE_DAY_SECONDS);
  const { data } = await evaluateEvents([], distributions, { timestamp_gte: timestampCutoff });
  const previousData = await retrieveBribesProcessorData(chain, vault);
  const combinedData = previousData.concat(data);

  // cannot construct data with this - will be fine after the test emission
  if (combinedData.length <= 1) {
    return [];
  }

  return estimateVaultPerformance(chain, vault, combinedData);
}

async function retrieveBribesProcessorData(chain: Chain, vault: VaultDefinition): Promise<VaultHarvestData[]> {
  const sdk = await chain.getSdk();
  const bribeProcessor = BribesProcessor__factory.connect(BRIBES_PROCESSOR, sdk.provider);

  const treeDistributionFilter = bribeProcessor.filters.TreeDistribution();

  const endBlock = await sdk.provider.getBlockNumber();
  // cut off after 21 days in blocks, this is in seconds by 13 second blocks
  const startBlock = Math.floor(endBlock - (21 * ONE_DAY_SECONDS) / 13);
  const allTreeDistributions = await chunkQueryFilter<
    BribesProcessor,
    BribeProcessorTreeDistributionEventFilter,
    BribeProcessorTreeDistributionEvent
  >(bribeProcessor, treeDistributionFilter, startBlock, endBlock);

  const { harvests, distributions } = await parseHarvestEvents([], allTreeDistributions);

  // cut off after 21 days in seconds
  const timestampCutoff = Math.floor(Date.now() / 1000 - 21 * ONE_DAY_SECONDS);
  const { data } = await evaluateEvents(harvests, distributions, { timestamp_gte: timestampCutoff });

  return data;
}
