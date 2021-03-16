import { BadRequest } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { Token } from '../interface/Token';
import { PriceUpdateRequest } from '../prices/prices-util';
import { ethTokens } from './config/eth-tokens';

export const protocolTokens = [...ethTokens];

export const getPriceUpdateRequest = (...tokens: Token[]): PriceUpdateRequest => {
  const request: PriceUpdateRequest = {};
  tokens.forEach((token) => (request[ethers.utils.getAddress(token.address)] = token.price));
  return request;
};

export const getToken = (contract: string): Token => {
  const checksummedAddress = ethers.utils.getAddress(contract);
  const token = protocolTokens.find((token) => ethers.utils.getAddress(token.address) === checksummedAddress);
  if (!token) {
    throw new BadRequest(`${contract} not supported`);
  }
  return token;
};
