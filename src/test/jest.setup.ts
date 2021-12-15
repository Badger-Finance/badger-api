// setup aws offline required test infrastructure
process.env.IS_OFFLINE = 'true';
process.env.STAGE = 'staging';
process.env.AWS_SECRET_ACCESS_KEY = 'X';
process.env.AWS_ACCESS_KEY_ID = 'X';

// setup required subgraph endpoints
process.env.UNISWAP = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';
process.env.SUSHISWAP = 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange';
process.env.PANCAKESWAP = 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange';
process.env.MASTERCHEF = 'https://api.thegraph.com/subgraphs/name/sushiswap/master-chef';
process.env.REWARD_DATA = 'badger-merkle-proofs-staging';
