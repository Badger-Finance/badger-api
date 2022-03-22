import { VaultDTO } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';
import { BadRequest } from '@tsed/exceptions';
import SuperTest from 'supertest';
import { createValueSource } from '../protocols/interfaces/value-source.interface';
import { Server } from '../Server';
import * as vaultsUtils from './vaults.utils';
import { TokenBalance } from '../tokens/interfaces/token-balance.interface';
import * as tokensUtils from '../tokens/tokens.utils';
import { mockBalance } from '../tokens/tokens.utils';
import { VaultDefinition } from './interfaces/vault-definition.interface';
import { CachedValueSource } from '../protocols/interfaces/cached-value-source.interface';
import { valueSourceToCachedValueSource } from '../rewards/rewards.utils';
import { SourceType } from '../rewards/enums/source-type.enum';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import * as tokenUtils from '../tokens/tokens.utils';
import { TOKENS } from '../config/tokens.config';
import { VaultPendingHarvestData } from './types/vault-pending-harvest-data';

describe('VaultsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(PlatformTest.bootstrap(Server));
  beforeAll(async () => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  const setupTest = (): void => {
    jest.spyOn(tokenUtils, 'getFullToken').mockImplementation(async (_, tokenAddr) => {
      return fullTokenMockMap[tokenAddr] || fullTokenMockMap[TOKENS.BADGER];
    });
    jest.spyOn(vaultsUtils, 'getVaultPendingHarvest').mockImplementation(
      async (vaultDefinition: VaultDefinition): Promise<VaultPendingHarvestData> => ({
        vault: vaultDefinition.vaultToken,
        yieldTokens: [],
        harvestTokens: [],
        lastHarvestedAt: 1048968337,
      }),
    );
    jest
      .spyOn(vaultsUtils, 'getCachedVault')
      .mockImplementation(async (chain, vaultDefinition: VaultDefinition): Promise<VaultDTO> => {
        const vault = await vaultsUtils.defaultVault(chain, vaultDefinition);
        vault.value = parseInt(vaultDefinition.vaultToken.slice(0, 7), 16);
        return vault;
      });
    jest
      .spyOn(vaultsUtils, 'getVaultCachedValueSources')
      .mockImplementation(async (vaultDefinition: VaultDefinition): Promise<CachedValueSource[]> => {
        const performance = parseInt(vaultDefinition.vaultToken.slice(0, 5), 16) / 100;
        const underlying = createValueSource(vaultsUtils.VAULT_SOURCE, performance);
        const badger = createValueSource('Badger Rewards', performance);
        const digg = createValueSource('Digg Rewards', performance);
        const fees = createValueSource('Curve Trading Fees', performance);
        return [
          valueSourceToCachedValueSource(underlying, vaultDefinition, SourceType.Compound),
          valueSourceToCachedValueSource(badger, vaultDefinition, SourceType.Emission),
          valueSourceToCachedValueSource(digg, vaultDefinition, SourceType.Emission),
          valueSourceToCachedValueSource(fees, vaultDefinition, SourceType.TradeFee),
        ];
      });
    jest
      .spyOn(tokensUtils, 'getVaultTokens')
      .mockImplementation(
        async (chain, sett: VaultDefinition, _balance: number, _currency?: string): Promise<TokenBalance[]> => {
          const token = fullTokenMockMap[sett.depositToken] || fullTokenMockMap[TOKENS.BADGER];
          if (token.lpToken) {
            const bal0 = parseInt(token.address.slice(0, 4), 16);
            const bal1 = parseInt(token.address.slice(0, 6), 16);
            return [mockBalance(token, bal0), mockBalance(token, bal1)];
          }
          return [mockBalance(token, parseInt(token.address.slice(0, 4), 16))];
        },
      );
  };

  describe('GET /v2/vaults', () => {
    describe('with no specified chain', () => {
      it('returns eth vaults', async (done: jest.DoneCallback) => {
        setupTest();
        const { body } = await request.get('/v2/vaults').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });

    describe('with a specified chain', () => {
      it('returns the vaults for eth', async (done: jest.DoneCallback) => {
        setupTest();
        const { body } = await request.get('/v2/vaults?chain=ethereum').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });

      it('returns the vaults for bsc', async (done: jest.DoneCallback) => {
        setupTest();
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
});
