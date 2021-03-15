import { SettDefinition } from '../../interface/Sett';
import { Protocol } from '../constants';

export const bscSetts: SettDefinition[] = [
  {
    name: 'Pancakeswap BNB/BTCB',
    symbol: 'PLP-BNB-BTCB',
    depositToken: '0x7561EEe90e24F3b348E1087A005F78B4c8453524',
    settToken: '0xF6BC36280F32398A031A7294e81131aEE787D178',
    protocol: Protocol.Pancakeswap,
  },
];
