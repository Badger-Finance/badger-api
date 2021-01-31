# API v2 Endpoints

The initial Badger API was written quickly, and based off an existing API for other yield aggregators.
The API does not always follow best practices and has a lot of room for improvement namely discovery.

## Goals for v2

- Improve discoverability + reduce need for UI coordination
- Define and adhere to a consistent data model
- Optimize endpoint latency

### Addressing v2 Goals

The goals for v2 can be achieved in several ways, outlined below are initial thoughts on the steps to achieve them.
This serves as a brainstorming document - all information subject to change and may not be accurate at the time of reading.

### Improving Discoverability + Reduction in UI Coordination

Currently, it is up to the consumer of the API to read the documentation to understand all the end points.
This means a UI developer will need to store all these endpoints on their side and know precisely when to use them.
Introduction of two ideas should help alleviate the need for external consumers to worry about what endpoints to be hitting.

#### Available Actions Endpoint

```text
path: /
status: 200, 500
response: {
  'viewEndpoints': 'https://api.sett.vision/',
  'viewProtocolData': 'https://api.sett.vision/protocol',
  'listSetts': 'https://api.sett.vision/protocol/sett/',
  'viewSett': 'https://api.sett.vision/protocol/sett/(settName)',
}
```

#### Available Assets Endpoint

```text
path: /protocol/sett
status: 200, 500
response: [
  'badger',
  'badger-wbtc',
  'renbtccrv',
  ...
]
```

### Defining and Adhering to a Data Model

Prior to the move to typescript there was no enforceable data model for any given endpoint.
Moving forward we should define all information relevant to entities so that we can best organize the API.
Examples of redundancy currently can be found in the `/protocol/performance` and `/protocol/farm` endpoints.
Potential data models have been added below:

Token

```text
name: string
symbol: string
decimals: integer
price: float
```

Token Balance

```text
token: Token
balance: float
value: float
```

Performance

```text
threeDay: float
sevenDay: float
thirtyDay: float
```

Value Source

```text
name: string
apy: float
performance: Performance
```

The APY field on the value source will generally be the three day performance metric to represent current protocol conditions.
Other sampled performances are included however to allow for external consumers to display additional data.

Sett / Geyser

```text
name: string
asset: string
ppfs: float
value: float
tokens: TokenBalance[]
apy: float
sources: ValueSource[]
```

The above entity can be interchanged for sett / geysers to cover any operation or data a user may want to extract.
Key differences are how the information will be provided.
Sett requests will not include protocol emissions and thus will only have a single value source from underlying performance.
Geysers will have multiple value sources with each emitted coin being its own value source.

### Improving Latency

This issue has started to be addressed via the use of caching.
The next steps for improving latency are to implement the above api schema / data model to avoid redundancy.
This should serve as a better API model to allow consumers to grab data at varying granularities when appropriate.
