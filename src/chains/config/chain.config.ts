import { BadRequest } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { STAGE } from '../../config/constants';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { TokenConfig } from '../../tokens/interfaces/token-config.interface';
import { ChainStrategy } from '../strategies/chain.strategy';
import { Network } from '@badger-dao/sdk';

type Chains = Record<string, Chain>;

export abstract class Chain {
  private static chains: Chains = {};
  readonly name: string;
  readonly symbol: string;
  readonly chainId: string;
  readonly network: Network;
  readonly tokens: TokenConfig;
  readonly setts: SettDefinition[];
  readonly provider: ethers.providers.JsonRpcProvider;
  readonly batchProvider: ethers.providers.JsonRpcBatchProvider;
  readonly strategy: ChainStrategy;
  readonly graphUrl: string;
  readonly blocksPerYear: number;
  readonly badgerTree?: string;
  readonly rewardsLogger?: string;

  constructor(
    name: string,
    symbol: string,
    chainId: string,
    network: Network,
    tokens: TokenConfig,
    setts: SettDefinition[],
    rpcUrl: string,
    strategy: ChainStrategy,
    blocksPerYear: number,
    badgerTree?: string,
    rewardsLogger?: string,
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
    this.graphUrl = `https://api.thegraph.com/subgraphs/name/badger-finance/badger-dao-setts${
      network !== Network.Ethereum ? `-${symbol.toLowerCase()}` : ''
    }`;
    this.blocksPerYear = blocksPerYear;
    this.badgerTree = badgerTree;
    this.rewardsLogger = rewardsLogger;
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

  abstract getGasPrices(): Promise<GasPrices>;
}
