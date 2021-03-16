import { ethers } from 'ethers';
import { SettDefinition } from '../interface/Sett';
import { Token } from '../interface/Token';

export class Chain {
  chainId!: string;
  name!: string;
  provider!: ethers.providers.JsonRpcProvider;
  setts!: SettDefinition[];
  symbol!: string;
  tokens!: Token[];
  type!: string;
}
