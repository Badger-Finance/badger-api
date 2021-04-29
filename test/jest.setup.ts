import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

// setup aws offline required test infrastructure
process.env.IS_OFFLINE = 'true';
process.env.AWS_SECRET_ACCESS_KEY = 'X';
process.env.AWS_ACCESS_KEY_ID = 'X';
