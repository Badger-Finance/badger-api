import { Description, Example, Property, Title } from '@tsed/schema';
import { TOKENS } from '../../config/tokens.config';
import { createValueSource, ValueSource } from '../../protocols/interfaces/value-source.interface';
import { BouncerType } from '../../rewards/enums/bouncer-type.enum';
import { mockBalance } from '../../tokens/tokens.utils';
import { VAULT_SOURCE } from '../vaults.utils';
import { VaultStrategy } from './vault-strategy.interface';
import { ethers } from 'ethers';
import {
  BoostConfig,
  Protocol,
  VaultState,
  VaultType,
  VaultBehavior,
  TokenValue,
  VaultDTO,
  VaultVersion,
} from '@badger-dao/sdk';
import { fullTokenMockMap } from '../../tokens/mocks/full-token.mock';
import { VaultYieldProjection } from '@badger-dao/sdk/lib/api/interfaces/vault-yield-projection.interface';

export class VaultModel implements VaultDTO {
  @Title('name')
  @Description('vault display name')
  @Example('Convex Tricrypto')
  @Property()
  public name: string;

  @Title('asset')
  @Description('vault underlying asset name')
  @Example('crvTricrypto')
  @Property()
  public asset: string;

  @Title('vaultAsset')
  @Description('Vault asset name')
  @Example('bcrvTricrypto')
  @Property()
  public vaultAsset: string;

  @Title('state')
  @Description('Launch state of the vault')
  @Example(VaultState.Guarded)
  @Property()
  public state: VaultState;

  @Title('underlyingToken')
  @Description('Contract address for deposit token')
  @Example('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599')
  @Property()
  public underlyingToken: string;

  @Title('vaultToken')
  @Description('Contract address for vault token')
  @Example('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599')
  @Property()
  public vaultToken: string;

  @Title('value')
  @Description('Currency denominated vault value')
  @Example(1245388.433)
  @Property()
  public value: number;

  @Title('available')
  @Description('Vault available token balance')
  @Example(4053.3221)
  @Property()
  public available: number;

  @Title('balance')
  @Description('Vault underlying token balance')
  @Example(4053.3221)
  @Property()
  public balance: number;

  @Title('protocol')
  @Description('Vault underlying protocol')
  @Example(Protocol.Convex)
  @Property()
  public protocol: Protocol;

  @Title('pricePerFullShare')
  @Description('Price per full share, conversion from vault tokens to underlying tokens')
  @Example(1.00032103)
  @Property()
  public pricePerFullShare: number;

  @Title('tokens')
  @Description('Token balances held by the vault')
  @Example([mockBalance(fullTokenMockMap[TOKENS.BADGER], 3882.35294118), mockBalance(fullTokenMockMap[TOKENS.WBTC], 1)])
  @Property()
  public tokens: TokenValue[];

  @Title('apr')
  @Description('Baseline Vault APR')
  @Example(18.00032103)
  @Property()
  public apr: number;

  @Title('apy')
  @Description('Baseline Vault APY')
  @Example(18.00032103)
  @Property()
  public apy: number;

  @Title('boost')
  @Description('Boost configuration indicating if the vault is boostable, and how much weight it contributes')
  @Example(true)
  @Property()
  public boost: BoostConfig;

  @Title('minApr')
  @Description('Minimum vault APR as modifid by badger boost')
  @Example(8.03)
  @Property()
  public minApr?: number;

  @Title('maxApr')
  @Description('Maximum vault APR as modifid by badger boost')
  @Example(8.03)
  @Property()
  public maxApr?: number;

  @Title('minApr')
  @Description('Minimum vault APY as modifid by badger boost')
  @Example(8.03)
  @Property()
  public minApy?: number;

  @Title('maxApr')
  @Description('Maximum vault APY as modifid by badger boost')
  @Example(8.03)
  @Property()
  public maxApy?: number;

  @Title('sources')
  @Description('Vault APR individual yield source breakdown')
  @Example([
    createValueSource(VAULT_SOURCE, 8.32),
    createValueSource('Badger Rewards', 17.34),
    createValueSource('LP Trade Fee', 1.4),
  ])
  @Property()
  public sources: ValueSource[];

  @Title('sourcesApy')
  @Description('Vault APY individual yield source breakdown')
  @Example([
    createValueSource(VAULT_SOURCE, 8.32),
    createValueSource('Badger Rewards', 17.34),
    createValueSource('LP Trade Fee', 1.45),
  ])
  @Property()
  public sourcesApy: ValueSource[];

  @Title('bouncer')
  @Description('Enumeration displaying the badger bouncer type associated with the vault')
  @Example(BouncerType.Badger)
  @Property()
  public bouncer: BouncerType;

  @Title('strategy')
  @Description('Vault strategy information')
  @Example({
    address: ethers.constants.AddressZero,
    withdrawFee: 50,
    performanceFee: 20,
    strategistFee: 10,
  })
  @Property()
  public strategy: VaultStrategy;

  @Title('type')
  @Description('Enumeration displaying the vault type')
  @Example(VaultType.Standard)
  @Property()
  public type: VaultType;

  @Title('behavior')
  @Description('Short description of the vaults strategy operations')
  @Example(VaultBehavior.DCA)
  @Property()
  public behavior: VaultBehavior;

  @Title('yieldProjection')
  @Description('Projection of current yield and harvest yield')
  @Example({
    yieldApr: 10,
    yieldTokens: [TOKENS.CRV],
    yieldValue: 30,
    harvestApr: 9.95,
    harvestApy: 14.32,
    harvestTokens: [TOKENS.BCVXCRV],
    harvestValue: 35,
  })
  @Property()
  public yieldProjection: VaultYieldProjection;

  @Title('lastHarvest')
  @Description('Timestamp of the previous harvest')
  @Example(Date.now())
  @Property()
  public lastHarvest: number;

  @Title('version')
  @Description('Version of Badger Vault')
  @Example(VaultVersion.v1_5)
  @Property()
  public version: VaultVersion;

  constructor({
    name,
    state,
    asset,
    vaultAsset,
    underlyingToken,
    vaultToken,
    value,
    available,
    balance,
    protocol,
    pricePerFullShare,
    tokens,
    apr,
    apy,
    boost,
    minApr,
    maxApr,
    minApy,
    maxApy,
    sources,
    sourcesApy,
    bouncer,
    strategy,
    type,
    behavior,
    yieldProjection,
    lastHarvest,
    version,
  }: VaultDTO) {
    this.name = name;
    this.state = state;
    this.asset = asset;
    this.vaultAsset = vaultAsset;
    this.underlyingToken = underlyingToken;
    this.vaultToken = vaultToken;
    this.value = value;
    this.available = available;
    this.balance = balance;
    this.protocol = protocol;
    this.pricePerFullShare = pricePerFullShare;
    this.tokens = tokens;
    this.apr = apr;
    this.apy = apy;
    this.boost = boost;
    this.minApr = minApr;
    this.maxApr = maxApr;
    this.minApy = minApy;
    this.maxApy = maxApy;
    this.sources = sources;
    this.sourcesApy = sourcesApy;
    this.bouncer = bouncer;
    this.strategy = strategy;
    this.type = type;
    this.behavior = behavior;
    this.yieldProjection = yieldProjection;
    this.lastHarvest = lastHarvest;
    this.version = version;
  }
}
