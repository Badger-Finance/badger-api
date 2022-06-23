/* eslint-disable @typescript-eslint/ban-ts-comment */
import BadgerSDK, { ListRewardsOptions, VaultV15__factory } from '@badger-dao/sdk';
import { VaultState } from '@badger-dao/sdk/lib/api';
import { CitadelRewardType } from '@badger-dao/sdk/lib/api/enums/citadel-reward-type.enum';
import { CitadelService } from '@badger-dao/sdk/lib/citadel';
import { RewardEventTypeEnum } from '@badger-dao/sdk/lib/citadel/enums/reward-event-type.enum';
import { ListRewardsEvent } from '@badger-dao/sdk/lib/citadel/interfaces/list-rewards-event.interface';
import { VaultV15 } from '@badger-dao/sdk/lib/contracts/VaultV15';
import { VaultVersion } from '@badger-dao/sdk/lib/vaults';
import { LoadVaultOptions } from '@badger-dao/sdk/lib/vaults/interfaces';
import { VaultsService } from '@badger-dao/sdk/lib/vaults/vaults.service';
import { BigNumber, ethers } from 'ethers';
import { mock } from 'jest-mock-extended';

import { CitadelRewardsSnapshot } from '../aws/models/citadel-rewards-snapshot';
import { Chain } from '../chains/config/chain.config';
import { Ethereum } from '../chains/config/eth.config';
import { TOKENS } from '../config/tokens.config';
import * as citadelGraph from '../graphql/generated/citadel';
import * as priceUtils from '../prices/prices.utils';
import { mockBadgerSdk, setupMapper, TEST_ADDR } from '../test/tests.utils';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import { Nullable } from '../utils/types.utils';
import * as citadelUtils from './citadel.utils';
import {
  dataTypeRawKeyToKeccak,
  getRewardsAprForDataBlob,
  getRewardsEventTypeMapped,
  getRewardsOnchain,
  getStakedCitadelEarnings,
  getStakedCitadelPrice,
  getTokensPaidSummary,
} from './citadel.utils';
import { citadelListRewardsSdkMock } from './mocks/citadel-list-rewards.sdk.mock';
import { RewardsSnapshotModelMock } from './mocks/rewards-snapshot.model.mock';

const CURRENT_BLOCK = RewardsSnapshotModelMock[0].block;

describe('getRewardsOnchain', () => {
  let sdk: BadgerSDK;

  let listRewardsMock: jest.SpyInstance<Promise<ListRewardsEvent[]>, [options?: ListRewardsOptions | undefined]>;
  let getLastRewardByTypeMock: jest.SpyInstance<Promise<Nullable<CitadelRewardsSnapshot>>, [type: string]>;

  beforeEach(async () => {
    listRewardsMock = jest
      .spyOn(CitadelService.prototype, 'listRewards')
      .mockImplementation(async () => citadelListRewardsSdkMock);

    getLastRewardByTypeMock = jest
      .spyOn(citadelUtils, 'getLastRewardByType')
      .mockImplementation(async () => RewardsSnapshotModelMock[0]);

    sdk = await mockBadgerSdk({ currBlock: CURRENT_BLOCK });

    await sdk.ready();
  });

  it('returns rewards from the last block param', async (done) => {
    const rewards = await getRewardsOnchain(sdk, RewardEventTypeEnum.ADDED, true);

    expect(getLastRewardByTypeMock.mock.calls.length).toBe(1);
    expect(listRewardsMock).toHaveBeenCalledWith({ filter: RewardEventTypeEnum.ADDED, startBlock: CURRENT_BLOCK + 1 });
    expect(rewards).toMatchObject(citadelListRewardsSdkMock);

    done();
  });

  it('returns rewards all reward from when contract was deployed', async (done) => {
    const rewards = await getRewardsOnchain(sdk, RewardEventTypeEnum.ADDED);

    expect(getLastRewardByTypeMock.mock.calls.length).toBe(0);
    expect(listRewardsMock).toHaveBeenCalledWith({ filter: RewardEventTypeEnum.ADDED });
    expect(rewards).toMatchObject(citadelListRewardsSdkMock);

    done();
  });

  it('throws error if something went wrong in onchain call', async (done) => {
    jest.spyOn(CitadelService.prototype, 'listRewards').mockImplementation(async () => {
      throw Error('Bad things');
    });
    await expect(async () => getRewardsOnchain(sdk, RewardEventTypeEnum.ADDED)).rejects.toThrowError();

    done();
  });
});

describe('getRewardsAprForDataBlob', () => {
  it('returns rewards apr', async (done) => {
    setupMapper(RewardsSnapshotModelMock.filter((rw) => rw.payType === RewardEventTypeEnum.ADDED));

    const rwSummary = await getRewardsAprForDataBlob();

    expect(rwSummary).toMatchSnapshot();
    done();
  });
});

describe('getTokensPaidSummary', () => {
  it('should return rewards tokens paid summary', async (done) => {
    setupMapper(RewardsSnapshotModelMock.filter((rw) => rw.payType === RewardEventTypeEnum.PAID));

    const tokensPaidRwSummary = await getTokensPaidSummary();

    expect(tokensPaidRwSummary).toMatchSnapshot();
    done();
  });
});

describe('dataTypeRawKeyToKeccak', () => {
  const CITADEL_RW_TYPE_STR = 'xcitadel-locker-emissions';

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => void 0);
  });

  it('returns valid Keccak256 hash', () => {
    const citadelRwTypeHashed = ethers.utils.solidityKeccak256(['string'], [CITADEL_RW_TYPE_STR]);

    expect(dataTypeRawKeyToKeccak(CITADEL_RW_TYPE_STR)).toBe(citadelRwTypeHashed);
  });

  it('returns empty string for invalid type', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(dataTypeRawKeyToKeccak(null)).toBe('');
  });
});

describe('getRewardsEventTypeMapped', () => {
  const CITADEL_RW_TYPE_HASH = ethers.utils.solidityKeccak256(['string'], ['xcitadel-locker-emissions']);

  it('returns corret CitadelRewardType enum value', () => {
    expect(getRewardsEventTypeMapped(CITADEL_RW_TYPE_HASH)).toBe(CitadelRewardType.Citadel);
  });

  it('returns default enum value for unknown keys', () => {
    expect(getRewardsEventTypeMapped('unknown')).toBe(CitadelRewardType.Tokens);
  });
});

describe('getStakedCitadelPrice', () => {
  it('returns staked price and addr', async (done) => {
    jest.spyOn(VaultsService.prototype, 'loadVault').mockImplementation(async ({ address }: LoadVaultOptions) => ({
      address,
      name: 'Citadel',
      available: 500000,
      balance: 300,
      totalSupply: 1800000000,
      pricePerFullShare: 15,
      token: fullTokenMockMap[TOKENS.BADGER],
      state: VaultState.Open,
      version: VaultVersion.v1_5,
      symbol: 'BDGR',
      decimals: 18,
    }));

    jest.spyOn(priceUtils, 'getPrice').mockImplementation(async (token: string) => {
      return {
        [TOKENS.CTDL]: { address: TOKENS.CTDL, price: 21 },
      }[token];
    });

    const ethChain = mock<Ethereum>();
    ethChain.getSdk.calledWith().mockImplementation(() => mockBadgerSdk({}));

    const stakedPrice = await getStakedCitadelPrice(ethChain, fullTokenMockMap[TOKENS.BADGER]);

    expect(stakedPrice).toMatchSnapshot();
    done();
  });
});

describe('getStakedCitadelEarnings', () => {
  beforeEach(async () => {
    const citadelGraphSdkMock = {
      VaultBalance: async () => ({
        vaultBalance: {
          netShareDeposit: BigNumber.from(`${123e18}`),
          grossDeposit: BigNumber.from(`${34e18}`),
          grossWithdraw: BigNumber.from(`${566e18}`),
        },
      }),
    };
    // @ts-ignore
    jest.spyOn(citadelGraph, 'getSdk').mockImplementation(() => citadelGraphSdkMock);

    const ethChain = mock<Ethereum>();
    ethChain.getSdk.calledWith().mockImplementation(() => mockBadgerSdk({}));
    jest.spyOn(Chain, 'getChain').mockImplementation(() => ethChain);

    const vaultV15 = mock<VaultV15>();
    jest.spyOn(VaultV15__factory, 'connect').mockImplementation(() => vaultV15);
    vaultV15.getPricePerFullShare.calledWith().mockImplementation(async () => BigNumber.from(150));
  });

  it('returns staked earnings', async () => {
    const earnings = await getStakedCitadelEarnings(TEST_ADDR);
    expect(earnings).toBe(532);
  });

  it('returns 0, when cant get vaultBalance', async () => {
    const citadelGraphSdkMock = {
      VaultBalance: async () => ({ vaultBalance: null }),
    };
    // @ts-ignore
    jest.spyOn(citadelGraph, 'getSdk').mockImplementation(() => citadelGraphSdkMock);

    const earnings = await getStakedCitadelEarnings(TEST_ADDR);
    expect(earnings).toBe(0);
  });
});
