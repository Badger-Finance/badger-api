import { DataMapper, QueryIterator, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import { ONE_DAY_MS, TokenValue, VaultYieldProjectionV3 } from '@badger-dao/sdk';
import { BadRequest } from '@tsed/exceptions';
import { PlatformServerless } from '@tsed/platform-serverless';
import { PlatformServerlessTest } from '@tsed/platform-serverless-testing';
import createMockInstance from 'jest-create-mock-instance';

import { Vaultish } from '../aws/interfaces/vaultish.interface';
import { CachedYieldSource } from '../aws/models/cached-yield-source.interface';
import { CurrentVaultSnapshotModel } from '../aws/models/current-vault-snapshot.model';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { YieldEstimate } from '../aws/models/yield-estimate.model';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { SourceType } from '../rewards/enums/source-type.enum';
import { MOCK_VAULT_SNAPSHOT, MOCK_VAULTS, TEST_ADDR } from '../test/constants';
import { mockBalance, setupMockChain } from '../test/mocks.utils';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import * as tokensUtils from '../tokens/tokens.utils';
import { vaultsHarvestsMapMock } from './mocks/vaults-harvests-map.mock';
import { VAULT_SOURCE } from './vaults.config';
import * as vaultsUtils from './vaults.utils';
import { VaultsV2Controller } from './vaults.v2.controller';
import { createYieldSource } from './yields.utils';

export function setupDdbHarvests() {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  jest.spyOn(DataMapper.prototype, 'query').mockImplementation((_model, _condition) => {
    // @ts-ignore
    const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);
    // @ts-ignore
    qi[Symbol.iterator] = jest.fn(() => {
      return (vaultsHarvestsMapMock[_condition.vault] || []).values();
    });

    return qi;
  });
  /* eslint-enable @typescript-eslint/ban-ts-comment */
}

export function setupTestVault() {
  jest.spyOn(tokensUtils, 'getFullToken').mockImplementation(async (_, tokenAddr) => {
    return fullTokenMockMap[tokenAddr] || fullTokenMockMap[TOKENS.BADGER];
  });
  const baseTime = 1656606946;
  jest.spyOn(Date, 'now').mockImplementation(() => baseTime * 1000 + ONE_DAY_MS * 14);
  jest.spyOn(vaultsUtils, 'queryYieldEstimate').mockImplementation(
    async (vaultDefinition: VaultDefinitionModel): Promise<YieldEstimate> => ({
      vault: vaultDefinition.address,
      yieldTokens: [mockBalance(fullTokenMockMap[TOKENS.CVX], 10)],
      harvestTokens: [mockBalance(fullTokenMockMap[TOKENS.CVX], 10)],
      lastHarvestedAt: baseTime,
      lastMeasuredAt: baseTime,
      previousYieldTokens: [mockBalance(fullTokenMockMap[TOKENS.CVX], 10)],
      previousHarvestTokens: [mockBalance(fullTokenMockMap[TOKENS.CVX], 10)],
      duration: 60000,
      lastReportedAt: 0,
    }),
  );
  jest.spyOn(vaultsUtils, 'queryYieldProjection').mockImplementation(async () => {
    const baseProjection: VaultYieldProjectionV3 = JSON.parse(JSON.stringify(MOCK_VAULTS[14].yieldProjection));
    baseProjection.nonHarvestSources = MOCK_VAULTS[14].yieldProjection.nonHarvestSources.map((s) => ({
      ...s,
      performance: {
        baseYield: s.apr,
        minYield: s.minApr,
        maxYield: s.maxApr,
        grossYield: s.apr,
        minGrossYield: s.minApr,
        maxGrossYield: s.maxApr,
      },
    }));
    baseProjection.nonHarvestSourcesApy = MOCK_VAULTS[14].yieldProjection.nonHarvestSourcesApy.map((s) => ({
      ...s,
      performance: {
        baseYield: s.apr,
        minYield: s.minApr,
        maxYield: s.maxApr,
        grossYield: s.apr,
        minGrossYield: s.minApr,
        maxGrossYield: s.maxApr,
      },
    }));
    return baseProjection;
  });
  jest
    .spyOn(vaultsUtils, 'getCachedVault')
    .mockImplementation(
      async (_c: Chain, _v: VaultDefinitionModel) => MOCK_VAULT_SNAPSHOT as CurrentVaultSnapshotModel,
    );
  jest
    .spyOn(vaultsUtils, 'queryYieldSources')
    .mockImplementation(async (vault: VaultDefinitionModel): Promise<CachedYieldSource[]> => {
      const performance = parseInt(vault.address.slice(0, 5), 16) / 100;
      const underlying = createYieldSource(vault, SourceType.Compound, VAULT_SOURCE, performance);
      const badger = createYieldSource(vault, SourceType.Emission, 'Badger Rewards', performance);
      const fees = createYieldSource(vault, SourceType.TradeFee, 'Curve LP Fees', performance);
      return [underlying, badger, fees];
    });
  jest
    .spyOn(tokensUtils, 'getVaultTokens')
    .mockImplementation(async (_chain: Chain, _vault: Vaultish, _currency?: string): Promise<TokenValue[]> => {
      const token = fullTokenMockMap[TOKENS.BADGER];
      if (token.lpToken) {
        const bal0 = parseInt(token.address.slice(0, 4), 16);
        const bal1 = parseInt(token.address.slice(0, 6), 16);
        return [mockBalance(token, bal0), mockBalance(token, bal1)];
      }
      return [mockBalance(token, parseInt(token.address.slice(0, 4), 16))];
    });
}

describe('vaults.v2.controller', () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [VaultsV2Controller],
    }),
  );
  afterEach(() => PlatformServerlessTest.reset());

  beforeEach(() => setupMockChain());

  describe('GET /vaults', () => {
    describe('with no specified chain', () => {
      it('returns eth vaults', async () => {
        setupTestVault();
        const { body, statusCode } = await PlatformServerlessTest.request.get('/vaults');
        expect(statusCode).toEqual(200);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('with a specified chain', () => {
      it('returns the vaults for eth', async () => {
        setupTestVault();
        const { body, statusCode } = await PlatformServerlessTest.request.get('/vaults?chain=ethereum');

        expect(statusCode).toEqual(200);
        expect(JSON.parse(body)).toMatchSnapshot();
      });

      it('returns the vaults for bsc', async () => {
        setupTestVault();
        const { body, statusCode } = await PlatformServerlessTest.request.get('/vaults?chain=binancesmartchain');
        expect(statusCode).toEqual(200);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('with an invalid specified chain', () => {
      it('returns a 400', async () => {
        jest.spyOn(Chain, 'getChain').mockImplementation(() => {
          throw new BadRequest(`invalid is not a supported chain`);
        });
        const { body, statusCode } = await PlatformServerlessTest.request.get('/vaults').query({ chain: 'invalid' });
        expect(statusCode).toEqual(BadRequest.STATUS);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });

  describe('GET /harvests', () => {
    beforeEach(setupDdbHarvests);

    describe('success cases', () => {
      it('Return extended harvest for chain vaults', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request.get('/vaults/harvests');
        expect(statusCode).toEqual(200);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('error cases', () => {
      it('returns a 400 for invalide chain', async () => {
        jest.spyOn(Chain, 'getChain').mockImplementation(() => {
          throw new BadRequest(`invalid is not a supported chain`);
        });
        const { body, statusCode } = await PlatformServerlessTest.request
          .get('/vaults/harvests')
          .query({ chain: 'invalid' });
        expect(statusCode).toEqual(BadRequest.STATUS);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });

  describe('GET /harvests/:vault', () => {
    beforeEach(setupDdbHarvests);

    describe('success cases', () => {
      it('Return extended harvests for chain vault by addr', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request.get(`/vaults/harvests/${TEST_ADDR}`);
        expect(statusCode).toEqual(200);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
    describe('error cases', () => {
      it('returns a 400 for invalide chain', async () => {
        jest.spyOn(Chain, 'getChain').mockImplementation(() => {
          throw new BadRequest(`invalid is not a supported chain`);
        });
        const { body, statusCode } = await PlatformServerlessTest.request
          .get(`/vaults/harvests/${TEST_ADDR}`)
          .query({ chain: 'invalid' });
        expect(statusCode).toEqual(BadRequest.STATUS);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });
});
