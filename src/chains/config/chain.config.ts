import { BadRequest } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { SettDefinition } from '../../interface/Sett';
import { TokenConfig } from '../../tokens/types/token-config.type';
import { ChainNetwork } from '../enums/chain-network.enum';
import { ChainStrategy } from '../strategies/chain.strategy';

type Chains = Record<string, Chain>;

export abstract class Chain {
  private static chains: Chains = {};
  readonly name: string;
  readonly symbol: string;
  readonly chainId: string;
  readonly tokens: TokenConfig;
  readonly setts: SettDefinition[];
  readonly provider: ethers.providers.JsonRpcProvider;
  readonly strategy: ChainStrategy;
  readonly graphUrl: string;

  constructor(
    name: string,
    symbol: string,
    chainId: string,
    tokens: TokenConfig,
    setts: SettDefinition[],
    provider: ethers.providers.JsonRpcProvider,
    strategy: ChainStrategy,
    graphUrl: string,
  ) {
    this.name = name;
    this.symbol = symbol;
    this.chainId = chainId;
    this.tokens = tokens;
    this.setts = setts;
    this.provider = provider;
    this.strategy = strategy;
    this.graphUrl = graphUrl;
  }

  static register(network: ChainNetwork, chain: Chain): void {
    Chain.chains[network] = chain;
  }

  static getChain(network?: ChainNetwork): Chain {
    if (!network) {
      network = ChainNetwork.Ethereum;
    }
    const chain = this.chains[network];
    if (!chain) {
      throw new BadRequest(`${network} is not a supported chain`);
    }
    return chain;
  }
}
