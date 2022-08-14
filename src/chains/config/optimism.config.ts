import { Network } from "@badger-dao/sdk";

import rpc from "../../config/rpc.config";
import { BaseStrategy } from "../strategies/base.strategy";
import { Chain } from "./chain.config";

export class Optimism extends Chain {
  constructor() {
    super(Network.Optimism, {}, rpc[Network.Optimism], new BaseStrategy(Network.Optimism));
    Chain.register(this.network, this);
  }
}
