<p style="text-align: center" align="center">
  <a href="https://badger.com" target="_blank"><img src="docs/images/badger_warlock.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
  <h1>Badger API</h1>
  <div align="center">
    <a href="https://app.badger.com/">Application</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://api.badger.com/docs">Swagger</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://discord.gg/KGhSqxPPnn">Discord</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://twitter.com/BadgerDAO">Twitter</a>
  </div>
  <hr />
  <br />

[![Service Tests](https://github.com/Badger-Finance/badger-api/actions/workflows/test.yml/badge.svg)](https://github.com/Badger-Finance/badger-api/actions/workflows/test.yml)
[![Deploy](https://github.com/Badger-Finance/badger-api/actions/workflows/deploy.yml/badge.svg)](https://github.com/Badger-Finance/badger-api/actions/workflows/deploy.yml)
[![Test Coverage](https://github.com/Badger-Finance/badger-api/actions/workflows/coverage.yml/badge.svg)](https://github.com/Badger-Finance/badger-api/actions/workflows/coverage.yml)

  <hr />
</div>

> Collection of serverless API to enable public access to data surrounding the Badger protocol.

## Development

To get started, install the following dependencies:

- Node
- Java

**Note: If you are running on an M1 Mac you will have to install the x86 version of Java and run the following commands in [Rosetta](https://osxdaily.com/2020/11/18/how-run-homebrew-x86-terminal-apple-silicon-mac/)**

Setup project dependencies:

```bash
yarn install --frozen-lockfile
npm install -g serverless
sls dynamodb install
```

In case if u don't have `.aws` credentials yet

```sh
sls config credentials --provider aws \
 --key <aws_access_key_id>
 --secret <aws_secret_access_key>
```

> Contact **Tritium | BadgerDAO#4816** for AWS access if required.
> After getting keys, complite the [MFA](./docs/mfa.md) section.

#### Git

Badger accepts only verified commits, this can be done by signing
them with gpg keys. For more info, proceed to
[github gpg doc](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key).

### Environment Variables

Variables are handled by a combination of dot env files, and the serverless manifest.
An example file is available at [.env.example](./.env.example).

Before running the API, make sure to create a local `.env` file:

```
cp .env.example .env
```

Update the RPC values and Graph API key with data from the DevOps team or your own endpoints.

> Contact **jintao#0713** for RPC or TheGraph access if required.

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
