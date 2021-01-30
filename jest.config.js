const nodeEnv = process.env.NODE_ENV || 'test';
process.env.NODE_ENV = nodeEnv;

if (nodeEnv !== 'test' && nodeEnv !== 'ci') {
	throw new Error(`Wrong environment for running tests, should be 'test' or 'ci'. NODE_ENV=${nodeEnv}`);
}

module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	automock: false,
	testRegex: 'test/.*.spec.ts$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	testTimeout: 30000,
};

//	setupFilesAfterEnv: ['./test/jest.setup.ts'],
