import { TokensService, UniV2, UniV2__factory } from '@badger-dao/sdk';
import { NotFound } from '@tsed/exceptions';
import { BigNumber } from 'ethers';
import { mock } from 'jest-mock-extended';

import { CurrentVaultSnapshotModel } from '../../aws/models/current-vault-snapshot.model';
import { Chain } from '../../chains/config/chain.config';
import { TOKENS } from '../../config/tokens.config';
import { MOCK_VAULT_DEFINITION, MOCK_VAULT_SNAPSHOT } from '../../test/constants';
import { setupMockChain } from '../../test/mocks.utils';
import { fullTokenMockMap } from '../../tokens/mocks/full-token.mock';
import * as vaultsUtils from '../../vaults/vaults.utils';
import { getLpTokenBalances } from './uniswap.strategy';

describe('uniswap.strategy', () => {
  let chain: Chain;

  beforeEach(() => {
    chain = setupMockChain();
  });

  describe('getLpTokenBalances', () => {
    beforeEach(async () => {
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

      jest
        .spyOn(vaultsUtils, 'getCachedVault')
        .mockImplementation(async (_c, _v) => MOCK_VAULT_SNAPSHOT as CurrentVaultSnapshotModel);
    });

    it('should return token balances of the vault', async () => {
      const lpTokenBalances = await getLpTokenBalances(chain, MOCK_VAULT_DEFINITION);

      expect(lpTokenBalances).toMatchSnapshot();
    });

    it('should throw NotFound in case of error', async () => {
      jest.spyOn(vaultsUtils, 'getCachedVault').mockImplementation(async (_c, _v) => {
        throw new Error();
      });

      await expect(getLpTokenBalances(chain, MOCK_VAULT_DEFINITION)).rejects.toThrow(NotFound);
    });
  });
});
