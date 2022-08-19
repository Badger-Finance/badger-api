import {
  BadgerGraph,
  RegistryVault,
  Strategy__factory,
  VaultsService,
  VaultV15,
  VaultV15__factory,
} from '@badger-dao/sdk';
import { Strategy } from '@badger-dao/sdk/lib/contracts/Strategy';
import * as gqlGenT from '@badger-dao/sdk/lib/graphql/generated/badger';
import { TokensService } from '@badger-dao/sdk/lib/tokens/tokens.service';
import graphVaults from '@badger-dao/sdk-mocks/generated/ethereum/graph/loadSetts.json';
import vaultStrategy from '@badger-dao/sdk-mocks/generated/ethereum/vaults/getVaultStrategy.json';
import registryVaults from '@badger-dao/sdk-mocks/generated/ethereum/vaults/loadVaults.json';
import { NotFound } from '@tsed/exceptions';
import { BigNumber } from 'ethers';
import { mock } from 'jest-mock-extended';

import { TestEthereum } from '../chains/config/test.config';
import { TOKENS } from '../config/tokens.config';
import { EmissionControl, EmissionControl__factory, UniV2, UniV2__factory } from '../contracts';
import { MOCK_VAULT, MOCK_VAULT_DEFINITION, TEST_CURRENT_TIMESTAMP } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import { mockContract } from '../test/mocks.utils/contracts/mock.contract.base';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import * as apiVaults from '../vaults/vaults.service';
import * as vaultsUtils from '../vaults/vaults.utils';
import { constructVaultDefinition, getLpTokenBalances, getVault, vaultToSnapshot } from './indexer.utils';

describe('indexer.utils', () => {
  async function setupBaseUtilFixture() {
    jest.spyOn(Date, 'now').mockImplementation(() => TEST_CURRENT_TIMESTAMP);

    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();

    const strategyMock = mockContract<Strategy>(Strategy__factory);
    const vaultV15Mock = mockContract<VaultV15>(VaultV15__factory);
    const emissionControl = mockContract<EmissionControl>(EmissionControl__factory);

    jest.spyOn(strategyMock, 'withdrawalFee').mockImplementation(async () => BigNumber.from(1));
    jest.spyOn(strategyMock, 'performanceFeeGovernance').mockImplementation(async () => BigNumber.from(2));
    jest.spyOn(strategyMock, 'performanceFeeStrategist').mockImplementation(async () => BigNumber.from(3));

    jest.spyOn(vaultV15Mock, 'withdrawalFee').mockImplementation(async () => BigNumber.from(1));
    jest.spyOn(vaultV15Mock, 'performanceFeeGovernance').mockImplementation(async () => BigNumber.from(2));
    jest.spyOn(vaultV15Mock, 'performanceFeeStrategist').mockImplementation(async () => BigNumber.from(3));
    jest.spyOn(vaultV15Mock, 'managementFee').mockImplementation(async () => BigNumber.from(4));

    jest.spyOn(emissionControl, 'boostedEmissionRate').mockImplementation(async () => BigNumber.from(1));

    const chain = setupMockChain();

    jest.spyOn(VaultsService.prototype, 'loadVault').mockImplementation(async function ({ address }) {
      return <RegistryVault>registryVaults.find((v) => v.address === address);
    });
    jest.spyOn(VaultsService.prototype, 'getVaultStrategy').mockImplementation(async () => vaultStrategy);

    jest.spyOn(BadgerGraph.prototype, 'loadSett').mockImplementation(async ({ id }) => {
      const graphVault = graphVaults.setts.find((v) => v.id === id);

      if (!graphVault) return { sett: null };

      return { sett: <gqlGenT.SettQuery['sett']>graphVault, __typename: 'Query' };
    });

    jest.spyOn(apiVaults.VaultsService, 'loadVault').mockImplementation(async () => MOCK_VAULT);

    return { chain, strategyMock, vaultV15Mock };
  }

  describe('vaultToSnapshot', () => {
    let testChain: TestEthereum;

    beforeEach(async () => {
      const { chain } = await setupBaseUtilFixture();

      testChain = chain;
    });

    it('should return valid snapshot of the vault', async () => {
      const snapshot = await vaultToSnapshot(testChain, MOCK_VAULT_DEFINITION);

      // small lol here
      expect(snapshot).toMatchSnapshot();
    });
  });

  describe('constructVaultsDefinition', () => {
    let testChain: TestEthereum;

    beforeEach(async () => {
      const { chain } = await setupBaseUtilFixture();

      testChain = chain;
    });

    it('should construct vault definition', async () => {
      expect(await constructVaultDefinition(testChain, <RegistryVault>registryVaults[0])).toMatchSnapshot();
    });

    it('should return null if no data on the Graph', async () => {
      jest.spyOn(BadgerGraph.prototype, 'loadSett').mockImplementation(async () => ({ sett: null }));

      expect(await constructVaultDefinition(testChain, <RegistryVault>registryVaults[1])).toBeNull();
    });
  });

  describe('getLpTokenBalances', () => {
    let testChain: TestEthereum;

    beforeEach(async () => {
      const { chain } = await setupBaseUtilFixture();

      testChain = chain;

      const pairContractMock = mock<UniV2>();

      jest.spyOn(UniV2__factory, 'connect').mockImplementation(() => pairContractMock);

      jest.spyOn(pairContractMock, 'totalSupply').mockImplementation(async () => BigNumber.from(10000));
      jest.spyOn(pairContractMock, 'token0').mockImplementation(async () => fullTokenMockMap[TOKENS.BADGER].address);
      jest.spyOn(pairContractMock, 'token1').mockImplementation(async () => fullTokenMockMap[TOKENS.WBTC].address);

      jest
        .spyOn(pairContractMock, 'getReserves')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .mockImplementation(async () => ({ _reserve0: BigNumber.from(1000), _reserve1: BigNumber.from(20) }));

      jest.spyOn(TokensService.prototype, 'loadTokens').mockImplementation(async () => fullTokenMockMap);

      const cachedVault = await vaultsUtils.defaultVault(testChain, MOCK_VAULT_DEFINITION);
      jest.spyOn(vaultsUtils, 'getCachedVault').mockImplementation(async (_c, _v) => cachedVault);
    });

    it('should return token balances of the vault', async () => {
      const lpTokenBalances = await getLpTokenBalances(testChain, MOCK_VAULT_DEFINITION);

      expect(lpTokenBalances).toMatchSnapshot();
    });

    it('should throw NotFound in case of error', async () => {
      jest.spyOn(vaultsUtils, 'getCachedVault').mockImplementation(async (_c, _v) => {
        throw new Error();
      });

      await expect(getLpTokenBalances(testChain, MOCK_VAULT_DEFINITION)).rejects.toThrow(NotFound);
    });
  });

  describe('getVault', () => {
    let testChain: TestEthereum;

    beforeEach(async () => {
      const { chain } = await setupBaseUtilFixture();

      testChain = chain;
    });

    it('should return graph vault sequence', async () => {
      const graphVault = await getVault(testChain, MOCK_VAULT_DEFINITION.address);

      expect(graphVault).toMatchSnapshot();
    });
  });
});
