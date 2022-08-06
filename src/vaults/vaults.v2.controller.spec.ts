import { DataMapper, QueryIterator, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import BadgerSDK, { ONE_DAY_MS, TokenValue, VaultDTO } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';
import { BadRequest } from '@tsed/exceptions';
import createMockInstance from 'jest-create-mock-instance';
import SuperTest from 'supertest';

import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { VaultPendingHarvestData } from '../aws/models/vault-pending-harvest.model';
import { YieldSource } from '../aws/models/yield-source.model';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { SourceType } from '../rewards/enums/source-type.enum';
import { Server } from '../Server';
import { mockChainVaults } from '../test/tests.utils';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import * as tokensUtils from '../tokens/tokens.utils';
import { mockBalance } from '../tokens/tokens.utils';
import { vaultsHarvestsMapMock } from './mocks/vaults-harvests-map.mock';
import * as vaultsUtils from './vaults.utils';

const TEST_VAULT = TOKENS.BCRV_SBTC;

export function setupDdbHarvests() {
  mockChainVaults();
  jest.spyOn(BadgerSDK.prototype, 'ready').mockImplementation();

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
  mockChainVaults();
  jest.spyOn(tokensUtils, 'getFullToken').mockImplementation(async (_, tokenAddr) => {
    return fullTokenMockMap[tokenAddr] || fullTokenMockMap[TOKENS.BADGER];
  });
  const baseTime = 1656606946;
  jest.spyOn(Date, 'now').mockImplementation(() => baseTime * 1000 + ONE_DAY_MS * 14);
  jest.spyOn(vaultsUtils, 'getVaultPendingHarvest').mockImplementation(
    async (vaultDefinition: VaultDefinitionModel): Promise<VaultPendingHarvestData> => ({
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
  jest
    .spyOn(vaultsUtils, 'getCachedVault')
    .mockImplementation(async (chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<VaultDTO> => {
      const vault = await vaultsUtils.defaultVault(chain, vaultDefinition);
      vault.value = parseInt(vaultDefinition.address.slice(0, 7), 16);
      vault.balance = 10;
      return vault;
    });
  jest
    .spyOn(vaultsUtils, 'getVaultYieldSources')
    .mockImplementation(async (vault: VaultDefinitionModel): Promise<YieldSource[]> => {
      const performance = parseInt(vault.address.slice(0, 5), 16) / 100;
      const underlying = vaultsUtils.createYieldSource(
        vault.address,
        SourceType.Compound,
        vaultsUtils.VAULT_SOURCE,
        performance,
      );
      const badger = vaultsUtils.createYieldSource(vault.address, SourceType.Emission, 'Badger Rewards', performance);
      const fees = vaultsUtils.createYieldSource(vault.address, SourceType.TradeFee, 'Curve LP Fees', performance);
      return [underlying, badger, fees];
    });
  jest
    .spyOn(tokensUtils, 'getVaultTokens')
    .mockImplementation(async (_chain: Chain, vault: VaultDTO, _currency?: string): Promise<TokenValue[]> => {
      const token = fullTokenMockMap[vault.underlyingToken] || fullTokenMockMap[TOKENS.BADGER];
      if (token.lpToken) {
        const bal0 = parseInt(token.address.slice(0, 4), 16);
        const bal1 = parseInt(token.address.slice(0, 6), 16);
        return [mockBalance(token, bal0), mockBalance(token, bal1)];
      }
      return [mockBalance(token, parseInt(token.address.slice(0, 4), 16))];
    });
}

describe('VaultsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(PlatformTest.bootstrap(Server));
  beforeAll(async () => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe('GET /v2/vaults', () => {
    describe('with no specified chain', () => {
      it('returns eth vaults', async (done: jest.DoneCallback) => {
        setupTestVault();
        const { body } = await request.get('/v2/vaults').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });

    describe('with a specified chain', () => {
      it('returns the vaults for eth', async (done: jest.DoneCallback) => {
        setupTestVault();
        const { body } = await request.get('/v2/vaults?chain=ethereum').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });

      it('returns the vaults for bsc', async (done: jest.DoneCallback) => {
        setupTestVault();
        const { body } = await request.get('/v2/vaults?chain=binancesmartchain').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });

    describe('with an invalid specified chain', () => {
      it('returns a 400', async (done: jest.DoneCallback) => {
        const { body } = await request.get('/v2/vaults?chain=invalid').expect(BadRequest.STATUS);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });

  describe('GET /v2/harvests', () => {
    beforeEach(setupDdbHarvests);

    describe('success cases', () => {
      it('Return extended harvest for chain vaults', async (done: jest.DoneCallback) => {
        const { body } = await request.get('/v2/vaults/harvests').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });
    describe('error cases', () => {
      it('returns a 400 for invalide chain', async (done: jest.DoneCallback) => {
        const { body } = await request.get('/v2/vaults/harvests?chain=invalid').expect(BadRequest.STATUS);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });

  describe('GET /v2/harvests/:vault', () => {
    beforeEach(setupDdbHarvests);

    describe('success cases', () => {
      it('Return extended harvests for chain vault by addr', async (done: jest.DoneCallback) => {
        const { body } = await request.get(`/v2/vaults/harvests/${TEST_VAULT}`).expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });
    describe('error cases', () => {
      it('returns a 400 for invalide chain', async (done: jest.DoneCallback) => {
        const { body } = await request.get(`/v2/vaults/harvests/${TEST_VAULT}?chain=invalid`).expect(BadRequest.STATUS);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });
});
