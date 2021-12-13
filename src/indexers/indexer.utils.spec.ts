import { Ethereum } from '../chains/config/eth.config';
import { TOKENS } from '../config/tokens.config';
import { getVaultDefinition } from '../vaults/vaults.utils';
import { mockBatchPut, randomAccount, setupMapper, TEST_ADDR } from '../test/tests.utils';
import { batchRefreshAccounts, chunkArray, getIndexedBlock, getLatestMetadata } from './indexer.utils';
import * as tokenUtils from '../tokens/tokens.utils';
import * as accountsUtils from '../accounts/accounts.utils';
import { UserClaimMetadata } from '../rewards/entities/user-claim-metadata';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { ethers } from 'ethers';

describe('indexer.utils', () => {
  const chain = new Ethereum();
  const testDefinition = getVaultDefinition(chain, TOKENS.BBADGER);

  describe('getIndexedBlock', () => {
    describe('encounters an error', () => {
      it('returns a properly aligned start block', async () => {
        setupMapper([]);
        jest.spyOn(tokenUtils, 'getToken').mockImplementationOnce((_addr) => {
          throw new Error();
        });
        const block = await getIndexedBlock(testDefinition, 15, 10);
        expect(block).toEqual(10);
      });
    });

    describe('has not indexed the sett', () => {
      it.each([
        [15, 10, 10],
        [10, 10, 10],
        [20, 10, 20],
        [15, 16, 0],
        [0, 16, 0],
      ])('returns %i start block with %i alignment as %i', async (start, alignment, result) => {
        setupMapper([]);
        const block = await getIndexedBlock(testDefinition, start, alignment);
        expect(block).toEqual(result);
      });
    });

    describe('has indexed the sett', () => {
      it.each([
        [15, 10, 140, 140],
        [10, 10, 150, 150],
        [20, 10, 200, 200],
        [15, 16, 64, 64],
        [0, 16, 32, 32],
      ])('returns %i start block with %i alignment as %i', async (start, alignment, result, stored) => {
        setupMapper([{ height: stored }]);
        const block = await getIndexedBlock(testDefinition, start, alignment);
        expect(block).toEqual(result);
      });
    });
  });

  describe('chunkArray', () => {
    it('should split into equal chunks', async () => {
      const data = [];
      const arrayLen = 1000;
      const chunkSize = 10;
      for (let i = 0; i < arrayLen; i++) {
        data.push(TEST_ADDR);
      }
      const chunked = chunkArray(data, chunkSize);
      expect(chunked.length).toEqual(10);
      chunked.forEach((chunk) => {
        expect(chunk.length).toEqual(arrayLen / chunkSize);
      });
    });
  });

  describe('batchRefreshAccounts', () => {
    it('performs the batch operation on all accounts', async () => {
      const accounts = Object.keys(TOKENS).sort();
      const getAccounts = jest.spyOn(accountsUtils, 'getAccountMap').mockImplementation(async () =>
        Object.fromEntries(
          accounts.map((a) => {
            return [a, randomAccount(a)];
          }),
        ),
      );
      mockBatchPut([]);
      const operatedAccounts: string[] = [];
      await batchRefreshAccounts(accounts, (accts) => {
        Object.keys(accts).forEach((a) => operatedAccounts.push(a));
        return [];
      });
      const queriedAccounts = getAccounts.mock.calls.flatMap((c) => c[0]);
      expect(accounts).toMatchObject(queriedAccounts.sort());
      expect(accounts).toMatchObject(operatedAccounts.sort());
    });
  });
  describe('getLatestMetadata', () => {
    it('should not create new meta obj if exists', async () => {
      const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
      const meta = Object.assign(new UserClaimMetadata(), {
        startBlock: 100,
        endBlock: 101,
        chainStartBlock: `${chain.network}_123123`,
        chain: chain.network,
      });
      setupMapper([meta]);
      const latest_meta = await getLatestMetadata(chain);
      expect(latest_meta).toEqual(meta);
      expect(put.mock.calls).toEqual([]);
    });
    it('should create new meta if no meta obj found', async () => {
      const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
      const mockedBlockNumber = 100;
      jest
        .spyOn(ethers.providers.JsonRpcProvider.prototype, 'getBlockNumber')
        .mockImplementation(() => Promise.resolve(mockedBlockNumber));
      const expected = Object.assign(new UserClaimMetadata(), {
        startBlock: 100,
        endBlock: 101,
        chainStartBlock: `${chain.network}_${mockedBlockNumber}`,
        chain: chain.network,
      });
      setupMapper([]);
      await getLatestMetadata(chain);
      expect(put.mock.calls[0][0]).toEqual(expected);
    });
  });
});
