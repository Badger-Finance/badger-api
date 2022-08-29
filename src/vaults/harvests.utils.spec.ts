import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { MOCK_VAULT_DEFINITION, TEST_CURRENT_BLOCK, TEST_CURRENT_TIMESTAMP } from '../test/constants';
import { mockQuery, setupMockChain } from '../test/mocks.utils';
import { YieldType } from './enums/yield-type.enum';
import { queryLastHarvestBlock } from './harvests.utils';
import { YieldEvent } from './interfaces/yield-event';

// TODO: replace once available from mocks
export const MOCK_YIELD_EVENT: YieldEvent = {
  block: TEST_CURRENT_BLOCK,
  amount: 10,
  token: TOKENS.GRAVI_AURA,
  type: YieldType.Distribution,
  timestamp: TEST_CURRENT_TIMESTAMP,
  balance: 1_000_000,
  value: 10_000,
  earned: 3_500,
  apr: 230,
};

describe('harvests.utils', () => {
  let chain: Chain;

  beforeEach(() => {
    chain = setupMockChain();
  });

  describe('queryLastHarvestBlock', () => {
    describe('no saved data', () => {
      it('returns 0', async () => {
        mockQuery([]);
        const result = await queryLastHarvestBlock(chain, MOCK_VAULT_DEFINITION);
        expect(result).toEqual(0);
      });
    });
    describe('previously stored harvest data', () => {
      it('returns last block harvested', async () => {
        mockQuery([MOCK_YIELD_EVENT]);
        const result = await queryLastHarvestBlock(chain, MOCK_VAULT_DEFINITION);
        expect(result).toEqual(TEST_CURRENT_BLOCK);
      });
    });
  });
});
