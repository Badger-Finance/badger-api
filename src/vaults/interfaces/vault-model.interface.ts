import { Description, Example, Property, Title } from '@tsed/schema';
import { TOKENS } from '../../config/tokens.config';
import { uniformPerformance } from '../../protocols/interfaces/performance.interface';
import { createValueSource, ValueSource } from '../../protocols/interfaces/value-source.interface';
import { BouncerType } from '../../rewards/enums/bouncer-type.enum';
import { getToken, mockBalance } from '../../tokens/tokens.utils';
import { VAULT_SOURCE } from '../vaults.utils';
import { VaultStrategy } from './vault-strategy.interface';
import { ethers } from 'ethers';
import { BoostConfig, Protocol, Vault, VaultState, TokenBalance, VaultType } from '@badger-dao/sdk';

export class VaultModel implements Vault {
  @Title('name')
  @Description('Sett display name')
  @Example('Convex Tricrypto')
  @Property()
  public name: string;

  @Title('newVault')
  @Description('Indicator if the vault is a new product offering')
  @Example(true)
  @Property()
  public newVault: boolean;

  @Title('asset')
  @Description('Sett underlying asset name')
  @Example('crvTricrypto')
  @Property()
  public asset: string;

  @Title('settAsset')
  @Description('Sett asset name')
  @Example('bcrvTricrypto')
  @Property()
  public settAsset: string;

  @Title('state')
  @Description('Launch state of the sett')
  @Example(VaultState.Guarded)
  @Property()
  public state: VaultState;

  @Title('underlyingToken')
  @Description('Contract address for deposit token')
  @Example('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599')
  @Property()
  public underlyingToken: string;

  @Title('settToken')
  @Description('Contract address for sett token')
  @Example('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599')
  @Property()
  public settToken: string;

  @Title('value')
  @Description('Currency denominated sett value')
  @Example(1245388.433)
  @Property()
  public value: number;

  @Title('balance')
  @Description('Sett underlying token balance')
  @Example(4053.3221)
  @Property()
  public balance: number;

  @Title('protocol')
  @Description('Sett underlying protocol')
  @Example(Protocol.Convex)
  @Property()
  public protocol: Protocol;

  @Title('pricePerFullShare')
  @Description('Price per full share, conversion from sett tokens to underlying tokens')
  @Example(1.00032103)
  @Property()
  public pricePerFullShare: number;

  @Title('tokens')
  @Description('Token balances held by the sett')
  @Example([mockBalance(getToken(TOKENS.BADGER), 3882.35294118), mockBalance(getToken(TOKENS.WBTC), 1)])
  @Property()
  public tokens: TokenBalance[];

  @Title('apr')
  @Description('Baseline sett APR')
  @Example(18.00032103)
  @Property()
  public apr: number;

  @Title('boost')
  @Description('Boost configuration indicating if the vault is boostable, and how much weight it contributes')
  @Example(true)
  @Property()
  public boost: BoostConfig;

  @Title('minApr')
  @Description('Minimum sett APR as modifid by badger boost')
  @Example(8.03)
  @Property()
  public minApr?: number;

  @Title('maxApr')
  @Description('Maximum sett APR as modifid by badger boost')
  @Example(8.03)
  @Property()
  public maxApr?: number;

  @Title('sources')
  @Description('Sett APR individual yield source breakdown')
  @Example([
    createValueSource(VAULT_SOURCE, uniformPerformance(8.32)),
    createValueSource('Badger Rewards', uniformPerformance(17.34)),
    createValueSource('LP Trade Fee', uniformPerformance(1.45)),
  ])
  @Property()
  public sources: ValueSource[];

  @Title('bouncer')
  @Description('Enumeration displaying the badger bouncer type associated with the sett')
  @Example(BouncerType.Badger)
  @Property()
  public bouncer: BouncerType;

  @Title('strategy')
  @Description('Sett strategy information')
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

  constructor(
    name: string,
    state: VaultState,
    asset: string,
    settAsset: string,
    underlyingToken: string,
    settToken: string,
    value: number,
    balance: number,
    protocol: Protocol,
    pricePerFullShare: number,
    tokens: TokenBalance[],
    apr: number,
    boost: BoostConfig,
    sources: ValueSource[],
    bouncer: BouncerType,
    strategy: VaultStrategy,
    newVault: boolean,
    type: VaultType,
    minApr?: number,
    maxApr?: number,
  ) {
    this.name = name;
    this.state = state;
    this.asset = asset;
    this.settAsset = settAsset;
    this.underlyingToken = underlyingToken;
    this.settToken = settToken;
    this.value = value;
    this.balance = balance;
    this.protocol = protocol;
    this.pricePerFullShare = pricePerFullShare;
    this.tokens = tokens;
    this.apr = apr;
    this.boost = boost;
    this.minApr = minApr;
    this.maxApr = maxApr;
    this.sources = sources;
    this.bouncer = bouncer;
    this.strategy = strategy;
    this.newVault = newVault;
    this.type = type;
  }
}
