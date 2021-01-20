const AWS = require("aws-sdk");
const Web3 = require("web3");
const fetch = require("node-fetch");
const { UNI_BADGER, RENBTC, SBTC, BADGER, TBTC, SUSHI_BADGER, SUSHI_WBTC, DIGG, UNI_DIGG, SUSHI_DIGG } = require("./constants");
const ddb = new AWS.DynamoDB.DocumentClient({apiVersion: "2012-08-10"});
const web3 = new Web3(new Web3.providers.HttpProvider(`https://:${process.env.INFURA_PROJECT_SECRET}@mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`));

module.exports.respond = (statusCode, body) => {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    ...body && { body: JSON.stringify(body) },
  };
};

module.exports.getBlock = async (blockNumber) => await web3.eth.getBlock(blockNumber);

module.exports.saveItem = async (table, item) => {
  let params = {
    TableName: table,
    Item: item
  };
  return await ddb.put(params).promise();
};

module.exports.getAssetData = async (table, asset, count) => {
  let params = {
    TableName : table,
    KeyConditionExpression: "asset = :asset",
    ExpressionAttributeValues: {
        ":asset": asset
    },
  };

  if (count) {
    params = { 
      ...params,
      Limit: count,
      ScanIndexForward: false,
    };
  }

  const data = await ddb.query(params).promise();
  return count ? data.Items.reverse() : data.Items;
};

module.exports.getIndexedBlock = async (table, asset, createdBlock) => {
  const params = {
    TableName: table,
    KeyConditionExpression: "asset = :asset",
    ExpressionAttributeValues: {
        ":asset": asset
    },
    ScanIndexForward: false,
    Limit: 1,
  };
  let result = await ddb.query(params).promise();
  return result.Items.length > 0 ? result.Items[0].height : createdBlock;
};

module.exports.getContractPrice = async (contract) => {
  return await fetch(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contract}&vs_currencies=usd`)
  .then(response => response.json())
  .then(json => {
    if (json[contract]) {
      return json[contract].usd;
    }
    return undefined;
  });
};

module.exports.getTokenPrice = async (token) => {
  return await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`)
    .then(response => response.json())
    .then(json => json[token].usd);
};

module.exports.getSett = async (contract, block) => {
  let query = `
    {
      sett(id: "${contract}"${block ? `, block: {number: ${block}}`: ""}) {
        token {
          id
        }
        balance
        pricePerFullShare
        totalSupply
      }
    }
  `;
  return await fetch(process.env.BADGER, {
    method: "POST",
    body: JSON.stringify({query})
  }).then(response => response.json());
};

module.exports.getGeysers = async () => {
  let query = `
    {
      geysers(orderDirection: asc) {
        id
        stakingToken {
          id
        }
        netShareDeposit
        cycleDuration
        cycleRewardTokens
      },
      setts(orderDirection: asc) {
        id
        token {
          id
        }
        pricePerFullShare
      }
    }
  `;
  return await fetch(process.env.BADGER, {
    method: "POST",
    body: JSON.stringify({query})
  }).then(response => response.json());
};

module.exports.getUniswapPair = async (token, block) => {
  const query = `
    {
      pair(id: "${token}"${block ? `, block: {number: ${block}}`: ""}) {
        reserveUSD
        totalSupply
      }
    }
  `;
  return await fetch(process.env.UNISWAP, {
    method: "POST",
    body: JSON.stringify({query})
  }).then(response => response.json());
};

module.exports.getUniswapPrice = async (token) => {
  const uniswapPair = await this.getUniswapPair(token);
  const reserveUSD = uniswapPair.data.pair.reserveUSD;
  const liquidityPrice = (1 / uniswapPair.data.pair.totalSupply);
  return reserveUSD * liquidityPrice;
};

module.exports.getSushiswapPair = async (token, block) => {
  const query = `
    {
      pair(id: "${token}"${block ? `, block: {number: ${block}}`: ""}) {
        reserve0
        reserve1
        token0 {
          id
        }
        token1 {
          id
        }
        totalSupply
      }
    }
  `;
  return await fetch(process.env.SUSHISWAP, {
    method: "POST",
    body: JSON.stringify({query})
  }).then(response => response.json());
};

module.exports.getSushiswapPrice = async (token) => {
  const pair = (await this.getSushiswapPair(token)).data.pair;
  const token0Price = await this.getContractPrice(pair.token0.id);
  const token1Price = await this.getContractPrice(pair.token1.id);
  return (token0Price * pair.reserve0 + token1Price * pair.reserve1) / pair.totalSupply;
};

module.exports.getPrices = async () => {
  const prices = await Promise.all([
    this.getTokenPrice("tbtc"),
    this.getContractPrice(SBTC),
    this.getContractPrice(RENBTC),
    this.getContractPrice(BADGER),
    this.getUniswapPrice(UNI_BADGER),
    this.getSushiswapPrice(SUSHI_BADGER),
    this.getSushiswapPrice(SUSHI_WBTC),
    this.getContractPrice(DIGG),
    this.getUniswapPrice(UNI_DIGG),
    this.getSushiswapPrice(SUSHI_DIGG),
  ]);
  return {
    tbtc: prices[0],
    sbtc: prices[1],
    renbtc: prices[2],
    badger: prices[3],
    unibadger: prices[4],
    sushibadger: prices[5],
    sushiwbtc: prices[6],
    digg: prices[7],
    unidigg: prices[8],
    sushidigg: prices[9],
  };
};

module.exports.getUsdValue = (asset, tokens, prices) => {
  switch (asset) {
    case UNI_BADGER:
      return tokens * prices.unibadger;
    case BADGER:
      return tokens * prices.badger;
    case TBTC:
      return tokens * prices.tbtc;
    case SBTC:
      return tokens * prices.sbtc;
    case RENBTC:
      return tokens * prices.renbtc;
    case SUSHI_BADGER:
      return tokens * prices.sushibadger;
    case SUSHI_WBTC:
      return tokens * prices.sushiwbtc;
    case DIGG: 
      return tokens * prices.digg;
    case UNI_DIGG: 
      return tokens * prices.unidigg;
    case SUSHI_DIGG: 
      return tokens * prices.sushidigg;
    default:
      return 0;
  }
};

module.exports.getMasterChef = async () => {
  let query = `
    {
      masterChefs(first: 1) {
        id
        totalAllocPoint
        sushiPerBlock
      },
      pools(where: {allocPoint_gt: 0}, orderBy: allocPoint, orderDirection: desc) {
        id
        pair
        balance
        allocPoint
        lastRewardBlock
        accSushiPerShare
      }
    }
  `;
  return await fetch(process.env.MASTERCHEF, {
    method: "POST",
    body: JSON.stringify({query})
  }).then(response => response.json());
};
