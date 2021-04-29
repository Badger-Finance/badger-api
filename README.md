# Badger Serverless API

[![CI](https://github.com/Badger-Finance/badger-api/actions/workflows/main.yml/badge.svg)](https://github.com/Badger-Finance/badger-api/actions/workflows/main.yml)

Collection of serverless API to enable public access to data surrounding the BADGER protocol.

## Development

Install serverless framework

```bash
npm install -g serverless
```

Setup local [serverless credentials for AWS](https://www.serverless.com/framework/docs/providers/aws/cli-reference/config-credentials/)

```bash
serverless config credentials --provider aws --key something --secret somethingElse
```

Install project dependencies

```bash
yarn
```

Install DynamoDB libraries

```bash
yarn sls dynamodb install
```

Start the API locally

```bash
yarn dev
```

### Sett Options 

Sett path parameters are case sensitive and based on existing sett contracts.

- badger
- badger-wbtc
- renbtccrv
- tbtccrv
- sbtccrv
- hrenbtccrv
- slp-badger-wbtc
- slp-wbtc-eth
- digg
- slp-digg-wbtc
- digg-wbtc
