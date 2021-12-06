import { Ethereum } from '../chains/config/eth.config';
import { TOKENS } from '../config/tokens.config';
import { getSettDefinition } from '../setts/setts.utils';
import { setupMapper, TEST_ADDR } from '../test/tests.utils';
import * as tokenUtils from '../tokens/tokens.utils';
import { chunkArray, getIndexedBlock } from './indexer.utils';

describe('indexer.utils', () => {
  const chain = new Ethereum();
  const testDefinition = getSettDefinition(chain, TOKENS.BBADGER);

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
});
