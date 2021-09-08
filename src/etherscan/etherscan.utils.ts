import fetch from 'node-fetch';
import { EtherscanAction } from './enums/etherscan-action.enum';
import { EtherscanModule } from './enums/etherscan-module.enum';
import { EtherscanBlockResponse } from './interfaces/etherscan-block-response.interface';

const ETHERSCAN_API = 'https://api.etherscan.io/api';
const ARBISCAN_API = 'https://api.arbiscan.io/api';

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'MISSING REQUIRED ENV VAR';
const ARBISCAN_API_KEY = process.env.ARBISCAN_API_KEY || 'MISSING REQUIRED ENV VAR';

async function request<T>(baseUrl: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(baseUrl);
  url.search = new URLSearchParams(params).toString();
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(await res.text());
  }
  const obj = (await res.json()) as T;
  return obj;
}

async function getBlock(api: string, apiKey: string, timestamp: number): Promise<number> {
  const params = {
    module: EtherscanModule.Block,
    action: EtherscanAction.GetBlockNoByTime,
    timestamp: timestamp.toString(),
    closest: 'before',
    apikey: apiKey,
  };
  const result = await request<EtherscanBlockResponse>(api, params);
  return Number(result.result);
}

export async function getArbitrumBlock(timestamp: number): Promise<number> {
  return getBlock(ARBISCAN_API, ARBISCAN_API_KEY, timestamp);
}

export async function getEthereumBlock(timestamp: number): Promise<number> {
  return getBlock(ETHERSCAN_API, ETHERSCAN_API_KEY, timestamp);
}
