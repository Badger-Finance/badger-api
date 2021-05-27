# Badger Serverless API

[![Service Tests](https://github.com/Badger-Finance/badger-api/actions/workflows/test.yml/badge.svg)](https://github.com/Badger-Finance/badger-api/actions/workflows/test.yml)
[![Deploy](https://github.com/Badger-Finance/badger-api/actions/workflows/deploy.yml/badge.svg)](https://github.com/Badger-Finance/badger-api/actions/workflows/deploy.yml)

Collection of serverless API to enable public access to data surrounding the Badger protocol.

## Development

To get started, run the environment setup script provided:

```bash
chmod +x setup.sh
./setup.sh
```

Or, install the following dependencies yourself:

- Node
- Serverless
- Java

Start the API:

```
yarn dev
```

### Local Testing

The API supports local (offline) testing of nearly all endpoints.
Certain endpoints which require access to AWS resources may not work appropriately without AWS credentials.
The databased used for local testing DynamoDB - a local version with exact table copies of production.
These tables are seeded with data located in the [seed folder](./seed).

**Note:
 Running only sls offline will not start or seed dynamo. Run sls offline start, or yarn dev instead.**
