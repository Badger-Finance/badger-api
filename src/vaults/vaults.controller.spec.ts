import { Vault } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';
import { BadRequest } from '@tsed/exceptions';
import SuperTest from 'supertest';
import { uniformPerformance } from '../protocols/interfaces/performance.interface';
import { createValueSource, ValueSource } from '../protocols/interfaces/value-source.interface';
import * as protocolsUtils from '../protocols/protocols.utils';
import { Server } from '../Server';
import * as settsUtils from './vaults.utils';
import { TokenBalance } from '../tokens/interfaces/token-balance.interface';
import * as tokensUtils from '../tokens/tokens.utils';
import { mockBalance } from '../tokens/tokens.utils';
import { VaultDefinition } from './interfaces/vault-definition.interface';

describe('SettsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(PlatformTest.bootstrap(Server));
  beforeAll(async () => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  const setupTest = (): void => {
    jest
      .spyOn(settsUtils, 'getCachedSett')
      .mockImplementation(
        async (VaultDefinition: VaultDefinition): Promise<Vault> => settsUtils.defaultVault(VaultDefinition),
      );
    jest
      .spyOn(protocolsUtils, 'getVaultValueSources')
      .mockImplementation(async (VaultDefinition: VaultDefinition): Promise<ValueSource[]> => {
        const performance = parseInt(VaultDefinition.settToken.slice(0, 5), 16) / 100;
        const underlying = createValueSource(settsUtils.VAULT_SOURCE, uniformPerformance(performance));
        const badger = createValueSource('Badger Rewards', uniformPerformance(performance));
        const digg = createValueSource('Digg Rewards', uniformPerformance(performance));
        const fees = createValueSource('Curve Trading Fees', uniformPerformance(performance));
        return [underlying, badger, digg, fees];
      });
    jest
      .spyOn(tokensUtils, 'getVaultTokens')
      .mockImplementation(
        async (sett: VaultDefinition, _balance: number, _currency?: string): Promise<TokenBalance[]> => {
          const token = tokensUtils.getToken(sett.depositToken);
          if (token.lpToken) {
            const bal0 = parseInt(token.address.slice(0, 4), 16);
            const bal1 = parseInt(token.address.slice(0, 6), 16);
            return [mockBalance(token, bal0), mockBalance(token, bal1)];
          }
          return [mockBalance(token, parseInt(token.address.slice(0, 4), 16))];
        },
      );
  };

  describe('GET /v2/setts', () => {
    describe('with no specified chain', () => {
      it('returns eth setts', async (done: jest.DoneCallback) => {
        setupTest();
        const { body } = await request.get('/v2/setts').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });

    describe('with a specified chain', () => {
      it('returns the setts for eth', async (done: jest.DoneCallback) => {
        setupTest();
        const { body } = await request.get('/v2/setts?chain=ethereum').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });

      it('returns the setts for bsc', async (done: jest.DoneCallback) => {
        setupTest();
        const { body } = await request.get('/v2/setts?chain=binancesmartchain').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });

    describe('with an invalid specified chain', () => {
      it('returns a 400', async (done: jest.DoneCallback) => {
        const { body } = await request.get('/v2/setts?chain=invalid').expect(BadRequest.STATUS);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });
});
