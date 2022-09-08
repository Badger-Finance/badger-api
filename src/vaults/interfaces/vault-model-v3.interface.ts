import {
  BoostConfig,
  Protocol,
  TokenValue,
  VaultBehavior,
  VaultDTOV3,
  VaultState,
  VaultType,
  VaultVersion,
  VaultYieldProjectionV3,
  VaultYieldSummary,
} from '@badger-dao/sdk';
import { Description, Example, Property, Title } from '@tsed/schema';
import { ethers } from 'ethers';

import { TOKENS } from '../../config/tokens.config';
import { BouncerType } from '../../rewards/enums/bouncer-type.enum';
import { VaultStrategy } from './vault-strategy.interface';

export class VaultModelV3 implements VaultDTOV3 {
  @Title('address')
  @Description('vault address')
  @Example('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599')
  @Property()
  public address!: string;

  @Title('name')
  @Description('vault display name')
  @Example('Convex Tricrypto')
  @Property()
  public name!: string;

  @Title('asset')
  @Description('vault underlying asset name')
  @Example('crvTricrypto')
  @Property()
  public asset!: string;

  @Title('vaultAsset')
  @Description('Vault asset name')
  @Example('bcrvTricrypto')
  @Property()
  public vaultAsset!: string;

  @Title('state')
  @Description('Launch state of the vault')
  @Example(VaultState.Guarded)
  @Property()
  public state!: VaultState;

  @Title('underlyingToken')
  @Description('Contract address for deposit token')
  @Example('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599')
  @Property()
  public underlyingToken!: string;

  @Title('vaultToken')
  @Description('Contract address for vault token')
  @Example('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599')
  @Property()
  public vaultToken!: string;

  @Title('value')
  @Description('Currency denominated vault value')
  @Example(1245388.433)
  @Property()
  public value!: number;

  @Title('available')
  @Description('Vault available token balance')
  @Example(4053.3221)
  @Property()
  public available!: number;

  @Title('balance')
  @Description('Vault underlying token balance')
  @Example(4053.3221)
  @Property()
  public balance!: number;

  @Title('protocol')
  @Description('Vault underlying protocol')
  @Example(Protocol.Convex)
  @Property()
  public protocol!: Protocol;

  @Title('pricePerFullShare')
  @Description('Price per full share, conversion from vault tokens to underlying tokens')
  @Example(1.00032103)
  @Property()
  public pricePerFullShare!: number;

  @Title('tokens')
  @Description('Token balances held by the vault')
  @Example([
    {
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      name: 'Wrapped Bitcoin',
      symbol: 'WBTC',
      decimals: 8,
      balance: 3,
      value: 45000,
    },
  ])
  @Property()
  public tokens!: TokenValue[];

  @Title('apr')
  @Description('Baseline Vault APR')
  @Example({
    baseYield: 10,
    grossYield: 11,
    minYield: 8,
    maxYield: 32,
    minGrossYield: 8,
    maxGrossYield: 35,
    sources: [
      {
        name: 'Vault Compounding',
        performance: {
          baseYield: 4,
          minYield: 3,
          maxYield: 5,
          grossYield: 5,
          minGrossYield: 4,
          maxGrossYield: 6,
        },
        boostable: true,
      },
    ],
  })
  @Property()
  public apr!: VaultYieldSummary;

  @Title('apy')
  @Description('Baseline Vault APY')
  @Example({
    baseYield: 13,
    grossYield: 16,
    minYield: 3,
    maxYield: 132,
    minGrossYield: 5,
    maxGrossYield: 147,
    sources: [
      {
        name: 'Vault Compounding',
        performance: {
          baseYield: 4,
          minYield: 3,
          maxYield: 5,
          grossYield: 5,
          minGrossYield: 4,
          maxGrossYield: 6,
        },
        boostable: true,
      },
    ],
  })
  @Property()
  public apy!: VaultYieldSummary;

  @Title('boost')
  @Description('Boost configuration indicating if the vault is boostable, and how much weight it contributes')
  @Example(true)
  @Property()
  public boost!: BoostConfig;

  @Title('bouncer')
  @Description('Enumeration displaying the badger bouncer type associated with the vault')
  @Example(BouncerType.Badger)
  @Property()
  public bouncer!: BouncerType;

  @Title('strategy')
  @Description('Vault strategy information')
  @Example({
    address: ethers.constants.AddressZero,
    withdrawFee: 50,
    performanceFee: 20,
    strategistFee: 10,
  })
  @Property()
  public strategy!: VaultStrategy;

  @Title('type')
  @Description('Enumeration displaying the vault type')
  @Example(VaultType.Standard)
  @Property()
  public type!: VaultType;

  @Title('behavior')
  @Description('Short description of the vaults strategy operations')
  @Example(VaultBehavior.DCA)
  @Property()
  public behavior!: VaultBehavior;

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
    nonHarvestSources: [
      {
        name: 'Vault Compounding',
        performance: {
          baseYield: 4,
          minYield: 3,
          maxYield: 5,
          grossYield: 5,
          minGrossYield: 4,
          maxGrossYield: 6,
        },
        boostable: true,
      },
    ],
    nonHarvestSourcesApy: [
      {
        name: 'Vault Compounding',
        performance: {
          baseYield: 4,
          minYield: 3,
          maxYield: 5,
          grossYield: 5,
          minGrossYield: 4,
          maxGrossYield: 6,
        },
        boostable: true,
      },
    ],
  })
  @Property()
  public yieldProjection!: VaultYieldProjectionV3;

  @Title('lastHarvest')
  @Description('Timestamp of the previous harvest')
  @Example(Date.now())
  @Property()
  public lastHarvest!: number;

  @Title('version')
  @Description('Version of Badger Vault')
  @Example(VaultVersion.v1_5)
  @Property()
  public version!: VaultVersion;
}
