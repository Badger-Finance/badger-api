import { Description, Example, Property, Title } from "@tsed/schema";
import { Sett } from "./sett.interface";

export class SettModel implements Sett {
  @Title("name")
  @Description("Sett display name")
  @Example("Convex Tricrypto")
  @Property()
  public name: string;

  @Title("underlyingToken")
  @Description("Contract address for deposit token")
  @Example("0x2260fac5e5542a773aa44fbcfedf7c193bc2c599")
  @Property()
  public underlyingToken: string;

  @Title("vaultToken")
  @Description("Contract address for sett token")
  @Example("0x2260fac5e5542a773aa44fbcfedf7c193bc2c599")
  @Property()
  public vaultToken: string;

  @Title("value")
  @Description("Contract address for sett token")
  @Example("0x2260fac5e5542a773aa44fbcfedf7c193bc2c599")
  @Property()
  public value: number;

  // apr: number;
  // asset: string;
  // boostable: boolean;
  // experimental: boolean;
  // hasBouncer: boolean;
  // maxApr?: number;
  // minApr?: number;
  // ppfs: number;
  // sources: ValueSource[];
  // tokens: TokenBalance[];
  // balance: number;

  constructor(name: string, underlyingToken: string, vaultToken: string, value: number) {
    this.name = name;
    this.underlyingToken = underlyingToken;
    this.vaultToken = vaultToken;
    this.value = value;
  }
}