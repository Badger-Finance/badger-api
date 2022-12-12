import axios from 'axios';

import { sleep } from './process.utils';

export function formScanApiUrl(explorerUrl: string): string {
  const expUrlObj = new URL(explorerUrl);
  return `${expUrlObj.protocol}//api.${expUrlObj.host}/api`;
}

export async function getContractAbi(address: string, scanApiUrl: string, withThreshold = true) {
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

  return JSON.parse(scanRespJson.result);
}
