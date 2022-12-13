import axios from 'axios';
import { RawAbiDefinition } from 'typechain/dist/parser/abiParser';

import { sleep } from './process.utils';

const defaultTtl = 60 * 5 * 1000; // 5 minutes

const abiCacheMap: {
  [key: string]: {
    ttl: number;
    abi: RawAbiDefinition[];
  };
} = {};

export function formScanApiUrl(explorerUrl: string): string {
  const expUrlObj = new URL(explorerUrl);
  return `${expUrlObj.protocol}//api.${expUrlObj.host}/api`;
}

export async function getContractAbi(
  address: string,
  scanApiUrl: string,
  withThreshold = true,
  useCache = true,
): Promise<RawAbiDefinition[] | null> {
  if (useCache && abiCacheMap[address] && abiCacheMap[address].ttl >= Date.now()) {
    return abiCacheMap[address].abi;
  }

  // if we don't use private keys for scans they can block us, so it's better to use sleep
  if (withThreshold) await sleep(500);

  const scanResp = await axios.get<{
    result: string;
  }>(`${scanApiUrl}?module=contract&action=getabi&address=${address}`);

  const scanRespJson = scanResp.data;

  if (scanResp.status !== 200) return null;

  if (!scanRespJson || !scanRespJson?.result) {
    console.warn(`Failed to get abi for ${address}`);
    return null;
  }

  const contractAbi = JSON.parse(scanRespJson.result);

  if (useCache) {
    abiCacheMap[address] = {
      abi: contractAbi,
      ttl: Date.now() + defaultTtl,
    };
  }

  return contractAbi;
}
