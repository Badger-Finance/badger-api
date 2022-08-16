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

import { Ethereum } from '../chains/config/eth.config';
import { TOKENS } from '../config/tokens.config';
import { EmissionControl, EmissionControl__factory, UniV2, UniV2__factory } from '../contracts';
import { MOCK_VAULT, MOCK_VAULT_DEFINITION, TEST_CURRENT_TIMESTAMP } from '../test/constants';
import { mockBadgerSdk, mockPricing, setFullTokenDataMock, TEST_CHAIN } from '../test/tests.utils';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import * as apiVaults from '../vaults/vaults.service';
import * as vaultsUtils from '../vaults/vaults.utils';
import { constructVaultDefinition, getLpTokenBalances, getVault, vaultToSnapshot } from './indexer.utils';

describe('indexer.utils', () => {
  async function setupBaseUtilFixture() {
    jest.spyOn(Date, 'now').mockImplementation(() => TEST_CURRENT_TIMESTAMP);

    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();

    const strategyMock = mock<Strategy>();
    const vaultV15Mock = mock<VaultV15>();
    const emissionControl = mock<EmissionControl>();

    jest.spyOn(Strategy__factory, 'connect').mockImplementation(() => strategyMock);
    jest.spyOn(VaultV15__factory, 'connect').mockImplementation(() => vaultV15Mock);
    jest.spyOn(EmissionControl__factory, 'connect').mockImplementation(() => emissionControl);

    jest.spyOn(strategyMock, 'withdrawalFee').mockImplementation(async () => BigNumber.from(1));
    jest.spyOn(strategyMock, 'performanceFeeGovernance').mockImplementation(async () => BigNumber.from(2));
    jest.spyOn(strategyMock, 'performanceFeeStrategist').mockImplementation(async () => BigNumber.from(3));

    jest.spyOn(vaultV15Mock, 'withdrawalFee').mockImplementation(async () => BigNumber.from(1));
    jest.spyOn(vaultV15Mock, 'performanceFeeGovernance').mockImplementation(async () => BigNumber.from(2));
    jest.spyOn(vaultV15Mock, 'performanceFeeStrategist').mockImplementation(async () => BigNumber.from(3));
    jest.spyOn(vaultV15Mock, 'managementFee').mockImplementation(async () => BigNumber.from(4));

    jest.spyOn(emissionControl, 'boostedEmissionRate').mockImplementation(async () => BigNumber.from(1));

    const sdk = await mockBadgerSdk();

    jest.spyOn(Ethereum.prototype, 'getSdk').mockImplementation(async () => sdk);
    jest.spyOn(Ethereum.prototype, 'provider', 'get').mockReturnValue(sdk.provider);

    jest.spyOn(VaultsService.prototype, 'loadVault').mockImplementation(async function ({ address }) {
      return <RegistryVault>registryVaults.find((v) => v.address === address);
    });
    jest.spyOn(VaultsService.prototype, 'getVaultStrategy').mockImplementation(async () => vaultStrategy);

    jest.spyOn(BadgerGraph.prototype, 'loadSett').mockImplementation(async ({ id }) => {
      const graphVault = graphVaults.setts.find((v) => v.id === id);

      if (!graphVault) return { sett: null };

      return { sett: <gqlGenT.SettQuery['sett']>graphVault, __typename: 'Query' };
    });

    mockPricing();

    jest.spyOn(apiVaults.VaultsService, 'loadVault').mockImplementation(async () => MOCK_VAULT);

    return { sdk, strategyMock, vaultV15Mock };
  }

  describe('vaultToSnapshot', () => {
    beforeEach(setupBaseUtilFixture);

    it('should return valid snapshot of the vault', async () => {
      const snapshot = await vaultToSnapshot(TEST_CHAIN, MOCK_VAULT_DEFINITION);

      // small lol here
      expect(snapshot).toMatchSnapshot();
    });
  });

  describe('constructVaultsDefinition', () => {
    beforeEach(setupBaseUtilFixture);

    it('should construct vault definition', async () => {
      expect(await constructVaultDefinition(TEST_CHAIN, <RegistryVault>registryVaults[0])).toMatchSnapshot();
    });

    it('should return null if no data on the Graph', async () => {
      jest.spyOn(BadgerGraph.prototype, 'loadSett').mockImplementation(async () => ({ sett: null }));

      expect(await constructVaultDefinition(TEST_CHAIN, <RegistryVault>registryVaults[1])).toBeNull();
    });
  });

  describe('getLpTokenBalances', () => {
    beforeEach(async () => {
      await setupBaseUtilFixture();

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

      setFullTokenDataMock();

      const cachedVault = await vaultsUtils.defaultVault(TEST_CHAIN, MOCK_VAULT_DEFINITION);
      jest.spyOn(vaultsUtils, 'getCachedVault').mockImplementation(async (_c, _v) => cachedVault);
    });

    it('should return token balances of the vault', async () => {
      const lpTokenBalances = await getLpTokenBalances(TEST_CHAIN, MOCK_VAULT_DEFINITION);

      expect(lpTokenBalances).toMatchSnapshot();
    });

    it('should throw NotFound in case of error', async () => {
      jest.spyOn(vaultsUtils, 'getCachedVault').mockImplementation(async (_c, _v) => {
        throw new Error();
      });

      await expect(getLpTokenBalances(TEST_CHAIN, MOCK_VAULT_DEFINITION)).rejects.toThrow(NotFound);
    });
  });

  describe('getVault', () => {
    beforeEach(setupBaseUtilFixture);

    it('should return graph vault sequence', async () => {
      const graphVault = await getVault(TEST_CHAIN, MOCK_VAULT_DEFINITION.address);

      expect(graphVault).toMatchSnapshot();
    });
  });
});
