import {
  BouncerType,
  Network,
  Protocol,
  ValueSource,
  VaultBehavior,
  VaultDTO,
  VaultSnapshot,
  VaultState,
  VaultVersion,
} from '@badger-dao/sdk';
import mockVaultSnapshots from '@badger-dao/sdk-mocks/generated/ethereum/api/loadVaultChart.json';
import mockVaults from '@badger-dao/sdk-mocks/generated/ethereum/api/loadVaults.json';

import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { Stage } from '../config/enums/stage.enum';
import { TOKENS } from '../config/tokens.config';

export const TEST_ADDR = TOKENS.BBADGER;
export const TEST_CURRENT_TIMESTAMP = 1660223160457;

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
  id: `${Network.Ethereum}-${TOKENS.BBADGER}`,
  address: TEST_ADDR,
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
};

export const MOCK_VAULTS: VaultDTO[] = mockVaults as VaultDTO[];
export const MOCK_VAULT: VaultDTO = MOCK_VAULTS[0];

export const MOCK_VAULT_SNAPSHOTS: VaultSnapshot[] = mockVaultSnapshots;
export const MOCK_VAULT_SNAPSHOT = MOCK_VAULT_SNAPSHOTS[0];

export const MOCK_YIELD_SOURCES: ValueSource[] = MOCK_VAULT.sources;
