import { Description, Example, Property, Title } from '@tsed/schema';
import { TOKENS } from '../../config/constants';
import { ValueSource } from '../../protocols/interfaces/value-source.interface';
import { toTestBalance } from '../../test/tests.utils';
import { TokenBalance } from '../../tokens/interfaces/token-balance.interface';
import { getToken } from '../../tokens/tokens.utils';
import { Sett } from './sett.interface';

export class SettModel implements Sett {
  @Title('name')
  @Description('Sett display name')
  @Example('Convex Tricrypto')
  @Property()
  public name: string;

  @Title('asset')
  @Description('Sett asset name')
  @Example('crvTricrypto')
  @Property()
  public asset: string;

  @Title('underlyingToken')
  @Description('Contract address for deposit token')
  @Example('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599')
  @Property()
  public underlyingToken: string;

  @Title('vaultToken')
  @Description('Contract address for sett token')
  @Example('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599')
  @Property()
  public vaultToken: string;

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

  @Title('ppfs')
  @Description('Price per full share, conversion from sett tokens to underlying tokens')
  @Example(1.00032103)
  @Property()
  public ppfs: number;

  @Title('tokens')
  @Description('Token balances held by the sett')
  @Example([
    toTestBalance(getToken(TOKENS.BADGER), 3882.35294118),
    toTestBalance(getToken(TOKENS.WBTC), 1),
  ])
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
  public sources: ValueSource[];

  @Title('hasBouncer')
  @Description('Flag indicating if sett is protected by a guest list')
  @Example(false)
  @Property()
  public hasBouncer: boolean;

  @Title('experimental')
  @Description('Flag indicating if sett is an experimental strategy')
  @Example(false)
  @Property()
  public experimental: boolean;

  constructor(
    name: string,
    asset: string,
    underlyingToken: string,
    vaultToken: string,
    value: number,
    balance: number,
    ppfs: number,
    tokens: TokenBalance[],
    apr: number,
    boostable: boolean,
    sources: ValueSource[],
    experimental: boolean,
    hasBouncer: boolean,
    minApr?: number,
    maxApr?: number,
  ) {
    this.name = name;
    this.asset = asset;
    this.underlyingToken = underlyingToken;
    this.vaultToken = vaultToken;
    this.value = value;
    this.balance = balance;
    this.ppfs = ppfs;
    this.tokens = tokens;
    this.apr = apr;
    this.boostable = boostable;
    this.minApr = minApr;
    this.maxApr = maxApr;
    this.sources = sources;
    this.hasBouncer = hasBouncer;
    this.experimental = experimental;
  }
}
