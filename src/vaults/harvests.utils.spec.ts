import { Vault, Vault__factory, VaultsService } from '@badger-dao/sdk';
import { BigNumber } from 'ethers';

import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import * as pricesUtils from '../prices/prices.utils';
import { SourceType } from '../rewards/enums/source-type.enum';
import {
  MOCK_TOKENS,
  MOCK_VAULT_DEFINITION,
  MOCK_YIELD_EVENT,
  TEST_CURRENT_BLOCK,
  TEST_CURRENT_TIMESTAMP,
} from '../test/constants';
import { mockQuery, setupMockChain } from '../test/mocks.utils';
import { mockContract } from '../test/mocks.utils/contracts/mock.contract.base';
import * as tokensUtils from '../tokens/tokens.utils';
import * as influenceUtils from '../vaults/influence.utils';
import * as vaultsUtils from '../vaults/vaults.utils';
import { loadYieldEvents, queryVaultHistoricYieldEvents, queryVaultYieldEvents } from './harvests.utils';
import { VAULT_SOURCE } from './vaults.config';
import { createYieldSource } from './yields.utils';

describe('harvests.utils', () => {
  let chain: Chain;

  beforeEach(() => {
    chain = setupMockChain();
  });

  function setupYieldMocks() {
    // setup token responses
    jest.spyOn(tokensUtils, 'getFullToken').mockImplementation(async (_c, t) => MOCK_TOKENS[t]);
    jest.spyOn(pricesUtils, 'queryPriceAtTimestamp').mockImplementation(async (token, _t, _c) => {
      const basePrice = await chain.strategy.getPrice(token);
      return {
        ...basePrice,
        updatedAt: TEST_CURRENT_TIMESTAMP,
      };
    });

    // setup contract interactions
    const vaultMock = mockContract<Vault>(Vault__factory);
    jest.spyOn(vaultMock, 'totalSupply').mockImplementation(async (_o) => BigNumber.from('10000000000000000000000000'));

    jest
      .spyOn(vaultsUtils, 'queryYieldSources')
      .mockImplementation(async (v) => [createYieldSource(v, SourceType.PreCompound, VAULT_SOURCE, 3)]);

    jest.spyOn(influenceUtils, 'getInfuelnceVaultYieldBalance').mockImplementation(async (_c, _v) => 4_500_000);
    jest.spyOn(chain.sdk.graph, 'loadSettHarvests').mockImplementation(async () => ({
      settHarvests: [
        {
          id: '0x56c8c982ce6efa45da0ff90383d42cc026397f3bceac93fa3c08d264aad1863c-106',
          timestamp: 1660107820,
          token: {
            id: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
            name: 'Convex Token',
            symbol: 'CVX',
            decimals: '18',
            totalSupply: '52842757666481041544194387',
          },
          amount: '0',
          blockNumber: '15312417',
          strategy: { id: '0x898111d1f4eb55025d0036568212425ee2274082' },
          sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
        },
        {
          id: '0x6902d5e3d0dc784dac28506ec173727111439ba5dd8a05cfb9c9a7f86137cab5-51',
          timestamp: 1661148573,
          token: {
            id: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
            name: 'Convex Token',
            symbol: 'CVX',
            decimals: '18',
            totalSupply: '52842757666481041544194387',
          },
          amount: '0',
          blockNumber: '15388629',
          strategy: { id: '0x898111d1f4eb55025d0036568212425ee2274082' },
          sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
        },
        {
          id: '0x74f208d906f022f2ed290dfc01c9b283791ae3352f74638cbdd8b6af57323304-26',
          timestamp: 1660455256,
          token: {
            id: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
            name: 'Convex Token',
            symbol: 'CVX',
            decimals: '18',
            totalSupply: '52842757666481041544194387',
          },
          amount: '0',
          blockNumber: '15337891',
          strategy: { id: '0x898111d1f4eb55025d0036568212425ee2274082' },
          sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
        },
        {
          id: '0xba80fa9bdd08636514171ee7c54d6a5420d392111c4b08fa185e9677fea5d647-44',
          timestamp: 1660800880,
          token: {
            id: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
            name: 'Convex Token',
            symbol: 'CVX',
            decimals: '18',
            totalSupply: '52842757666481041544194387',
          },
          amount: '0',
          blockNumber: '15363244',
          strategy: { id: '0x898111d1f4eb55025d0036568212425ee2274082' },
          sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
        },
      ],
    }));
    jest.spyOn(chain.sdk.graph, 'loadBadgerTreeDistributions').mockImplementation(async () => ({
      badgerTreeDistributions: [
        {
          id: '0x49730f8f1d3aa7915940ec85de53b10e5425cddbf9195c2348f779638eed14dd-85',
          timestamp: 1661253900,
          token: {
            id: '0x0xfd05d3c7fe2924020620a8be4961bbaa747e6305',
            name: 'Badger Vested Escrow Convex Token',
            symbol: 'bveCVX',
            decimals: '18',
            totalSupply: '1146328308588079160439895',
          },
          amount: '18087137228369161871035',
          blockNumber: '15396257',
          strategy: { id: '0x0000000000000000000000000000000000000000' },
          sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
        },
        {
          id: '0x49730f8f1d3aa7915940ec85de53b10e5425cddbf9195c2348f779638eed14dd-92',
          timestamp: 1661253900,
          token: {
            id: '0x3472a5a71965499acd81997a54bba8d852c6e53d',
            name: 'Badger',
            symbol: 'BADGER',
            decimals: '18',
            totalSupply: '21000000000000000000000000',
          },
          amount: '8273444229204367267242',
          blockNumber: '15396257',
          strategy: { id: '0x0000000000000000000000000000000000000000' },
          sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
        },
        {
          id: '0x56c8c982ce6efa45da0ff90383d42cc026397f3bceac93fa3c08d264aad1863c-105',
          timestamp: 1660107820,
          token: {
            id: '0x0x2b5455aac8d64c14786c3a29858e43b5945819c0',
            name: 'Badger Sett Convex CRV',
            symbol: 'bcvxCRV',
            decimals: '18',
            totalSupply: '9680860937976920554007',
          },
          amount: '5603203309292930442532',
          blockNumber: '15312417',
          strategy: { id: '0x898111d1f4eb55025d0036568212425ee2274082' },
          sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
        },
        {
          id: '0x6902d5e3d0dc784dac28506ec173727111439ba5dd8a05cfb9c9a7f86137cab5-50',
          timestamp: 1661148573,
          token: {
            id: '0x0x2b5455aac8d64c14786c3a29858e43b5945819c0',
            name: 'Badger Sett Convex CRV',
            symbol: 'bcvxCRV',
            decimals: '18',
            totalSupply: '9680860937976920554007',
          },
          amount: '4261975371596002775428',
          blockNumber: '15388629',
          strategy: { id: '0x898111d1f4eb55025d0036568212425ee2274082' },
          sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
        },
        {
          id: '0x74f208d906f022f2ed290dfc01c9b283791ae3352f74638cbdd8b6af57323304-25',
          timestamp: 1660455256,
          token: {
            id: '0x0x2b5455aac8d64c14786c3a29858e43b5945819c0',
            name: 'Badger Sett Convex CRV',
            symbol: 'bcvxCRV',
            decimals: '18',
            totalSupply: '9680860937976920554007',
          },
          amount: '4285530143667972615612',
          blockNumber: '15337891',
          strategy: { id: '0x898111d1f4eb55025d0036568212425ee2274082' },
          sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
        },
        {
          id: '0x99cd95c4fd0c68c963142db17be61a8c2458ff6b5acda3aabe405a644adaee93-178',
          timestamp: 1660132736,
          token: {
            id: '0x0xfd05d3c7fe2924020620a8be4961bbaa747e6305',
            name: 'Badger Vested Escrow Convex Token',
            symbol: 'bveCVX',
            decimals: '18',
            totalSupply: '1146328308588079160439895',
          },
          amount: '18705595517466124968652',
          blockNumber: '15314213',
          strategy: { id: '0x0000000000000000000000000000000000000000' },
          sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
        },
        {
          id: '0x99cd95c4fd0c68c963142db17be61a8c2458ff6b5acda3aabe405a644adaee93-185',
          timestamp: 1660132736,
          token: {
            id: '0x3472a5a71965499acd81997a54bba8d852c6e53d',
            name: 'Badger',
            symbol: 'BADGER',
            decimals: '18',
            totalSupply: '21000000000000000000000000',
          },
          amount: '8418142660217834521465',
          blockNumber: '15314213',
          strategy: { id: '0x0000000000000000000000000000000000000000' },
          sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
        },
        {
          id: '0xba80fa9bdd08636514171ee7c54d6a5420d392111c4b08fa185e9677fea5d647-43',
          timestamp: 1660800880,
          token: {
            id: '0x0x2b5455aac8d64c14786c3a29858e43b5945819c0',
            name: 'Badger Sett Convex CRV',
            symbol: 'bcvxCRV',
            decimals: '18',
            totalSupply: '9680860937976920554007',
          },
          amount: '4223102994638643945171',
          blockNumber: '15363244',
          strategy: { id: '0x898111d1f4eb55025d0036568212425ee2274082' },
          sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
        },
      ],
    }));
  }

  describe('loadYieldEvents', () => {
    beforeEach(setupYieldMocks);

    describe('requesting an standard vault', () => {
      it('loads yield events from the subgraph', async () => {
        const result = await loadYieldEvents(chain, MOCK_VAULT_DEFINITION, TEST_CURRENT_BLOCK);
        expect(result).toMatchSnapshot();
      });
    });

    describe('encounters an error requesting an standard vault', () => {
      it('loads yield events from the subgraph', async () => {
        jest.spyOn(VaultsService.prototype, 'listHarvests').mockImplementation(async () => {
          throw new Error('Expected test error: listHarvests');
        });
        const result = await loadYieldEvents(chain, MOCK_VAULT_DEFINITION, TEST_CURRENT_BLOCK);
        expect(result).toMatchSnapshot();
      });
    });

    describe('requesting an influence vault', () => {
      it('loads yield events from the subgraph', async () => {
        const mockVault = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
        mockVault.address = TOKENS.BVECVX;
        const result = await loadYieldEvents(chain, mockVault, TEST_CURRENT_BLOCK);
        expect(result).toMatchSnapshot();
      });
    });
  });

  describe('queryVaultYieldEvents', () => {
    describe('no saved data', () => {
      it('returns 0', async () => {
        mockQuery([]);
        const result = await queryVaultYieldEvents(chain, MOCK_VAULT_DEFINITION);
        expect(result).toEqual([]);
      });
    });
    describe('previously stored harvest data', () => {
      it('returns relevant yield events for the current yield period', async () => {
        const expected = [MOCK_YIELD_EVENT];
        mockQuery(expected);
        const result = await queryVaultYieldEvents(chain, MOCK_VAULT_DEFINITION);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('queryVaultHistoricYieldEvents', () => {
    describe('no saved data', () => {
      it('returns 0', async () => {
        mockQuery([]);
        const result = await queryVaultHistoricYieldEvents(chain, MOCK_VAULT_DEFINITION);
        expect(result).toEqual([]);
      });
    });

    describe('previously stored harvest data', () => {
      it('returns all yield events for a vault', async () => {
        const expected = [MOCK_YIELD_EVENT];
        mockQuery(expected);
        const result = await queryVaultHistoricYieldEvents(chain, MOCK_VAULT_DEFINITION);
        expect(result).toEqual(expected);
      });
    });
  });
});
