import { Description, Example, Property, Title } from '@tsed/schema';
import { SettState } from '../../config/enums/sett-state.enum';
import { TOKENS } from '../../config/tokens.config';
import { uniformPerformance } from '../../protocols/interfaces/performance.interface';
import { createValueSource, ValueSource } from '../../protocols/interfaces/value-source.interface';
import { BouncerType } from '../../rewards/enums/bouncer-type.enum';
import { getToken, mockBalance } from '../../tokens/tokens.utils';
import { VAULT_SOURCE } from '../setts.utils';
import { SettStrategy } from './sett-strategy.interface';
import { ethers } from 'ethers';
import { Protocol, Sett, TokenBalance } from '@badger-dao/sdk';

export class SettModel implements Sett {
  @Title('name')
  @Description('Sett display name')
  @Example('Convex Tricrypto')
  @Property()
  public name: string;

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
  @Example(SettState.Guarded)
  @Property()
  public state: SettState;

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

  @Title('boostable')
  @Description('Flag indicating if sett APR is modifiable by badger boost')
  @Example(true)
  @Property()
  public boostable: boolean;

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

  @Title('experimental')
  @Description('Flag indicating if sett is an experimental strategy')
  @Example(false)
  @Property()
  public experimental: boolean;

  @Title('deprecated')
  @Description('Flag indicating if sett is deprecated')
  @Example(false)
  @Property()
  public deprecated: boolean;

  @Title('strategy')
  @Description('Sett strategy information')
  @Example({
    address: ethers.constants.AddressZero,
    withdrawFee: 50,
    performanceFee: 20,
    strategistFee: 10,
  })
  @Property()
  public strategy: SettStrategy;

  constructor(
    name: string,
    state: SettState,
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
    boostable: boolean,
    sources: ValueSource[],
    experimental: boolean,
    bouncer: BouncerType,
    deprecated: boolean,
    strategy: SettStrategy,
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
    this.boostable = boostable;
    this.minApr = minApr;
    this.maxApr = maxApr;
    this.sources = sources;
    this.bouncer = bouncer;
    this.experimental = experimental;
    this.deprecated = deprecated;
    this.strategy = strategy;
  }
}
