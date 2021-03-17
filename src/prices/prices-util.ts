import { BadRequest, UnprocessableEntity } from '@tsed/exceptions';
import { DocumentClient, PutItemOutput, QueryInput } from 'aws-sdk/clients/dynamodb';
import { ethers } from 'ethers';
import { getItems, saveItem } from '../aws/dynamodb-utils';
import { ChainStrategy } from '../chains/strategies/chain.strategy';
import { PRICE_DATA } from '../config/constants';
import { Token } from '../tokens/interfaces/token.interface';
import { TokenPrice, TokenPriceSnapshot } from '../tokens/interfaces/token-price.interface';
import { TokenConfig } from '../tokens/types/token-config.type';
import AttributeValue = DocumentClient.AttributeValue;

export type PricingFunction = (address: string) => Promise<TokenPrice>;
export interface PriceUpdateRequest {
  [contract: string]: PricingFunction;
}

export const updatePrice = async (token: Token): Promise<PutItemOutput> => {
  if (!token) {
    throw new BadRequest('Token not supported for pricing');
  }
  const { address, name } = token;
  const strategy = ChainStrategy.getStrategy(address);
  const tokenPriceData = await strategy.getPrice(address);
  tokenPriceData.name = name;
  tokenPriceData.address = address;
  const tokenPriceSnapshot: TokenPriceSnapshot = {
    ...tokenPriceData,
    updatedAt: Date.now(),
  };
  return saveItem(PRICE_DATA, tokenPriceSnapshot);
};

export const updatePrices = async (tokenConfig: TokenConfig): Promise<PutItemOutput[]> => {
  return Promise.all(Object.values(tokenConfig).map((token) => updatePrice(token)));
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
