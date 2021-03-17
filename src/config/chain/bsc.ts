import { SettDefinition } from '../../interface/Sett';
import { Protocol, TOKENS } from '../constants';

export const bscSetts: SettDefinition[] = [
  {
    name: 'Pancakeswap BNB/BTCB',
    symbol: 'PLP-BNB-BTCB',
    depositToken: TOKENS.PANCAKE_BNB_BTCB,
    settToken: '0xF6BC36280F32398A031A7294e81131aEE787D178',
    protocol: Protocol.Pancakeswap,
  },
  {
    name: 'Pancakeswap bBADGER/BTCB',
    symbol: 'PLP-BBADGER-BTCB',
    depositToken: TOKENS.PANCAKE_BBADGER_BTCB,
    settToken: '0xba89fec5081ce1cdf24ab897fb80f6e9e6d3fda1',
    protocol: Protocol.Pancakeswap,
  },
  {
    name: 'Pancakeswap bDIGG/BTCB',
    symbol: 'PLP-BDIGG-BTCB',
    depositToken: TOKENS.PANCAKE_BDIGG_BTCB,
    settToken: '0xa71ebba5f3f24e84be96240264ae5de38b63860d',
    protocol: Protocol.Pancakeswap,
  },
];
