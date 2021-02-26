import AWS from 'aws-sdk';
import { PutItemInput, QueryInput } from 'aws-sdk/clients/dynamodb';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import fetch from 'node-fetch';
import { Block } from '@ethersproject/abstract-provider';
import { DataData } from '../protocol/performance/handler';

import { BADGER_URL, MASTERCHEF_URL, SUSHISWAP_URL, TOKENS, UNISWAP_URL, ETHERS_JSONRPC_PROVIDER } from './constants';
import AttributeValue = DocumentClient.AttributeValue;

export const THIRTY_MIN_BLOCKS = parseInt(String((30 * 60) / 13));
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

// eslint-disable-next-line autofix/no-unused-vars
export type GetPriceFunc = (settData: SettData) => Promise<number>;

export interface EventInput {
	asset: string;
	createdBlock: number;
	contract: string;
	token?: string;
	source?: string;
	pathParameters?: Record<string, string>;
	queryStringParameters?: Record<string, string>;
}

export type SettData = {
	data: {
		sett: {
			token: { id: string };
			balance: number;
			pricePerFullShare: number;
			totalSupply: number;
		};
	};
	errors?: unknown;
};

export const respond = (statusCode: number, body?: Record<string, unknown> | Record<string, unknown>[]) => {
	return {
		statusCode: statusCode,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'OPTIONS,GET',
			'Access-Control-Allow-Headers': 'Content-Type',
		},
		...(body && { body: JSON.stringify(body) }),
	};
};

export const getBlock = async (blockNumber: number): Promise<Block> =>
	await ETHERS_JSONRPC_PROVIDER.getBlock(blockNumber);

export const saveItem = async (table: string, item: AttributeValue) => {
	const params = {
		TableName: table,
		Item: item,
	} as PutItemInput;
	return await ddb.put(params).promise();
};

export const getAssetData = async (
	table: string,
	asset: AttributeValue,
	count: number | null,
): Promise<DataData | undefined> => {
	let params = {
		TableName: table,
		KeyConditionExpression: 'asset = :asset',
		ExpressionAttributeValues: {
			':asset': asset,
		},
	} as QueryInput;

	if (count) {
		params = {
			...params,
			Limit: count,
			ScanIndexForward: false,
		};
	}

	const data = await ddb.query(params).promise();
	return count && data.Items ? (data.Items.reverse() as DataData) : (data.Items as DataData);
};

export const getIndexedBlock = async (table: string, asset: AttributeValue, createdBlock: number): Promise<number> => {
	const params = {
		TableName: table,
		KeyConditionExpression: 'asset = :asset',
		ExpressionAttributeValues: {
			':asset': asset,
		},
		ScanIndexForward: false,
		Limit: 1,
	};
	const result = await ddb.query(params).promise();
	return result.Items && result.Items.length > 0 ? result.Items[0].height : createdBlock;
};

export const getContractPrice = async (contract: string) => {
	return await fetch(
		`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contract}&vs_currencies=usd`,
	)
		.then((response) => response.json())
		.then((json) => {
			if (json[contract] && json[contract].usd) {
				return json[contract].usd;
			}
			return 0;
		});
};

export const getTokenPrice = async (token: string) => {
	return await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`)
		.then((response) => response.json())
		.then((json) => json[token].usd);
};

export const getSett = async (contract: string, block?: number): Promise<SettData> => {
	const query = `
    {
      sett(id: "${contract}"${block ? `, block: {number: ${block}}` : ''}) {
        token {
          id
        }
        balance
        pricePerFullShare
        totalSupply
      }
    }
  `;
	return await fetch(BADGER_URL, {
		method: 'POST',
		body: JSON.stringify({ query }),
	}).then((response) => response.json());
};

export type Geyser = {
	id: string;
	stakingToken: {
		id: string;
	};
	netShareDeposit: string;
	badgerCycleDuration: string;
	badgerCycleRewardTokens: string;
	diggCycleDuration: string;
	diggCycleRewardTokens: string;
};

export type GeyserSett = {
	id: string;
	token: { id: string };
	balance: number;
	netDeposit: string;
	netShareDeposit: string;
	pricePerFullShare: number;
};

export type Geysers = {
	data: {
		geysers: Geyser[];
		setts: GeyserSett[];
	};
};

export const getGeysers = async (): Promise<Geysers> => {
	const query = `
    {
      geysers(orderDirection: asc) {
        id
        stakingToken {
          id
        }
        netShareDeposit
        badgerCycleDuration
        badgerCycleRewardTokens
        diggCycleDuration
        diggCycleRewardTokens
      },
      setts(orderDirection: asc) {
        id
        token {
          id
        }
        balance
        netDeposit
        netShareDeposit
        pricePerFullShare
      }
    }
  `;
	return await fetch(BADGER_URL, {
		method: 'POST',
		body: JSON.stringify({ query }),
	}).then((response) => response.json());
};

export const getUniswapPair = async (token: string, block?: number) => {
	const query = `
    {
      pair(id: "${token}"${block ? `, block: {number: ${block}}` : ''}) {
        reserve0
        reserve1
        token0 {
          id
        }
        token1 {
          id
        }
        totalSupply
      }
    }
  `;
	return await fetch(UNISWAP_URL, {
		method: 'POST',
		body: JSON.stringify({ query }),
	}).then((response) => response.json());
};

export const getUniswapPrice = async (token: string) => {
	const pair = (await getUniswapPair(token)).data.pair;
	if (pair.totalSupply === 0) {
		return 0;
	}
	const token0Price = await getContractPrice(pair.token0.id);
	const token1Price = await getContractPrice(pair.token1.id);
	return (token0Price * pair.reserve0 + token1Price * pair.reserve1) / pair.totalSupply;
};

export const getSushiswapPair = async (token: string, block?: number) => {
	const query = `
    {
      pair(id: "${token}"${block ? `, block: {number: ${block}}` : ''}) {
        reserve0
        reserve1
        token0 {
          id
        }
        token1 {
          id
        }
        totalSupply
      }
    }
  `;
	return await fetch(SUSHISWAP_URL, {
		method: 'POST',
		body: JSON.stringify({ query }),
	}).then((response) => response.json());
};

export const getSushiswapPrice = async (token: string) => {
	const pair = (await getSushiswapPair(token)).data.pair;
	if (pair.totalSupply === 0) {
		return 0;
	}
	const token0Price = await getContractPrice(pair.token0.id);
	const token1Price = await getContractPrice(pair.token1.id);
	return (token0Price * pair.reserve0 + token1Price * pair.reserve1) / pair.totalSupply;
};

export const getPrices = async () => {
	const prices = await Promise.all([
		getTokenPrice('tbtc'),
		getContractPrice(TOKENS.SBTC),
		getContractPrice(TOKENS.RENBTC),
		getContractPrice(TOKENS.BADGER),
		getUniswapPrice(TOKENS.UNI_BADGER),
		getSushiswapPrice(TOKENS.SUSHI_BADGER),
		getSushiswapPrice(TOKENS.SUSHI_WBTC),
		getTokenPrice('digg'),
		getUniswapPrice(TOKENS.UNI_DIGG),
		getSushiswapPrice(TOKENS.SUSHI_DIGG),
	]);
	return {
		tbtc: prices[0],
		sbtc: prices[1],
		renbtc: prices[2],
		badger: prices[3],
		unibadger: prices[4],
		sushibadger: prices[5],
		sushiwbtc: prices[6],
		digg: prices[7],
		unidigg: prices[8],
		sushidigg: prices[9],
	};
};

export const getUsdValue = (asset: string, tokens: number, prices: { [index: string]: number }) => {
	switch (asset) {
		case TOKENS.UNI_BADGER:
			return tokens * prices.unibadger;
		case TOKENS.BADGER:
			return tokens * prices.badger;
		case TOKENS.TBTC:
			return tokens * prices.tbtc;
		case TOKENS.SBTC:
			return tokens * prices.sbtc;
		case TOKENS.RENBTC:
			return tokens * prices.renbtc;
		case TOKENS.SUSHI_BADGER:
			return tokens * prices.sushibadger;
		case TOKENS.SUSHI_WBTC:
			return tokens * prices.sushiwbtc;
		case TOKENS.DIGG:
			return tokens * prices.digg;
		case TOKENS.UNI_DIGG:
			return tokens * prices.unidigg;
		case TOKENS.SUSHI_DIGG:
			return tokens * prices.sushidigg;
		default:
			return 0;
	}
};

export type MasterChefData = {
	data: {
		masterChefs: {
			id: string;
			totalAllocPoint: number;
			sushiPerBlock: number;
		}[];
		pools: {
			id: string;
			pair: string;
			balance: number;
			allocPoint: number;
			lasatRewardBlock: string;
			accSushiPerShare: string;
		}[];
	};
};

export const getMasterChef = async (): Promise<MasterChefData> => {
	const query = `
    {
      masterChefs(first: 1) {
        id
        totalAllocPoint
        sushiPerBlock
      },
      pools(where: {allocPoint_gt: 0}, orderBy: allocPoint, orderDirection: desc) {
        id
        pair
        balance
        allocPoint
        lastRewardBlock
        accSushiPerShare
      }
    }
  `;
	return await fetch(MASTERCHEF_URL, {
		method: 'POST',
		body: JSON.stringify({ query }),
	}).then((response) => response.json());
};
