import { NETWORK_CONFIGS } from '@badger-dao/sdk';
import { GovernanceProposalsDecodedData } from '@badger-dao/sdk/lib/api/interfaces/governance-proposals-decoded-data.interface';
import { Network } from '@badger-dao/sdk/lib/config/enums/network.enum';
import { Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import detectProxyTarget from 'ethers-proxies';

import { getDataMapper } from '../aws/dynamodb.utils';
import { getOrCreateChain } from '../chains/chains.utils';
import { COMPLITED_DECODED_CALLDATA_INDEXED, EMPTY_DECODED_CALLDATA_INDEXED } from '../governance/governance.constants';
import { getProposalsWithEmptyDecodedCallData } from '../governance/governance.utils';
import { extendAbiMethodsWithMeta } from '../utils/contract.utils';
import { rfw } from '../utils/retry.utils';
import { formScanApiUrl, getContractAbi } from '../utils/scans.utils';

export async function decodeGavernanceProposalsCallData() {
  const proposals = await getProposalsWithEmptyDecodedCallData();

  if (proposals.length === 0) {
    console.log('No proposals with empty decoded call data found');
    return;
  }

  const mapper = getDataMapper();

  for (const proposal of proposals) {
    const chain = getOrCreateChain(<Network>proposal.network);

    const scanApiUrl = formScanApiUrl(NETWORK_CONFIGS[chain.network].explorerUrl);

    for (const action of proposal.actions) {
      if (action.decodedCallData !== EMPTY_DECODED_CALLDATA_INDEXED) continue;

      const decodedData = await getTargetMethodDecoded(action.targetAddr, action.callData, scanApiUrl, chain.provider);

      if (!decodedData) continue;

      action.decodedCallData = JSON.stringify(decodedData);
    }

    proposal.decodedCallData = COMPLITED_DECODED_CALLDATA_INDEXED;
  }

  try {
    for await (const _ of mapper.batchPut(proposals)) {
    }
  } catch (err) {
    console.error({ message: 'Unable to save governance proposals with decoded call data', err });
  }
}

async function getTargetMethodDecoded(targetAddr: string, callData: string, scanApiUrl: string, provider: Provider) {
  let relevantTargetAddr = targetAddr;

  const proxyImplementationAddr = await rfw(detectProxyTarget)(targetAddr, provider);

  if (proxyImplementationAddr) {
    relevantTargetAddr = proxyImplementationAddr;
  }

  const contractAbi = await rfw(getContractAbi)(relevantTargetAddr, scanApiUrl);

  if (!contractAbi) {
    console.warn(`Failed to get abi for ${targetAddr}`);
    return null;
  }

  const abiMethodsExtended = extendAbiMethodsWithMeta(contractAbi);

  const bytesData = ethers.utils.arrayify(callData);

  const targetDataParams = ethers.utils.hexDataSlice(bytesData, 4);
  const targetMethodID = ethers.utils.hexDataSlice(bytesData, 0, 4);

  const method = abiMethodsExtended.find((method) => method.signatureHash.includes(targetMethodID));

  if (!method) {
    console.warn(`Failed to find method for ${targetAddr} with methodID ${targetMethodID}`);
    return null;
  }

  // types kinda broken in ethers decode, so we need to cast it
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  method.decodedParams = <GovernanceProposalsDecodedData['decodedParams']>ethers.utils.defaultAbiCoder.decode(
    method.inputs.map((input) => input.type),
    targetDataParams,
  );

  return {
    name: method.name,
    signatureHash: method.signatureHash,
    inputTypes: method.inputs,
    decodedParams: method.decodedParams,
  };
}
