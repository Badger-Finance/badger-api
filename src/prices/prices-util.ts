import { BadRequest, UnprocessableEntity } from '@tsed/exceptions';
import { DocumentClient, PutItemOutput, QueryInput } from 'aws-sdk/clients/dynamodb';
import { ethers } from 'ethers';
import { getItems, saveItem } from '../aws/dynamodb-utils';
import { PRICE_DATA } from '../config/constants';
import { TokenPrice, TokenPriceSnapshot } from '../interface/TokenPrice';
import { protocolTokens } from '../tokens/tokens-util';
import AttributeValue = DocumentClient.AttributeValue;

export type PricingFunction = () => Promise<TokenPrice>;
export interface PriceUpdateRequest {
  [contract: string]: PricingFunction;
}

export const updatePrice = async (contract: string, getPrice: PricingFunction): Promise<PutItemOutput> => {
  const checksumContract = ethers.utils.getAddress(contract);
  const token = protocolTokens.find((token) => ethers.utils.getAddress(token.address) === checksumContract);
  if (!token) {
    throw new BadRequest(`${contract} not supported for pricing`);
  }
  const tokenPriceData = await getPrice();
  tokenPriceData.name = token.name;
  tokenPriceData.address = checksumContract;
  const tokenPriceSnapshot: TokenPriceSnapshot = {
    ...tokenPriceData,
    updatedAt: Date.now(),
  };
  return saveItem(PRICE_DATA, tokenPriceSnapshot);
};

export const updatePrices = async (request: PriceUpdateRequest): Promise<PutItemOutput[]> => {
  return Promise.all(Object.keys(request).map((contract) => updatePrice(contract, request[contract])));
};

export const getPrice = async (contract: string): Promise<TokenPriceSnapshot> => {
  const checksumContract: AttributeValue = ethers.utils.getAddress(contract);
  const params: QueryInput = {
    TableName: PRICE_DATA,
    KeyConditionExpression: 'address = :address',
    ExpressionAttributeValues: {
      ':address': checksumContract,
    },
    Limit: 1,
    ScanIndexForward: false,
  };
  const prices = await getItems<TokenPriceSnapshot>(params);
  if (!prices || prices.length !== 1) {
    throw new UnprocessableEntity(`Unable to price ${contract}`);
  }
  return prices[0];
};
