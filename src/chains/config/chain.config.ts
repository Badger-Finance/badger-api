import { BadRequest, NotFound } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { STAGE } from '../../config/constants';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { TokenConfig } from '../../tokens/interfaces/token-config.interface';
import BadgerSDK, { Network } from '@badger-dao/sdk';
import { TOKENS } from '../../config/tokens.config';
import { providers } from '@0xsequence/multicall';

type Chains = Record<string, Chain>;
type Sdks = Record<string, BadgerSDK>;

export abstract class Chain {
  private static chains: Chains = {};
  private static chainsByNetworkId: Record<string, Chain> = {};
  private static sdks: Sdks = {};
  readonly name: string;
  readonly symbol: string;
  readonly chainId: string;
  readonly network: Network;
  readonly tokens: TokenConfig;
  readonly vaults: VaultDefinition[];
  readonly provider: ethers.providers.JsonRpcProvider;
  readonly batchProvider: providers.MulticallProvider;
  readonly badgerTree?: string;
  readonly rewardsLogger?: string;
  readonly emissionControl?: string;

  constructor(
    name: string,
    symbol: string,
    chainId: string,
    network: Network,
    tokens: TokenConfig,
    vaults: VaultDefinition[],
    rpcUrl: string,
    badgerTree?: string,
    rewardsLogger?: string,
    emissionControl?: string,
  ) {
    this.name = name;
    this.symbol = symbol;
    this.chainId = chainId;
    this.network = network;
    this.tokens = tokens;
    this.vaults = vaults.filter((vault) => !vault.stage || vault.stage === STAGE);
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.batchProvider = new providers.MulticallProvider(this.provider);
    this.badgerTree = badgerTree;
    this.rewardsLogger = rewardsLogger;
    this.emissionControl = emissionControl;
  }

  static register(network: Network, chain: Chain): void {
    if (Chain.chains[network]) {
      return;
    }
    Chain.chains[network] = chain;
    Chain.chains[chain.symbol] = chain;
    Chain.chainsByNetworkId[parseInt(chain.chainId, 16)] = chain;
    if (network === Network.Polygon) {
      Chain.chains['matic'] = chain;
    }
    if (network === Network.BinanceSmartChain) {
      Chain.chains['binancesmartchain'] = chain;
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
    let sdk = Chain.sdks[this.network];
    if (!sdk) {
      sdk = new BadgerSDK({ network: parseInt(this.chainId, 16), provider: this.provider });
      Chain.sdks[this.network] = sdk;
      Chain.sdks[this.symbol] = sdk;
      if (this.network === Network.Polygon) {
        Chain.sdks['matic'] = sdk;
      }
      if (this.network === Network.BinanceSmartChain) {
        Chain.sdks['binancesmartchain'] = sdk;
      }
    }
    await sdk.ready();
    return sdk;
  }

  getBadgerTokenAddress(): string {
    return TOKENS.BADGER;
  }

  abstract getGasPrices(): Promise<GasPrices>;

  async defaultGasPrice(): Promise<GasPrices> {
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
          maxFeePerGas: gasPrice * 2,
        },
        fast: {
          maxPriorityFeePerGas: defaultPriorityFee,
          maxFeePerGas: gasPrice * 1.8,
        },
        standard: {
          maxPriorityFeePerGas: defaultPriorityFee,
          maxFeePerGas: gasPrice * 1.6,
        },
        slow: {
          maxPriorityFeePerGas: defaultPriorityFee,
          maxFeePerGas: gasPrice * 1.4,
        },
      };
    }
    // we don't have a mempool based guess here just define a spread
    return {
      rapid: gasPrice * 1.2,
      fast: gasPrice * 1.1,
      standard: gasPrice,
      slow: gasPrice * 0.9,
    };
  }
}
