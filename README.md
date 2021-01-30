# Badger Serverless API

Collection of serverless API to enable public access to data surrounding the BADGER protocol.

## Development

Install serverless framework

```bash
npm install -g serverless
```

Install project dependencies

```bash
yarn
```

Decrypt secrets file
```bash
sls decrypt --stage <staing | prod> --password <password>
```

Currently no values are used from the secrets file.
Adding the following as empty files will allow you to run the API without being bothered by missing secrets files:

- `secrets/secrets.staging.yml`
- `secrets/secrets.prod.yml`

Start the API locally

```bash
sls offline
```

### Resources

- [Swagger API Documentation](https://docs.sett.vision/)

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
