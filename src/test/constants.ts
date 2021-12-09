import { TOKENS } from '../config/tokens.config';
import { TEST_ADDR } from './tests.utils';

export const MOCK_DISTRIBUTION_FILE = {
  merkleRoot: TEST_ADDR,
  tokenTotal: {
    [TOKENS.BADGER]: 10,
    [TOKENS.DIGG]: 3,
  },
  claims: {
    [TEST_ADDR]: {
      index: '0x01',
      cycle: '0x01',
      user: TEST_ADDR,
      tokens: [TOKENS.BADGER, TOKENS.DIGG],
      cumulativeAmounts: ['4', '1'],
      proof: [TEST_ADDR, TEST_ADDR, TEST_ADDR],
      node: TEST_ADDR,
    },
  },
};

export const MOCK_BOUNCER_FILE = {
  merkleRoot: TEST_ADDR,
  tokenTotal: 5,
  claims: {
    [TEST_ADDR]: {
      index: '0x01',
      amount: 1,
      proof: [TEST_ADDR, TEST_ADDR, TEST_ADDR],
    },
  },
};
