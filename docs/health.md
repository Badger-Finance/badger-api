# Maintaining Health Endpoints
In the [health controller](../src/health/health.controller.ts), a number of health monitoring endpoints are defined that return basic health information on certain sources: APIs, smart contracts, subgraphs, and web3 providers. As sources are added, changed, or removed, the configuration for these endpoints will need to be updated.

## APIs

APIs can be added or removed by modifying the `apis` variable in the [health.config.ts](../src/health/health.config.ts) file:
```ts
export const apis: Endpoint[] = [
  { name: 'Some API', url: new URL('https://some.endpoint.com') },
  { name: 'Some Other API', url: new URL(SOME_ENV_VARIABLE) },
];
```
Valid return status codes are defined in `ApisHealthService` in [health.service.ts](../src/health/health.service.ts).

## Smart Contracts

Smart contracts' ABIs should be exported from the [abi folder](../src/config/abi/) depending on their chain.
For example Ethereum ABIs are exported from [health-eth-abis.ts](../src/config/abi/health-eth-abis.ts) whereas Binance Smart Chain ABIs are exported from [health-bsc-abis.ts](../src/config/abi/health-bsc-abis.ts).
ABIs should be defined in their own file similar to the following format:
```ts
export const contract = 'contractAddress';
export const abi = [
  {
    anonymous: false,
    inputs: [
      //...
    ],
    name: 'SomeEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      //...
    ],
    outputs: [
      //...
    ],
    name: 'SomeFunction',
    type: 'function',
  },
  //...
];
```

Addition or removal of chains requires code change to the `ContractsHealthService` defined in [health.service.ts](../src/health/health.service.ts).

## Subgraphs

Subgraphs (and their queries) can be added or removed by modifying the `subgraphs` variable in the [health.config.ts](../src/health/health.config.ts) file:
```ts
export const subgraphs: Subgraph[] = [
  {
    name: 'SOME SUBGRAPH',
    url: new URL(SOME_ENV_VARIABLE),
    query: gql`
      {
        someObject(first: 5) {
          id
          someProperty
        }
        someOtherObject(first: 5) {
          id
          someProperty
        }
      }
    `,
  },
  {
    name: 'SOME OTHER SUBGRAPH',
    url: new URL(SOME_OTHER_ENV_VARIABLE),
    query: gql`
      {
        someObject(first: 5) {
          id
          someProperty
        }
        someOtherObject(first: 5) {
          id
          someProperty
        }
      }
    `,
  },
];
```

## Web3 Providers

Web3 providers can be added or removed by modifying the `providers` variable in the [health.config.ts](../src/health/health.config.ts) file:
```ts
export const providers: Endpoint[] = [
  { name: 'ThisOne', url: new URL(Provider.ThisOne) },
  { name: 'ThatOne', url: new URL(Provider.ThatOne) },
];
```
