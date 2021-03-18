import { BadRequest } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { BscStrategy } from '../../chains/strategies/bsc.strategy';
import { EthStrategy } from '../../chains/strategies/eth.strategy';
import { SettDefinition } from '../../interface/Sett';
import { bscTokensConfig } from '../../tokens/config/bsc-tokens.config';
import { ethTokensConfig } from '../../tokens/config/eth-tokens.config';
import { TokenConfig } from '../../tokens/types/token-config.type';
import { Provider } from '../constants';
import { bscSetts } from './bsc';
import { ethSetts } from './eth';

export interface Chain {
  readonly name: string;
  readonly symbol: string;
  readonly chainId: string;
  readonly tokens: TokenConfig;
  readonly setts: SettDefinition[];
  readonly provider: ethers.providers.JsonRpcProvider;
}

export class Ethereum implements Chain {
  public name = 'Ethereum';
  public symbol = 'eth';
  public chainId = '0x01';
  public tokens = ethTokensConfig;
  public setts = ethSetts;
  public provider = new ethers.providers.JsonRpcProvider(Provider.Cloudflare);
}

export class BinanceSmartChain implements Chain {
  public name = 'BinanceSmartChain';
  public symbol = 'bsc';
  public chainId = '0x38';
  public tokens = bscTokensConfig;
  public setts = bscSetts;
  public provider = new ethers.providers.JsonRpcProvider(Provider.Binance);
}

export const eth = new Ethereum();
export const bsc = new BinanceSmartChain();

export const supportedChains = [eth, bsc];

/**
 * Resolve a request query param chain lookup.
 * Failure to specify a chain, or requesting a non-supported
 * chain will default to Ethereum.
 */
export const resolveChainQuery = (symbol?: string): Chain => {
  if (!symbol) return eth;
  const chain = supportedChains.find((c) => c.symbol.toLowerCase() === symbol.toLowerCase());
  if (!chain) throw new BadRequest('Invalid chain');
  return chain;
};

export const initStrategies = (): void => {
  new EthStrategy();
  new BscStrategy();
};
