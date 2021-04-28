import { ethers } from 'ethers';
import { BADGER_URL, Protocol, Provider, TOKENS } from '../../config/constants';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { ethTokensConfig } from '../../tokens/config/eth-tokens.config';
import { ChainNetwork } from '../enums/chain-network.enum';
import { EthStrategy } from '../strategies/eth.strategy';
import { Chain } from './chain.config';

export class Ethereum extends Chain {
  constructor() {
    super(
      'Ethereum',
      'eth',
      '0x01',
      ethTokensConfig,
      ethSetts,
      new ethers.providers.JsonRpcProvider(Provider.Alchemy),
      new EthStrategy(),
      BADGER_URL,
      2425847,
    );
    Chain.register(ChainNetwork.Ethereum, this);
  }
}

export const ethSetts: SettDefinition[] = [
  {
    name: 'Curve.fi renBTC/wBTC/sBTC',
    createdBlock: 11380877,
    geyserAddress: '0x10fc82867013fce1bd624fafc719bb92df3172fc',
    depositToken: TOKENS.CRV_SBTC,
    settToken: TOKENS.BCRV_SBTC,
    symbol: 'sBTCCRV',
    protocol: Protocol.Curve,
  },
  {
    name: 'Curve.fi crvRenWBTC',
    createdBlock: 11380872,
    symbol: 'renBTCCRV',
    depositToken: TOKENS.CRV_RENBTC,
    settToken: TOKENS.BCRV_RENBTC,
    geyserAddress: '0x2296f174374508278dc12b806a7f27c87d53ca15',
    protocol: Protocol.Curve,
  },
  {
    name: 'Curve.fi tBTC/sBTCCrv LP',
    createdBlock: 11380878,
    symbol: 'tBTCCRV',
    depositToken: TOKENS.CRV_TBTC,
    settToken: TOKENS.BCRV_TBTC,
    geyserAddress: '0x085a9340ff7692ab6703f17ab5ffc917b580a6fd',
    protocol: Protocol.Curve,
  },
  {
    name: 'Harvest Curve.fi crvRenWBTC',
    createdBlock: 11380939,
    symbol: 'hrenBTCCRV',
    depositToken: TOKENS.CRV_RENBTC,
    settToken: TOKENS.BCRV_HRENBTC,
    geyserAddress: '0xed0b7f5d9f6286d00763b0ffcba886d8f9d56d5e',
    protocol: Protocol.Curve,
  },
  {
    name: 'Uniswap Wrapped BTC/Badger',
    createdBlock: 11380883,
    symbol: 'BADGER-WBTC',
    depositToken: TOKENS.UNI_BADGER_WBTC,
    settToken: TOKENS.BUNI_BADGER_WBTC,
    geyserAddress: '0xa207d69ea6fb967e54baa8639c408c31767ba62d',
    protocol: Protocol.Uniswap,
  },
  {
    name: 'Uniswap Wrapped BTC/Digg',
    createdBlock: 11680833,
    symbol: 'DIGG-WBTC',
    depositToken: TOKENS.UNI_DIGG_WBTC,
    settToken: TOKENS.BUNI_DIGG_WBTC,
    geyserAddress: '0x0194b5fe9ab7e0c43a08acbb771516fc057402e7',
    protocol: Protocol.Uniswap,
  },
  {
    name: 'Sushiswap Wrapped BTC/Wrapped Ether',
    createdBlock: 11539529,
    symbol: 'SLP-WBTC-ETH',
    depositToken: TOKENS.SUSHI_ETH_WBTC,
    settToken: TOKENS.BSUSHI_ETH_WBTC,
    geyserAddress: '0x612f681bcd12a0b284518d42d2dbcc73b146eb65',
    protocol: Protocol.Sushiswap,
  },
  {
    name: 'Sushiswap Wrapped BTC/Badger',
    createdBlock: 11537600,
    symbol: 'SLP-BADGER-WBTC',
    depositToken: TOKENS.SUSHI_BADGER_WBTC,
    settToken: TOKENS.BSUSHI_BADGER_WBTC,
    geyserAddress: '0xb5b654efba23596ed49fade44f7e67e23d6712e7',
    protocol: Protocol.Sushiswap,
  },
  {
    name: 'Sushiswap Wrapped BTC/Digg',
    createdBlock: 11681030,
    symbol: 'SLP-DIGG-WBTC',
    depositToken: TOKENS.SUSHI_DIGG_WBTC,
    settToken: TOKENS.BSUSHI_DIGG_WBTC,
    geyserAddress: '0x7f6fe274e172ac7d096a7b214c78584d99ca988b',
    protocol: Protocol.Sushiswap,
  },
  {
    name: 'Digg',
    createdBlock: 11680422,
    symbol: 'DIGG',
    depositToken: TOKENS.DIGG,
    settToken: TOKENS.BDIGG,
  },
  {
    name: 'Badger',
    createdBlock: 11380871,
    symbol: 'BADGER',
    depositToken: TOKENS.BADGER,
    settToken: TOKENS.BBADGER,
    geyserAddress: '0xa9429271a28f8543efffa136994c0839e7d7bf77',
  },
  {
    hasBouncer: true,
    createdBlock: 12246710,
    name: 'Yearn WBTC',
    symbol: 'byvWBTC',
    depositToken: TOKENS.WBTC,
    settToken: TOKENS.BVYWBTC,
    geyserAddress: '0x155482d1e2cb0909333326504f0ea4350760c927',
    affiliate: {
      protocol: Protocol.Yearn,
    },
  },
];
