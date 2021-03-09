import { ethers } from "ethers";
import { Token } from "../interface/Token";
import { SettData } from "../service/setts";
import { Provider } from "./constants";

export interface Chain {
  readonly name: string;
  readonly chainId: string;
  readonly tokens: Token[];
  readonly setts: SettData[];
  readonly provider: ethers.providers.JsonRpcProvider;
};

export class Ethereum implements Chain {
  public name = "Ethereum";
  public chainId = "0x01";
  public tokens = [];
  public setts = [];
  public provider = new ethers.providers.JsonRpcProvider(Provider.Cloudflare);
};

export class BinanceSmartChain implements Chain {
  public name = "BinanceSmartChain";
  public chainId = "0x61";
  public tokens = [];
  public setts = [];
  public provider = new ethers.providers.JsonRpcProvider(Provider.Binance);
};

export const eth = new Ethereum();
export const bsc = new BinanceSmartChain();
