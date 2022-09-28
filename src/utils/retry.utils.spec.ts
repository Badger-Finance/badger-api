import { rfw } from './retry.utils';

describe('retryFuncWrapper', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation();
  });

  it('should retry 2 times', async () => {
    const func = jest.fn(async () => {
      throw new Error('test');
    });

    const rf = rfw(func);
    await expect(rf()).rejects.toThrowError('test');
    expect(func).toHaveBeenCalledTimes(2);
  });

  it('should return value', async () => {
    const func = jest.fn(async () => {
      return 'test';
    });

    const rf = rfw(func);
    await expect(rf()).resolves.toEqual('test');
    expect(func).toHaveBeenCalledTimes(1);
  });
});
