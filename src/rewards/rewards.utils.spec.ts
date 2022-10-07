import { Protocol, RewardsService } from '@badger-dao/sdk';

import * as accountsUtils from '../accounts/accounts.utils';
import { getVaultEntityId } from '../aws/dynamodb.utils';
import { CachedYieldSource } from '../aws/models/cached-yield-source.interface';
import { CurrentVaultSnapshotModel } from '../aws/models/current-vault-snapshot.model';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import * as s3Utils from '../aws/s3.utils';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import * as balancerStrategy from '../protocols/strategies/balancer.strategy';
import * as curveStrategy from '../protocols/strategies/convex.strategy';
import * as sushiswapStrategy from '../protocols/strategies/sushiswap.strategy';
import * as swaprStrategy from '../protocols/strategies/swapr.strategy';
import * as uniswapStrategy from '../protocols/strategies/uniswap.strategy';
import { MOCK_VAULT_DEFINITION, MOCK_VAULT_SNAPSHOT, MOCK_YIELD_SOURCES } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import { randomClaimSnapshots } from '../test/mocks.utils/mock.helpers';
import * as vaultsUtils from '../vaults/vaults.utils';
import { SourceType } from './enums/source-type.enum';
import { BoostData } from './interfaces/boost-data.interface';
import { getProtocolValueSources, getRewardEmission, userClaimedSnapshotToDebankUser } from './rewards.utils';

describe('rewards.utils', () => {
  let chain: Chain;
  let mockYieldSources: CachedYieldSource[];

  beforeEach(() => {
    chain = setupMockChain();
    mockYieldSources = MOCK_YIELD_SOURCES.map((s) => ({
      id: `${getVaultEntityId(chain, MOCK_VAULT_DEFINITION)}-test-mock`,
      chainAddress: getVaultEntityId(chain, MOCK_VAULT_DEFINITION),
      chain: chain.network,
      address: MOCK_VAULT_DEFINITION.address,
      type: SourceType.TradeFee,
      performance: {
        baseYield: 10,
        grossYield: 12,
        minYield: 7,
        maxYield: 14,
        minGrossYield: 8,
        maxGrossYield: 15,
      },
      ...s,
    }));

    const boostData: BoostData = {
      userData: {},
      multiplierData: {
        [TOKENS.BCVXCRV]: { min: 0.25, max: 2 },
        [TOKENS.BVECVX]: { min: 0.1, max: 5 },
      },
    };
    jest.spyOn(s3Utils, 'getBoostFile').mockImplementation(async () => boostData);

    jest.spyOn(accountsUtils, 'getCachedAccount').mockImplementation(async (_c, address) => ({
      address,
      value: 1000000,
      earnedValue: 5000,
      boostRank: 10,
      boost: 3000,
      stakeRatio: 1,
      data: {},
      bveCvxBalance: 200000,
      nftBalance: 100000,
      diggBalance: 700000,
      nativeBalance: 800000,
      nonNativeBalance: 200000,
      claimableBalances: {},
    }));
    jest.spyOn(RewardsService.prototype, 'hasRewardsLogger').mockImplementation(() => true);

    jest
      .spyOn(vaultsUtils, 'getCachedVault')
      .mockImplementation(
        async (_c: Chain, _v: VaultDefinitionModel) => MOCK_VAULT_SNAPSHOT as CurrentVaultSnapshotModel,
      );

    jest.spyOn(sushiswapStrategy, 'getSushiswapYieldSources').mockImplementation(async () => mockYieldSources);
    jest.spyOn(balancerStrategy, 'getBalancerYieldSources').mockImplementation(async () => mockYieldSources);
    jest.spyOn(curveStrategy, 'getCurveYieldSources').mockImplementation(async () => mockYieldSources);
    jest.spyOn(uniswapStrategy, 'getUniswapV2YieldSources').mockImplementation(async () => mockYieldSources);
    jest.spyOn(swaprStrategy, 'getSwaprYieldSources').mockImplementation(async () => mockYieldSources);
  });

  describe('getRewardEmission', () => {
    it('returns no yield sources for chains without rewards loggers', async () => {
      jest.spyOn(RewardsService.prototype, 'hasRewardsLogger').mockImplementation(() => false);
      const result = await getRewardEmission(chain, MOCK_VAULT_DEFINITION);
      expect(result).toMatchObject([]);
    });

    it('utilizes the boost file to determine emission yields', async () => {
      const cvxCrvDefinition = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
      cvxCrvDefinition.address = TOKENS.BCVXCRV;
      const snapshot = JSON.parse(JSON.stringify(MOCK_VAULT_SNAPSHOT));
      snapshot.boostWeight = 10_000;
      jest
        .spyOn(vaultsUtils, 'getCachedVault')
        .mockImplementation(async (_c: Chain, _v: VaultDefinitionModel) => snapshot as CurrentVaultSnapshotModel);
      const result = await getRewardEmission(chain, cvxCrvDefinition);
      expect(result).toMatchSnapshot();
    });

    it('ignores any extraneous bvecvx multiplier data', async () => {
      const bveCvxDefinition = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
      bveCvxDefinition.address = TOKENS.BVECVX;
      const result = await getRewardEmission(chain, bveCvxDefinition);
      expect(result).toMatchSnapshot();
    });

    it('evaluates non boosted vaults properly', async () => {
      const result = await getRewardEmission(chain, MOCK_VAULT_DEFINITION);
      expect(result).toMatchSnapshot();
    });
  });

  describe('getProtocolValueSources', () => {
    it('returns no yield sources upon encountering an error', async () => {
      jest.spyOn(console, 'log').mockImplementation();
      jest.spyOn(sushiswapStrategy, 'getSushiswapYieldSources').mockImplementation(async () => {
        throw new Error('Expected test error: getSushiswapYieldSources');
      });
      const definition = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
      definition.protocol = Protocol.Sushiswap;
      const result = await getProtocolValueSources(chain, definition);
      expect(result).toMatchObject([]);
    });

    it('returns no yield sources for protocol without native yields', async () => {
      const definition = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
      definition.protocol = Protocol.Badger;
      const result = await getProtocolValueSources(chain, definition);
      expect(result).toMatchObject([]);
    });

    it.each([
      [Protocol.Sushiswap],
      [Protocol.Convex],
      [Protocol.Curve],
      [Protocol.Uniswap],
      [Protocol.Swapr],
      [Protocol.Balancer],
      [Protocol.Aura],
    ])('returns yield sources for %s', async (protocol) => {
      const definition = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
      definition.protocol = protocol;
      const result = await getProtocolValueSources(chain, definition);
      expect(result).toMatchObject(mockYieldSources);
    });
  });

  describe('userClaimedSnapshotToDebankUser', () => {
    it('converts a user claimed snapshot to a debank user response', async () => {
      const snapshots = randomClaimSnapshots(20);
      const snapshot = snapshots.find((s) => {
        const maybeDiggBalance = s.claimableBalances.find((b) => b.address === TOKENS.DIGG);
        return !!maybeDiggBalance;
      });
      expect(snapshot).toBeTruthy();
      // we know here snapshot is found
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      const result = await userClaimedSnapshotToDebankUser(chain, snapshot!);
      expect(result).toMatchSnapshot();
    });
  });
});
