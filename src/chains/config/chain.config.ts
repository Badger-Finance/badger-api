import { BadRequest } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { STAGE } from '../../config/constants';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { TokenConfig } from '../../tokens/interfaces/token-config.interface';
import { ChainStrategy } from '../strategies/chain.strategy';
import { Network } from '@badger-dao/sdk';
import { TOKENS } from '../../config/tokens.config';

type Chains = Record<string, Chain>;

export abstract class Chain {
  private static chains: Chains = {};
  readonly name: string;
  readonly symbol: string;
  readonly chainId: string;
  readonly network: Network;
  readonly tokens: TokenConfig;
  readonly setts: VaultDefinition[];
  readonly provider: ethers.providers.JsonRpcProvider;
  readonly batchProvider: ethers.providers.JsonRpcBatchProvider;
  readonly strategy: ChainStrategy;
  readonly graphUrl: string;
  readonly blocksPerYear: number;
  readonly badgerTree?: string;
  readonly rewardsLogger?: string;
  readonly emissionControl?: string;

  constructor(
    name: string,
    symbol: string,
    chainId: string,
    network: Network,
    tokens: TokenConfig,
    setts: VaultDefinition[],
    rpcUrl: string,
    strategy: ChainStrategy,
    blocksPerYear: number,
    badgerTree?: string,
    rewardsLogger?: string,
    emissionControl?: string,
  ) {
    this.name = name;
    this.symbol = symbol;
    this.chainId = chainId;
    this.network = network;
    this.tokens = tokens;
    this.setts = setts.filter((sett) => !sett.stage || sett.stage === STAGE);
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.batchProvider = new ethers.providers.JsonRpcBatchProvider(rpcUrl);
    this.strategy = strategy;
    this.graphUrl = `https://api.thegraph.com/subgraphs/name/axejintao/badger-dao${
      network !== Network.Ethereum ? `-${symbol.toLowerCase()}` : ''
    }`;
    this.blocksPerYear = blocksPerYear;
    this.badgerTree = badgerTree;
    this.rewardsLogger = rewardsLogger;
    this.emissionControl = emissionControl;
  }

  static register(network: Network, chain: Chain): void {
    Chain.chains[network] = chain;
    Chain.chains[chain.symbol] = chain;
    if (network === Network.Polygon) {
      Chain.chains['matic'] = chain;
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
    return {
      rapid: gasPrice,
      fast: gasPrice,
      standard: gasPrice,
      slow: gasPrice,
    };
  }
}
