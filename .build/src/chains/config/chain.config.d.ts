import { providers } from "@0xsequence/multicall";
import BadgerSDK, { Network } from "@badger-dao/sdk";
import { GasPrices } from "../../gas/interfaces/gas-prices.interface";
import { TokenConfig } from "../../tokens/interfaces/token-config.interface";
import { ChainStrategy } from "../strategies/chain.strategy";
import { ChainVaults } from "../vaults/chain.vaults";
export declare abstract class Chain {
  readonly network: Network;
  readonly tokens: TokenConfig;
  readonly rpcUrl: string;
  private static chains;
  private static chainsByNetworkId;
  private static sdks;
  readonly chainId: number;
  readonly sdk: BadgerSDK;
  readonly vaults: ChainVaults;
  readonly strategy: ChainStrategy;
  readonly emissionControl?: string;
  constructor(network: Network, tokens: TokenConfig, rpcUrl: string, strategy: ChainStrategy, emissionControl?: string);
  get provider(): providers.MulticallProvider;
  static register(network: Network, chain: Chain): void;
  static getChain(network?: Network): Chain;
  static getChainById(id?: string): Chain;
  getSdk(): Promise<BadgerSDK>;
  getBadgerTokenAddress(): string;
  getGasPrices(): Promise<GasPrices>;
  private sanitizePrice;
}
