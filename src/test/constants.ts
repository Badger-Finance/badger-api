import { BouncerType, Network, Protocol, VaultBehavior, VaultState, VaultVersion } from '@badger-dao/sdk';

import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { Stage } from '../config/enums/stage.enum';
import { TOKENS } from '../config/tokens.config';
import { TEST_ADDR } from './tests.utils';

export const MOCK_DISTRIBUTION_FILE = {
  merkleRoot: TEST_ADDR,
  cycle: 4034,
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

export const MOCK_VAULT_DEFINITION: VaultDefinitionModel = {
  address: TOKENS.BBADGER,
  name: 'Badger',
  createdAt: 0,
  updatedAt: 0,
  releasedAt: 0,
  stage: Stage.Production,
  behavior: VaultBehavior.Compounder,
  state: VaultState.Open,
  protocol: Protocol.Badger,
  isProduction: 1,
  bouncer: BouncerType.None,
  chain: Network.Ethereum,
  isNew: false,
  version: VaultVersion.v1,
  client: '',
  depositToken: TOKENS.BADGER,
  isMigrating: true,
  isStageVault: () => true,
};
