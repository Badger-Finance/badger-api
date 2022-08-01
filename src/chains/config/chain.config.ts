import { providers } from '@0xsequence/multicall';
import BadgerSDK, { Network } from '@badger-dao/sdk';
import { BadRequest, NotFound } from '@tsed/exceptions';
import { ethers } from 'ethers';

import { TOKENS } from '../../config/tokens.config';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { TokenConfig } from '../../tokens/interfaces/token-config.interface';
import { ChainStrategy } from '../strategies/chain.strategy';
import { ChainVaults } from '../vaults/chain.vaults';

type Chains = Record<string, Chain>;
type Sdks = Record<string, BadgerSDK>;

export abstract class Chain {
  private static chains: Chains = {};
  private static chainsByNetworkId: Record<string, Chain> = {};
  private static sdks: Sdks = {};

  readonly sdk: BadgerSDK;
  readonly vaults: ChainVaults;
  readonly strategy: ChainStrategy;
  // TODO: add emission control support to sdk
  readonly emissionControl?: string;

  constructor(
    readonly name: string,
    readonly symbol: string,
    readonly chainId: string,
    readonly network: Network,
    readonly tokens: TokenConfig,
    readonly rpcUrl: string,
    strategy: ChainStrategy,
    emissionControl?: string,
  ) {
    this.vaults = new ChainVaults(network);
    this.sdk = new BadgerSDK({ network: parseInt(chainId, 16), provider: rpcUrl });
    this.strategy = strategy;
    this.emissionControl = emissionControl;
  }

  get provider(): providers.MulticallProvider {
    return this.sdk.provider;
  }

  static register(network: Network, chain: Chain): void {
    if (Chain.chains[network]) {
      return;
    }

    // Register chain objects
    Chain.chains[network] = chain;
    Chain.chains[chain.symbol] = chain;
    Chain.chainsByNetworkId[parseInt(chain.chainId, 16)] = chain;
    if (network === Network.Polygon) {
      Chain.chains['matic'] = chain;
    }
    if (network === Network.BinanceSmartChain) {
      Chain.chains['binancesmartchain'] = chain;
    }

    // Register sdk objects
    const { sdk, symbol } = chain;
    Chain.sdks[network] = sdk;
    Chain.sdks[symbol] = sdk;
    if (network === Network.Polygon) {
      Chain.sdks['matic'] = sdk;
    }
    if (network === Network.BinanceSmartChain) {
      Chain.sdks['binancesmartchain'] = sdk;
    }
  }

  static getChain(network?: Network): Chain {
    if (!network) {
      network = Network.Ethereum;
    }
    const chain = this.chains[network];
    if (!chain) {
      throw new BadRequest(`${network} is not a supported chain`);
    }
    return chain;
  }

  static getChainById(id?: string): Chain {
    if (!id) {
      id = '1';
    }
    const chain = Chain.chainsByNetworkId[id];
    if (!chain) {
      throw new NotFound(`Could not find chain for '${id}'`);
    }
    return chain;
  }

  async getSdk(): Promise<BadgerSDK> {
    const sdk = Chain.sdks[this.network];
    await sdk.ready();
    return sdk;
  }

  getBadgerTokenAddress(): string {
    return TOKENS.BADGER;
  }

  async getGasPrices(): Promise<GasPrices> {
    let gasPrice;
    try {
      gasPrice = Number(ethers.utils.formatUnits(await this.provider.getGasPrice(), 9));
    } catch (err) {
      console.log(err);
      gasPrice = this.network === Network.Ethereum ? 60 : 5;
    }
    if (this.network === Network.Ethereum) {
      const defaultPriorityFee = 2;
      return {
        rapid: {
          maxPriorityFeePerGas: defaultPriorityFee,
          maxFeePerGas: this.sanitizePrice(gasPrice * 2),
        },
        fast: {
          maxPriorityFeePerGas: defaultPriorityFee,
          maxFeePerGas: this.sanitizePrice(gasPrice * 1.8),
        },
        standard: {
          maxPriorityFeePerGas: defaultPriorityFee,
          maxFeePerGas: this.sanitizePrice(gasPrice * 1.6),
        },
        slow: {
          maxPriorityFeePerGas: defaultPriorityFee,
          maxFeePerGas: this.sanitizePrice(gasPrice * 1.4),
        },
      };
    }
    // we don't have a mempool based guess here just define a spread
    return {
      rapid: this.sanitizePrice(gasPrice * 1.2),
      fast: this.sanitizePrice(gasPrice * 1.1),
      standard: this.sanitizePrice(gasPrice),
      slow: this.sanitizePrice(gasPrice * 0.9),
    };
  }

  private sanitizePrice(price: number): number {
    return Math.max(1, price);
  }
}
