import { ethers } from 'ethers';
import { RawAbiDefinition } from 'typechain/dist/parser/abiParser';

function getMethodSignature({ inputs, name }: RawAbiDefinition) {
  const params = inputs?.map((input) => input.type).join(',');

  return `${name}(${params})`;
}

function getSignatureHash(signature: string) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(signature)).toString();
}

function getMethodMeta(method: RawAbiDefinition) {
  const methodSignature = getMethodSignature(method);
  const signatureHash = getSignatureHash(methodSignature);

  return { methodSignature, signatureHash };
}

export function extendAbiMethodsWithMeta(abi: RawAbiDefinition[]) {
  const methods = abi.filter((method) => method.type === 'function');

  return methods.map((method) => ({
    ...getMethodMeta(method),
    ...method,
    decodedParams: [],
  }));
}
