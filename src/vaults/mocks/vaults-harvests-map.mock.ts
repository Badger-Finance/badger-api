import { TOKENS } from '../../config/tokens.config';

export const vaultsHarvestsMapMock = {
  [TOKENS.BCRV_SBTC]: [
    {
      timestamp: 1636878824,
      block: 13612910,
      amount: {
        type: 'BigNumber',
        hex: '0x11bc85620d1c13',
      },
      token: '0x2B5455aac8d64C14786c3a29858E43b5945819C0',
      eventType: 'harvest',
      strategyBalance: '2481941296192304936740',
      estimatedApr: 0,
    },
    {
      timestamp: 1636878824,
      block: 13612910,
      token: '0x2B5455aac8d64C14786c3a29858E43b5945819C0',
      amount: {
        type: 'BigNumber',
        hex: '0x04902162b832b3c7c4',
      },
      eventType: 'TreeDistribution',
      strategyBalance: '2481941296192304936740',
      estimatedApr: 0,
    },
  ],
  [TOKENS.BCRV_TBTC]: [
    {
      timestamp: 1636848055,
      block: 13610723,
      amount: {
        type: 'BigNumber',
        hex: '0x4514c6e7873d0b',
      },
      token: '0x2B5455aac8d64C14786c3a29858E43b5945819C0',
      eventType: 'harvest',
      strategyBalance: '675727035262732777863',
      estimatedApr: 0,
    },
    {
      timestamp: 1636848055,
      block: 13610723,
      token: '0x2B5455aac8d64C14786c3a29858E43b5945819C0',
      amount: {
        type: 'BigNumber',
        hex: '0x1c296979f500eefe0a',
      },
      eventType: 'TreeDistribution',
      strategyBalance: '675727035262732777863',
      estimatedApr: 0,
    },
    {
      timestamp: 1636848055,
      block: 13610723,
      token: '0xfd05D3C7fe2924020620A8bE4961bBaA747e6305',
      amount: {
        type: 'BigNumber',
        hex: '0x06ed2c631f4ce367a5',
      },
      eventType: 'TreeDistribution',
      strategyBalance: '675727035262732777863',
      estimatedApr: 0,
    },
    {
      timestamp: 1637345136,
      block: 13647052,
      amount: {
        type: 'BigNumber',
        hex: '0x02ba879860169b74',
      },
      token: '0x2B5455aac8d64C14786c3a29858E43b5945819C0',
      eventType: 'harvest',
      strategyBalance: '671287226957783902004',
      estimatedApr: 0,
    },
  ],
};
