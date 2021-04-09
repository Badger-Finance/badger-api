import { NotFound } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { bscTokensConfig } from './config/bsc-tokens.config';
import { ethTokensConfig } from './config/eth-tokens.config';
import { Token } from './interfaces/token.interface';

export const protocolTokens = { ...ethTokensConfig, ...bscTokensConfig };

export const getToken = (contract: string): Token => {
  const checksummedAddress = ethers.utils.getAddress(contract);
  const token = protocolTokens[checksummedAddress];
  if (!token) {
    throw new NotFound(`${contract} not supported`);
  }
  return token;
};

export const getTokenByName = (name: string): Token => {
  const searchName = name.toLowerCase();
  const token = Object.values(protocolTokens).find(
    (token) => token.name.toLowerCase() === searchName || token.lookupName?.toLowerCase() === searchName,
  );
  if (!token) {
    throw new NotFound(`${name} not supported`);
  }
  return token;
};
