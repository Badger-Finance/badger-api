import { TOKENS } from './tokens.config';
import { checksumEntries, getEnvVar } from './util';
import { Stage } from './enums/stage.enum';

describe('utils', () => {
  const oldNodeEnv = { ...process.env };

  function resetProccessEnv() {
    process.env = { ...oldNodeEnv };
  }

  afterAll(resetProccessEnv);

  describe('checksumEntries', () => {
    describe('given a valid address record with all lowercase addresses', () => {
      it('returns the address record with checksummed addresses', () => {
        const input = Object.fromEntries(Object.entries(TOKENS).map((e) => [e[0], e[1].toLowerCase()]));
        const actual = checksumEntries(input);
        expect(actual).toEqual(TOKENS);
      });
    });

    describe('given an invalid input', () => {
      it('throws an error', () => {
        expect(() => checksumEntries({ property: 'invalid ' })).toThrow();
      });
    });
  });

  describe('getEnvVar', () => {
    describe('in prod ENV', () => {
      it('return value', () => {
        const envVarName = 'RPC_NODE';

        process.env.NODE_ENV = Stage.Production;
        process.env[envVarName] = 'https://some.node.rpc.com';

        expect(getEnvVar(envVarName)).toBe(process.env[envVarName]);
        resetProccessEnv();
      });

      it('throw error, when no value', () => {
        const envVarName = 'RPC_NODE';

        process.env.NODE_ENV = Stage.Production;

        expect(() => getEnvVar(envVarName)).toThrow(Error);
        resetProccessEnv();
      });
    });

    describe('in Offline/Test ENV', () => {
      it('test return value', () => {
        const envVarName = 'RPC_NODE';

        process.env.NODE_ENV = 'test';
        process.env[envVarName] = 'https://some.node.rpc.com';

        expect(getEnvVar(envVarName)).toBe(process.env[envVarName]);
        resetProccessEnv();
      });

      it('offline return value', () => {
        const envVarName = 'RPC_NODE';

        process.env.IS_OFFLINE = 'true';
        process.env[envVarName] = 'https://some.node.rpc.com';

        expect(getEnvVar(envVarName)).toBe(process.env[envVarName]);
        resetProccessEnv();
      });

      it('test return placeholder string', () => {
        const envVarName = 'RPC_NODE';

        process.env.NODE_ENV = 'test';

        expect(getEnvVar(envVarName)).toBe('Missing value');
        resetProccessEnv();
      });

      it('offlline return placeholder string', () => {
        const envVarName = 'RPC_NODE';

        process.env.IS_OFFLINE = 'true';

        expect(getEnvVar(envVarName)).toBe('Missing value');
        resetProccessEnv();
      });
    });
  });
});
