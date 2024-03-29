/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  BouncerType,
  Network,
  Protocol,
  ValueSource,
  VaultBehavior,
  VaultDTOV2,
  VaultDTOV3,
  VaultHarvestData,
  VaultSnapshot,
  VaultState,
  VaultVersion,
  YieldEvent,
  YieldType,
} from '@badger-dao/sdk';
import mockMetrics from '@badger-dao/sdk-mocks/generated/ethereum/api/loadProtocolMetrics.json';
import mockTokens from '@badger-dao/sdk-mocks/generated/ethereum/api/loadTokens.json';
import mockVaultSnapshots from '@badger-dao/sdk-mocks/generated/ethereum/api/loadVaultChart.json';
import mockYieldEvents from '@badger-dao/sdk-mocks/generated/ethereum/api/loadVaultHarvestsV3.json';
import mockVaults from '@badger-dao/sdk-mocks/generated/ethereum/api/loadVaults.json';
import mockVaultHarvests from '@badger-dao/sdk-mocks/generated/ethereum/api/loadVaultsHarvests.json';
import mockVaultsV3 from '@badger-dao/sdk-mocks/generated/ethereum/api/loadVaultsV3.json';
import mockListHarvests from '@badger-dao/sdk-mocks/generated/ethereum/vaults/listHarvests.json';
import { BigNumber } from 'ethers';

import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { Stage } from '../config/enums/stage.enum';
import { TOKENS } from '../config/tokens.config';
import { TokenFullMap } from '../tokens/interfaces/token-full.interface';
import { VaultHarvestsMap } from '../vaults/interfaces/vault-harvest-map';
import { VAULT_TWAY_DURATION } from '../vaults/vaults.config';

export const TEST_TOKEN = TOKENS.BADGER;
export const TEST_ADDR = TOKENS.BBADGER;
export const TEST_CURRENT_TIMESTAMP = 1660223160457;
export const TEST_CURRENT_BLOCK = 13_500_500;
export const TEST_DEFAULT_GAS_PRICE = '1000000';

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
  lastHarvestIndexedBlock: TEST_CURRENT_BLOCK,
};

export const MOCK_VAULTS: VaultDTOV2[] = mockVaults as VaultDTOV2[];
export const MOCK_VAULT: VaultDTOV2 = MOCK_VAULTS[0];

export const MOCK_VAULTS_V3: VaultDTOV3[] = mockVaultsV3 as VaultDTOV3[];
export const MOCK_VAULT_V3: VaultDTOV3 = MOCK_VAULTS_V3[0];

export const MOCK_VAULT_SNAPSHOTS: VaultSnapshot[] = mockVaultSnapshots.map((s) => ({
  ...s,
  grossApr: s.apr * 1.15,
}));
export const MOCK_VAULT_SNAPSHOT = MOCK_VAULT_SNAPSHOTS[0];

export const MOCK_YIELD_SOURCES: ValueSource[] = MOCK_VAULT.sources;

export const MOCK_TOKENS = mockTokens as TokenFullMap;
export const MOCK_TOKEN = MOCK_TOKENS[TEST_TOKEN];

export const MOCK_VAULTS_HARVESTS = <VaultHarvestsMap>mockVaultHarvests;
export const MOCK_VAULT_HARVESTS = MOCK_VAULTS_HARVESTS[TEST_ADDR];

const mockListHarvestsCopy = JSON.parse(JSON.stringify(mockListHarvests));
mockListHarvestsCopy.data = mockListHarvestsCopy.data.slice(0, 5);
// @ts-ignore
mockListHarvestsCopy.data.forEach((d) => {
  // @ts-ignore
  d.harvests.forEach((h) => {
    h.amount = BigNumber.from(h.amount.hex);
  });
  // @ts-ignore
  d.treeDistributions.forEach((h) => {
    h.amount = BigNumber.from(h.amount.hex);
  });
});
export const MOCK_HARVESTS: { data: VaultHarvestData[] } = mockListHarvestsCopy;

export const MOCK_PROTOCOL_METRICS = mockMetrics;

// TODO: replace once available from mocks
export const MOCK_YIELD_EVENT: YieldEvent = {
  block: TEST_CURRENT_BLOCK,
  amount: 10,
  token: TOKENS.GRAVI_AURA,
  type: YieldType.TreeDistribution,
  timestamp: TEST_CURRENT_TIMESTAMP,
  balance: 1_000_000,
  duration: VAULT_TWAY_DURATION,
  value: 10_000,
  earned: 3_500,
  apr: 230,
  grossApr: 230 * (1 / 0.9),
  tx: '0x123',
};

export const MOCK_YIELD_EVENTS = <YieldEvent[]>mockYieldEvents;
