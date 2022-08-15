import {
  BouncerType,
  Network,
  Protocol,
  Token,
  ValueSource,
  VaultBehavior,
  VaultDTO,
  VaultSnapshot,
  VaultState,
  VaultVersion,
} from '@badger-dao/sdk';
import mockTokens from '@badger-dao/sdk-mocks/generated/ethereum/api/loadTokens.json';
import mockVaultSnapshots from '@badger-dao/sdk-mocks/generated/ethereum/api/loadVaultChart.json';
import mockVaults from '@badger-dao/sdk-mocks/generated/ethereum/api/loadVaults.json';
import mockVaultHarvests from '@badger-dao/sdk-mocks/generated/ethereum/api/loadVaultsHarvests.json';
import { VaultHarvestsExtendedResp } from 'src/vaults/interfaces/vault-harvest-extended-resp.interface';

import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { Stage } from '../config/enums/stage.enum';

export const TEST_TOKEN = '0x3472A5A71965499acd81997a54BBA8D852C6E53d';
export const TEST_ADDR = '0x19D97D8fA813EE2f51aD4B4e04EA08bAf4DFfC28';
export const TEST_CURRENT_TIMESTAMP = 1660223160457;
export const TEST_CURRENT_BLOCK = 13_500_500;

export const MOCK_DISTRIBUTION_FILE = {
  merkleRoot: TEST_ADDR,
  cycle: 4034,
  tokenTotal: {
    ['0x3472A5A71965499acd81997a54BBA8D852C6E53d']: 10,
    ['0x798d1be841a82a273720ce31c822c61a67a601c3']: 3,
  },
  claims: {
    [TEST_ADDR]: {
      index: '0x01',
      cycle: '0x01',
      user: TEST_ADDR,
      tokens: ['0x3472A5A71965499acd81997a54BBA8D852C6E53d', '0x798d1be841a82a273720ce31c822c61a67a601c3'],
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
  id: `${Network.Ethereum}-${TEST_ADDR}`,
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
  depositToken: TEST_TOKEN,
};

export const MOCK_VAULTS: VaultDTO[] = mockVaults as VaultDTO[];
export const MOCK_VAULT: VaultDTO = MOCK_VAULTS[0];

export const MOCK_VAULT_SNAPSHOTS: VaultSnapshot[] = mockVaultSnapshots;
export const MOCK_VAULT_SNAPSHOT = MOCK_VAULT_SNAPSHOTS[0];

export const MOCK_YIELD_SOURCES: ValueSource[] = MOCK_VAULT.sources;

export const MOCK_TOKENS: Record<string, Token> = mockTokens;

export const MOCK_VAULTS_HARVESTS = mockVaultHarvests as Record<string, VaultHarvestsExtendedResp[]>;
export const MOCK_VAULT_HARVESTS = MOCK_VAULTS_HARVESTS[TEST_ADDR];
