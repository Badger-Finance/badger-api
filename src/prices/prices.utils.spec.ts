import { DataMapper } from '@aws/dynamodb-data-mapper';
import { BadRequest, NotFound } from '@tsed/exceptions';
import fetchMock from 'jest-fetch-mock';
import { dynamo } from '../aws/dynamodb.utils';
import { ChainStrategy } from '../chains/strategies/chain.strategy';
import { TestStrategy } from '../chains/strategies/test.strategy';
import { TOKENS } from '../config/constants';
import { TokenType } from '../tokens/enums/token-type.enum';
import { Token } from '../tokens/interfaces/token.interface';
import { PriceData, TokenPrice } from '../tokens/interfaces/token-price.interface';
import { TokenPriceSnapshot } from '../tokens/interfaces/token-price-snapshot.interface';
import { getToken, protocolTokens } from '../tokens/tokens-util';
import {
  getContractPrice,
  getPrice,
  getPriceData,
  getTokenPrice,
  getTokenPriceData,
  getVaultTokenPrice,
  inCurrency,
  noPrice,
  updatePrice,
  updatePrices,
} from './prices.utils';

describe('prices-util', () => {
  let testStrategy: ChainStrategy;

  const randomPrice = () => Math.random() * 100;
  const mapper = new DataMapper({ client: dynamo });

  beforeAll(async () => {
    const ethPrice = Math.max(1500, Math.random() * 3000);
    const priceData: PriceData = {};

    const badger = getToken(TOKENS.BADGER);
    const badgerUsd = randomPrice();
    const badgerPrice: TokenPrice = {
      name: badger.name,
      address: badger.address,
      usd: badgerUsd,
      eth: badgerUsd / ethPrice,
    };
    priceData[TOKENS.BADGER] = badgerPrice;

    const digg = getToken(TOKENS.DIGG);
    const diggUsd = randomPrice();
    const diggPrice: TokenPrice = {
      name: digg.name,
      address: digg.address,
      usd: diggUsd,
      eth: diggUsd / ethPrice,
    };
    priceData[TOKENS.DIGG] = diggPrice;

    testStrategy = new TestStrategy(priceData);
  });

  beforeEach(async () => {
    await mapper.deleteTable(TokenPriceSnapshot);
    await mapper.createTable(TokenPriceSnapshot, {readCapacityUnits: 1, writeCapacityUnits: 1});
    fetchMock.resetMocks();
  });

  describe('getPrice', () => {
    describe('when price is not available', () => {
      it('returns a price of 0', async () => {
        const cake = getToken(TOKENS.CAKE);
        const cakePrice = await getPrice(cake.address);
        expect(cakePrice).toBeDefined();
        const expected = noPrice(cake);
        expected.updatedAt = cakePrice.updatedAt;
        expect(cakePrice).toMatchObject(expected);
      });
    });

    describe('when price is available', () => {
      it('returns a token snapshot with the latest price data', async () => {
        const badgerPrice = await testStrategy.getPrice(TOKENS.BADGER);
        const price = Object.assign(new TokenPriceSnapshot(), badgerPrice);
        const snapshot = await mapper.put(price);
        const fetchedBadgerPrice = await getPrice(TOKENS.BADGER);
        expect(fetchedBadgerPrice).toBeDefined();
        expect(fetchedBadgerPrice).toMatchObject(snapshot);
      });
    });
  });

  describe('updatePrice', () => {
    describe('update unsupported token', () => {
      it('throws an bad request error', async () => {
        const unsupportedToken: Token = {
          name: 'Fake Token',
          symbol: 'FTK',
          address: '0xfA5047c9c78B8877af97BDcb85Db743fD7313d4a',
          decimals: 18,
          type: TokenType.Contract,
        };
        await expect(updatePrice(unsupportedToken)).rejects.toThrow(BadRequest);
      });
    });

    describe('update supported token', () => {
      it('creates an price db entry', async () => {
        const badger = getToken(TOKENS.BADGER);
        const noPrice = await getPrice(badger.address);
        const expected: TokenPriceSnapshot = {
          name: badger.name,
          address: badger.address,
          usd: 0,
          eth: 0,
          updatedAt: noPrice.updatedAt,
        };
        expect(noPrice).toMatchObject(expected);
        await updatePrice(badger);
        const badgerPrice = await getPrice(TOKENS.BADGER);
        expect(badgerPrice).toBeDefined();
        expect(badgerPrice.usd).toBeGreaterThan(0);
        expect(badgerPrice.eth).toBeGreaterThan(0);
      });
    });
  });

  describe('updatePrices', () => {
    describe('update unsupported token', () => {
      it('throws an bad request error', async () => {
        const unsupportedToken: Token = {
          name: 'Fake Token',
          symbol: 'FTK',
          address: '0xfA5047c9c78B8877af97BDcb85Db743fD7313d4a',
          decimals: 18,
          type: TokenType.Contract,
        };
        await expect(updatePrices({ [unsupportedToken.address]: unsupportedToken })).rejects.toThrow(BadRequest);
      });
    });

    describe('update a mix of unsupported and supported tokens', () => {
      it('throws a bad request error', async () => {
        const unsupportedToken: Token = {
          name: 'Fake Token',
          symbol: 'FTK',
          address: '0xfA5047c9c78B8877af97BDcb85Db743fD7313d4a',
          decimals: 18,
          type: TokenType.Contract,
        };
        const badgerToken = getToken(TOKENS.BADGER);
        const tokenConfig = {
          [unsupportedToken.address]: unsupportedToken,
          [TOKENS.BADGER]: badgerToken,
        };
        await expect(updatePrices(tokenConfig)).rejects.toThrow(BadRequest);
      });
    });

    describe('update supported tokens', () => {
      it('updates prices for all tokens requested', async () => {
        const digg = getToken(TOKENS.DIGG);
        const badger = getToken(TOKENS.BADGER);

        const noDigg = await getPrice(digg.address);
        const expectNoDigg = noPrice(digg);
        expectNoDigg.updatedAt = noDigg.updatedAt;
        expect(noDigg).toMatchObject(expectNoDigg);

        const noBadger = await getPrice(badger.address);
        const expectNoBadger = noPrice(badger);
        expectNoBadger.updatedAt = noBadger.updatedAt;
        expect(noBadger).toMatchObject(expectNoBadger);

        const tokenConfig = {
          [TOKENS.DIGG]: digg,
          [TOKENS.BADGER]: badger,
        };

        await updatePrices(tokenConfig);
        const diggPrice = await getPrice(digg.address);
        const expectedDigg = {
          ...(await testStrategy.getPrice(digg.address)),
          updatedAt: diggPrice.updatedAt,
        };
        expect(diggPrice).toMatchObject(expectedDigg);
        const badgerPrice = await getPrice(badger.address);
        const expectedBadger = {
          ...(await testStrategy.getPrice(badger.address)),
          updatedAt: badgerPrice.updatedAt,
        };
        expect(badgerPrice).toMatchObject(expectedBadger);
      });
    });
  });

  describe('getTokenPriceData', () => {
    describe('get unsupported token price', () => {
      it('throws a not found error', async () => {
        const unsupportedToken: Token = {
          name: 'Fake Token',
          symbol: 'FTK',
          address: '0xfA5047c9c78B8877af97BDcb85Db743fD7313d4a',
          decimals: 18,
          type: TokenType.Contract,
        };
        await expect(getTokenPriceData(unsupportedToken.address)).rejects.toThrow(NotFound);
      });
    });

    describe('get supported token price', () => {
      it('gets the latest price snapshot the from the db', async () => {
        await updatePrices(protocolTokens);
        const badgerToken = getToken(TOKENS.BADGER);
        const badgerPrice = await getPrice(badgerToken.address);
        const tokenPrice: TokenPrice = {
          name: badgerPrice.name,
          address: badgerPrice.address,
          usd: badgerPrice.usd,
          eth: badgerPrice.eth,
        };
        const badgerActualPrice = await getTokenPriceData(badgerToken.address);
        expect(badgerActualPrice).toMatchObject(tokenPrice);
      });
    });
  });

  describe('getPriceData', () => {
    it('gets all token pricing for the system', async () => {
      await updatePrices(protocolTokens);
      const priceData = await getPriceData(protocolTokens);
      for (const token of Object.keys(protocolTokens)) {
        const tokenPrice = getPrice(token);
        expect(priceData[token]).toMatchObject(tokenPrice);
      }
    });
  });

  describe('getContractPrice', () => {
    it('Fetches the contract price in USD and ETH', async () => {
      const contract = '0x3472A5A71965499acd81997a54BBA8D852C6E53d';
      const usdPrice = Math.random() * 100;
      const etherPrice = usdPrice / 1500;
      const mockResponse = {
        '0x3472a5a71965499acd81997a54bba8d852c6e53d': {
          usd: usdPrice,
          eth: etherPrice,
        },
      };
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const response = await getContractPrice(contract);

      expect(fetchMock).toHaveBeenCalled();
      expect(response).toBeDefined();
      expect(response).toMatchObject({
        address: contract,
        usd: usdPrice,
        eth: etherPrice,
      });
    });
  });

  describe('getTokenPrice', () => {
    it('Fetches the token price in USD and ETH', async () => {
      const token = 'Badger';
      const usdPrice = Math.random() * 100;
      const etherPrice = usdPrice / 1500;
      const mockResponse = {
        Badger: {
          usd: usdPrice,
          eth: etherPrice,
        },
      };
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const response = await getTokenPrice(token);

      expect(fetchMock).toHaveBeenCalled();
      expect(response).toBeDefined();
      expect(response).toMatchObject({
        name: token,
        usd: usdPrice,
        eth: etherPrice,
      });
    });
  });

  describe('inCurrency', () => {
    const priceData: TokenPrice = {
      name: 'Test',
      address: '0x0',
      usd: 10,
      eth: 10 / 1500,
    };

    describe('without a currency', () => {
      it('returns the usd price', () => {
        const defaultPrice = inCurrency(priceData);
        expect(defaultPrice).toEqual(priceData.usd);
      });
    });

    describe('with usd selected', () => {
      it('returns the usd price', () => {
        const defaultPrice = inCurrency(priceData, 'usd');
        expect(defaultPrice).toEqual(priceData.usd);
      });
    });

    describe('with eth selected', () => {
      it('returns the eth price', () => {
        const ethPrice = inCurrency(priceData, 'eth');
        expect(ethPrice).toEqual(priceData.eth);
      });
    });

    describe('with an unsupported currency', () => {
      it('returns the usd price', () => {
        const ethPrice = inCurrency(priceData, 'bchabc');
        expect(ethPrice).toEqual(priceData.usd);
      });
    });
  });

  describe('getVaultTokenPrice', () => {
    describe('look up non vault token price', () => {
      it('throws a bad request error', async () => {
        await updatePrices(protocolTokens);
        await expect(getVaultTokenPrice(TOKENS.BADGER)).rejects.toThrow(BadRequest);
      });
    });
  });
});
