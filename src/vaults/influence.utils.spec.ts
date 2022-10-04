import { formatBalance, Vault, Vault__factory, VaultsService, YieldType } from '@badger-dao/sdk';
import { ethers } from 'ethers';
import { mock, MockProxy } from 'jest-mock-extended';

import { getVaultEntityId } from '../aws/dynamodb.utils';
import { VaultYieldEvent } from '../aws/models/vault-yield-event.model';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { CvxLocker, CvxLocker__factory } from '../contracts';
import * as balanceStrategy from '../protocols/strategies/balancer.strategy';
import { MOCK_TOKENS, MOCK_VAULT_DEFINITION, MOCK_YIELD_EVENTS, TEST_CURRENT_BLOCK } from '../test/constants';
import { mockBalance, setupMockChain } from '../test/mocks.utils';
import { filterPerformanceItems, getVaultHarvestBalance, isInfluenceVault } from './influence.utils';

describe('influence.utils', () => {
  let chain: Chain;
  let vaultYieldEvents: VaultYieldEvent[];

  beforeEach(() => {
    chain = setupMockChain();
    const baseEvents = MOCK_YIELD_EVENTS.map((e) => ({
      ...e,
      id: [e.token, e.type, e.tx].join('-'),
      chainAddress: getVaultEntityId(chain, MOCK_VAULT_DEFINITION),
      chain: chain.network,
      vault: MOCK_VAULT_DEFINITION.address,
    }));
    // constructs a list of events with duplicate badger and graviaura distributions
    vaultYieldEvents = baseEvents.concat(baseEvents);
  });

  describe('isInfluenceVault', () => {
    it.each([
      [TOKENS.BVECVX, true],
      [TOKENS.GRAVI_AURA, true],
      [TOKENS.BBADGER, false],
      [TOKENS.BAURA_BAL, false],
    ])('evaluates %s as an influence vault is %s', (token, result) => {
      expect(isInfluenceVault(token)).toEqual(result);
    });
  });

  describe('filterPerformanceItems', () => {
    describe('filter influence vault performances', () => {
      it('returns all harvests, and the most recent incentives distributions', async () => {
        const result = filterPerformanceItems(MOCK_VAULT_DEFINITION, vaultYieldEvents);
        expect(result).toMatchObject(vaultYieldEvents);
      });
    });

    describe('filter non influence vault performances', () => {
      it('returns all performance items', async () => {
        const definitionCopy = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
        definitionCopy.address = TOKENS.GRAVI_AURA;
        let inputTreeDistributions = 0;
        let inputBadgerDistributions = 0;
        let inputGraviAuraDistributions = 0;
        vaultYieldEvents.forEach((r) => {
          if (r.type === YieldType.TreeDistribution) {
            inputTreeDistributions++;
          }
          if (r.token === TOKENS.BADGER) {
            inputBadgerDistributions++;
          }
          if (r.token === TOKENS.GRAVI_AURA) {
            inputGraviAuraDistributions++;
          }
        });
        expect(inputTreeDistributions).toBeGreaterThan(2);
        expect(inputBadgerDistributions).toBeGreaterThan(1);
        expect(inputGraviAuraDistributions).toBeGreaterThan(1);
        const result = filterPerformanceItems(definitionCopy, vaultYieldEvents);
        let treeDistributions = 0;
        let badgerDistributions = 0;
        let graviAuraDistributions = 0;
        result.forEach((r) => {
          if (r.type === YieldType.TreeDistribution) {
            treeDistributions++;
          }
          if (r.token === TOKENS.BADGER) {
            badgerDistributions++;
          }
          if (r.token === TOKENS.GRAVI_AURA) {
            graviAuraDistributions++;
          }
        });
        expect(treeDistributions).toEqual(2);
        expect(badgerDistributions).toEqual(1);
        expect(graviAuraDistributions).toEqual(1);
      });
    });
  });

  describe('getVaultHarvestBalance', () => {
    const vaultSupply = ethers.constants.WeiPerEther.mul(10);
    let vault: MockProxy<Vault>;
    let locker: MockProxy<CvxLocker>;

    beforeEach(() => {
      vault = mock<Vault>();
      locker = mock<CvxLocker>();
      jest.spyOn(Vault__factory, 'connect').mockImplementation(() => vault);
      jest.spyOn(CvxLocker__factory, 'connect').mockImplementation(() => locker);
      jest.spyOn(vault, 'totalSupply').mockImplementation(async () => vaultSupply);
      jest
        .spyOn(VaultsService.prototype, 'getVaultStrategy')
        .mockImplementation(async () => ethers.constants.AddressZero);
    });

    describe('requests balance for a non influence vault', () => {
      it('returns the vault total supply', async () => {
        const result = await getVaultHarvestBalance(chain, MOCK_VAULT_DEFINITION, TEST_CURRENT_BLOCK);
        expect(result).toEqual(formatBalance(vaultSupply));
      });
    });

    describe('requests balance for bvecvx', () => {
      const bveCVXDefinition = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
      bveCVXDefinition.address = TOKENS.BVECVX;

      it('returns 0 for block tags before locker deployment', async () => {
        const result = await getVaultHarvestBalance(chain, bveCVXDefinition, 13153662);
        expect(result).toEqual(0);
      });

      it('returns locked balance after locker deployment', async () => {
        jest.spyOn(locker, 'lockedBalanceOf').mockImplementation(async () => vaultSupply.div(2));
        const result = await getVaultHarvestBalance(chain, bveCVXDefinition, TEST_CURRENT_BLOCK);
        expect(result).toEqual(formatBalance(vaultSupply.div(2)));
      });

      it('returns max balance after locker deployment, if locked balance is zero', async () => {
        jest.spyOn(locker, 'lockedBalanceOf').mockImplementation(async () => ethers.constants.Zero);
        const result = await getVaultHarvestBalance(chain, bveCVXDefinition, TEST_CURRENT_BLOCK);
        expect(result).toEqual(formatBalance(vaultSupply.div(2)));
      });

      it('returns vault balance after locker deployment, and encountering an error', async () => {
        jest.spyOn(locker, 'lockedBalanceOf').mockImplementation(async () => {
          throw new Error('Expected test error: lockedBalanceOf');
        });
        jest.spyOn(console, 'error').mockImplementation();
        const result = await getVaultHarvestBalance(chain, bveCVXDefinition, TEST_CURRENT_BLOCK);
        expect(result).toEqual(formatBalance(vaultSupply));
      });
    });

    describe('requests balance for graviaura', () => {
      const graviAuraDefinition = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
      graviAuraDefinition.address = TOKENS.GRAVI_AURA;

      it('returns total supply if pools contain no graviaura', async () => {
        jest.spyOn(balanceStrategy, 'getBalancerPoolTokens').mockImplementation(async () => []);
        const result = await getVaultHarvestBalance(chain, graviAuraDefinition, TEST_CURRENT_BLOCK);
        expect(result).toEqual(formatBalance(vaultSupply));
      });

      it('returns total supply if pool queries throw errors', async () => {
        jest.spyOn(balanceStrategy, 'getBalancerPoolTokens').mockImplementation(async () => {
          throw new Error('Expected test error: getBalancerPoolTokens');
        });
        jest.spyOn(console, 'error').mockImplementation();
        const result = await getVaultHarvestBalance(chain, graviAuraDefinition, TEST_CURRENT_BLOCK);
        expect(result).toEqual(formatBalance(vaultSupply));
      });

      it('returns total supply with blacklisted pools balance removed', async () => {
        const graviAuraToken = MOCK_TOKENS[TOKENS.GRAVI_AURA];
        jest
          .spyOn(balanceStrategy, 'getBalancerPoolTokens')
          .mockImplementation(async () => [mockBalance(graviAuraToken, 2.5)]);
        const result = await getVaultHarvestBalance(chain, graviAuraDefinition, TEST_CURRENT_BLOCK);
        // two blacklisted pools, each with 2.5, 10 max balance, 10 - (2 * 2.5)
        expect(result).toEqual(5);
      });
    });
  });
});
