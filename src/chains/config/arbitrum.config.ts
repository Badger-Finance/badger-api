import { Network, Protocol, VaultState } from '@badger-dao/sdk';
import { Stage } from '../../config/enums/stage.enum';
import RPC from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { getCurveVaultTokenBalance } from '../../protocols/strategies/convex.strategy';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { arbitrumTokensConfig } from '../../tokens/config/arbitrum-tokens.config';
import { ArbitrumStrategy } from '../strategies/arbitrum.strategy';
import { Chain } from './chain.config';

export class Arbitrum extends Chain {
  constructor() {
    super(
      'Arbitrum',
      'arbitrum',
      '0xa4b1',
      Network.Arbitrum,
      arbitrumTokensConfig,
      arbitrumSetts,
      RPC[Network.Arbitrum],
      new ArbitrumStrategy(Object.keys(arbitrumTokensConfig)),
      2425847,
      '0x635EB2C39C75954bb53Ebc011BDC6AfAAcE115A6',
      '0x85E1cACAe9a63429394d68Db59E14af74143c61c',
      '0x78418681f9ed228d627f785fb9607ed5175518fd',
    );
    Chain.register(this.network, this);
  }

  async getGasPrices(): Promise<GasPrices> {
    return this.defaultGasPrice();
  }

  getBadgerTokenAddress(): string {
    return TOKENS.ARB_BADGER;
  }
}

export const arbitrumSetts: VaultDefinition[] = [
  {
    name: 'Wrapped Ether/Sushi Helper',
    vaultToken: TOKENS.BARB_SUSHI_WETH_SUSHI,
    depositToken: TOKENS.ARB_SUSHI_WETH_SUSHI,
    createdBlock: 13163959,
    protocol: Protocol.Sushiswap,
    strategy: '0x86f772C82914f5bFD168f99e208d0FC2C371e9C2',
  },
  {
    name: 'Sushiswap Wrapped BTC/Wrapped ETH',
    vaultToken: TOKENS.BARB_SUSHI_WETH_WBTC,
    depositToken: TOKENS.ARB_SUSHI_WETH_WBTC,
    createdBlock: 13163959,
    protocol: Protocol.Sushiswap,
    strategy: '0xA6827f0f14D0B83dB925B616d820434697328c22',
  },
  {
    name: 'renBTC/wBTC',
    vaultToken: TOKENS.BARB_CRV_RENBTC,
    depositToken: TOKENS.ARB_CRV_RENBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    createdBlock: 13237551,
    protocol: Protocol.Curve,
  },
  {
    name: 'Tricrypto',
    vaultToken: TOKENS.BARB_CRV_TRICRYPTO,
    depositToken: TOKENS.ARB_CRV_TRICRYPTO,
    getTokenBalance: getCurveVaultTokenBalance,
    createdBlock: 13237551,
    protocol: Protocol.Curve,
  },
  {
    name: 'Tricrypto Light',
    vaultToken: TOKENS.BARB_CRV_TRICRYPTO_LITE,
    depositToken: TOKENS.ARB_CRV_TRICRYPTO,
    getTokenBalance: getCurveVaultTokenBalance,
    createdBlock: 13321375,
    stage: Stage.Staging,
    state: VaultState.Experimental,
    protocol: Protocol.Curve,
  },
  {
    name: 'Swapr/Wrapped ETH',
    vaultToken: TOKENS.BARB_SWP_SWPR_WETH,
    depositToken: TOKENS.ARB_SWP_SWPR_WETH,
    createdBlock: 13315350,
    protocol: Protocol.Swapr,
  },
  {
    name: 'Swapr Wrapped BTC/Wrapped ETH',
    vaultToken: TOKENS.BARB_SWP_WBTC_WETH,
    depositToken: TOKENS.ARB_SWP_WBTC_WETH,
    createdBlock: 13315350,
    protocol: Protocol.Swapr,
  },
  {
    name: 'Badger/Wrapped ETH',
    vaultToken: TOKENS.BARB_SWP_BADGER_WETH,
    depositToken: TOKENS.ARB_SWP_BADGER_WETH,
    createdBlock: 2188169,
    protocol: Protocol.Swapr,
  },
  {
    name: 'ibBTC/Wrapped ETH',
    vaultToken: TOKENS.BARB_SWP_IBBTC_WETH,
    depositToken: TOKENS.ARB_SWP_IBBTC_WETH,
    createdBlock: 2188169,
    protocol: Protocol.Swapr,
  },
];
