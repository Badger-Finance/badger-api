import { Network, Protocol, VaultState } from '@badger-dao/sdk';
import { Stage } from '../../config/enums/stage.enum';
import RPC from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { getCurveVaultTokenBalance } from '../../protocols/strategies/convex.strategy';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { arbitrumTokensConfig } from '../../tokens/config/arbitrum-tokens.config';
import { Chain } from './chain.config';
import { BaseStrategy } from '../strategies/base.strategy';

export class Arbitrum extends Chain {
  constructor() {
    super(
      'Arbitrum',
      'arbitrum',
      '0xa4b1',
      Network.Arbitrum,
      arbitrumTokensConfig,
      RPC[Network.Arbitrum],
      arbitrumSetts,
      new BaseStrategy(Network.Arbitrum, Object.keys(arbitrumTokensConfig)),
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
    name: 'wETH/Sushi',
    vaultToken: TOKENS.BARB_SUSHI_WETH_SUSHI,
    depositToken: TOKENS.ARB_SUSHI_WETH_SUSHI,
    protocol: Protocol.Sushiswap,
    strategy: '0x86f772C82914f5bFD168f99e208d0FC2C371e9C2',
  },
  {
    name: 'wBTC/wETH',
    vaultToken: TOKENS.BARB_SUSHI_WETH_WBTC,
    depositToken: TOKENS.ARB_SUSHI_WETH_WBTC,
    protocol: Protocol.Sushiswap,
    strategy: '0xA6827f0f14D0B83dB925B616d820434697328c22',
  },
  {
    name: 'renBTC/wBTC',
    vaultToken: TOKENS.BARB_CRV_RENBTC,
    depositToken: TOKENS.ARB_CRV_RENBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    protocol: Protocol.Curve,
  },
  {
    name: 'Tricrypto',
    vaultToken: TOKENS.BARB_CRV_TRICRYPTO,
    depositToken: TOKENS.ARB_CRV_TRICRYPTO,
    getTokenBalance: getCurveVaultTokenBalance,

    protocol: Protocol.Curve,
  },
  {
    name: 'Tricrypto Light',
    vaultToken: TOKENS.BARB_CRV_TRICRYPTO_LITE,
    depositToken: TOKENS.ARB_CRV_TRICRYPTO,
    getTokenBalance: getCurveVaultTokenBalance,
    stage: Stage.Staging,
    state: VaultState.Experimental,
    protocol: Protocol.Curve,
  },
  {
    name: 'Swapr/wETH',
    vaultToken: TOKENS.BARB_SWP_SWPR_WETH,
    depositToken: TOKENS.ARB_SWP_SWPR_WETH,
    protocol: Protocol.Swapr,
  },
  {
    name: 'wBTC/wETH',
    vaultToken: TOKENS.BARB_SWP_WBTC_WETH,
    depositToken: TOKENS.ARB_SWP_WBTC_WETH,
    protocol: Protocol.Swapr,
  },
  {
    name: 'Badger/wETH',
    vaultToken: TOKENS.BARB_SWP_BADGER_WETH,
    depositToken: TOKENS.ARB_SWP_BADGER_WETH,
    protocol: Protocol.Swapr,
  },
  {
    name: 'ibBTC/wETH',
    vaultToken: TOKENS.BARB_SWP_IBBTC_WETH,
    depositToken: TOKENS.ARB_SWP_IBBTC_WETH,
    protocol: Protocol.Swapr,
  },
];
