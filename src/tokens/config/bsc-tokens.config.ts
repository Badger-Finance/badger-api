import { Network } from "@badger-dao/sdk";

import { TOKENS } from "../../config/tokens.config";
import { PricingType } from "../../prices/enums/pricing-type.enum";
import { TokenConfig } from "../interfaces/token-config.interface";

export const bscTokensConfig: TokenConfig = {
  [TOKENS.CAKE]: {
    lookupName: "pancakeswap-token",
    type: PricingType.LookupName
  },
  [TOKENS.WBNB]: {
    lookupName: "binancecoin",
    type: PricingType.LookupName
  },
  [TOKENS.BTCB]: {
    lookupName: "binance-bitcoin",
    type: PricingType.LookupName
  },
  [TOKENS.PANCAKE_BNB_BTCB]: {
    lpToken: true,
    type: PricingType.UniV2LP
  },
  [TOKENS.PANCAKE_OLD_BNB_BTCB]: {
    lpToken: true,
    type: PricingType.UniV2LP
  },
  [TOKENS.PANCAKE_BBADGER_BTCB]: {
    lpToken: true,
    type: PricingType.UniV2LP
  },
  [TOKENS.PANCAKE_BDIGG_BTCB]: {
    lpToken: true,
    type: PricingType.UniV2LP
  },
  [TOKENS.MULTI_BADGER]: {
    lookupName: "badger-dao",
    type: PricingType.Contract
  },
  [TOKENS.BSC_BBADGER]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.BBADGER,
      network: Network.Ethereum
    }
  },
  [TOKENS.BSC_BDIGG]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.BDIGG,
      network: Network.Ethereum
    }
  },
  [TOKENS.BPANCAKE_BNB_BTCB]: {
    lpToken: true,
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.PANCAKE_BNB_BTCB,
      network: Network.BinanceSmartChain
    }
  },
  [TOKENS.BPANCAKE_BBADGER_BTCB]: {
    lpToken: true,
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.PANCAKE_BBADGER_BTCB,
      network: Network.BinanceSmartChain
    }
  },
  [TOKENS.BPANCAKE_BDIGG_BTCB]: {
    lpToken: true,
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.PANCAKE_BDIGG_BTCB,
      network: Network.BinanceSmartChain
    }
  }
};
