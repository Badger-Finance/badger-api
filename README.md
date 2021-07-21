# Badger Serverless API

[![Service Tests](https://github.com/Badger-Finance/badger-api/actions/workflows/test.yml/badge.svg)](https://github.com/Badger-Finance/badger-api/actions/workflows/test.yml)
[![Deploy](https://github.com/Badger-Finance/badger-api/actions/workflows/deploy.yml/badge.svg)](https://github.com/Badger-Finance/badger-api/actions/workflows/deploy.yml)
[![Test Coverage](https://github.com/Badger-Finance/badger-api/actions/workflows/coverage.yml/badge.svg)](https://github.com/Badger-Finance/badger-api/actions/workflows/coverage.yml)

Collection of serverless API to enable public access to data surrounding the Badger protocol.

Interactive Swagger Documentation  
https://docs.badger.finance/

## Development

To get started, install the following dependencies:

- Node
- Java

Setup project dependencies:

```bash
npm install -g serverless
sls dynamodb install
sls config credentials --provider aws --key x --secret x
```

Contact **Tritium | BadgerDAO#4816** for AWS access if required.

### Environment Variables

Variables are handled by a combination of dot env files, and the serverless manifest.
An example file is available at [.env.example](./.env.example).

Before running the API, make sure to create a local `.env` file:

```
cp .env.example .env
```

Update the RPC values and Graph API key with data from the DevOps team or your own endpoints.

Contact **jintao#0713** for RPC or TheGraph access if required.

### AWS Lambda Environment

```
yarn dev
```

**Note: You cannot view Swagger documentation via Serverless**

### Express Environment

```
npx ts-node src/index.ts
```

- [Swagger UI](http://localhost:8080/docs)
- [Swagger JSON](http://localhost:8080/docs/swagger.json)

Express is not the recommended development environment as implmentations will execute in lambda.
Serverless offline framework is the closest to production execution environment.

### Local Testing

The API supports local (offline) testing of nearly all endpoints.
Certain endpoints which require access to AWS resources may not work appropriately without AWS credentials.
The databased used for local testing DynamoDB - a local version with exact table copies of production.
These tables are seeded with data located in the [seed folder](./seed).

**Note: Running only sls offline will not start or seed dynamo. Run sls offline start, or yarn dev instead.**
