import { UnprocessableEntity } from '@tsed/exceptions';
import { QueryInput } from 'aws-sdk/clients/dynamodb';
import { ethers } from 'ethers';
import { getItem, saveItem } from '../aws/dynamodb-utils';
import { PRICE_DATA } from '../config/constants';
import { TokenPrice, TokenPriceSnapshot, TokenSnapshot } from '../interface/TokenPrice';

export type PricingFunction = () => Promise<TokenPrice>;
export interface PriceUpdateRequest {
  [contract: string]: PricingFunction;
}

export const updatePrice = async (contract: string, getPrice: PricingFunction): Promise<void> => {
  const checksumContract = ethers.utils.getAddress(contract);
  const tokenPriceData = await getPrice();
  tokenPriceData.address = checksumContract;
  const tokenPriceSnapshot: TokenPriceSnapshot = {
    ...tokenPriceData,
    updatedAt: Date.now(),
  };
  const tokenSnapshot = new TokenSnapshot(tokenPriceSnapshot).toAttributeMap();
  await saveItem(PRICE_DATA, tokenSnapshot);
};

export const updatePrices = async (request: PriceUpdateRequest): Promise<void> => {
  await Promise.all(Object.keys(request).map((contract) => updatePrice(contract, request[contract])));
};

export const getPrice = async (contract: string): Promise<TokenSnapshot> => {
  const params: QueryInput = {
    TableName: PRICE_DATA,
    KeyConditionExpression: 'contract = :contract',
    ExpressionAttributeValues: {
      ':contract': {
        S: contract,
      },
    },
    Limit: 1,
    ScanIndexForward: false,
  };
  const price = await getItem(params);
  if (!price) {
    throw new UnprocessableEntity(`Unable to price ${contract}`);
  }
  return TokenSnapshot.fromAtrributeMap(price[0]);
};
