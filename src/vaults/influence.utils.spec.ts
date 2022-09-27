import { YieldType } from '@badger-dao/sdk';

import { getVaultEntityId } from '../aws/dynamodb.utils';
import { VaultYieldEvent } from '../aws/models/vault-yield-event.model';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { MOCK_VAULT_DEFINITION, MOCK_YIELD_EVENTS } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import { filterPerformanceItems, isInfluenceVault } from './influence.utils';

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
});
