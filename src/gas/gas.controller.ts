import { GasPrices, Network } from "@badger-dao/sdk";
import { Controller } from "@tsed/di";
import { UseCache } from "@tsed/platform-cache";
import { QueryParams } from "@tsed/platform-params";
import { ContentType, Description, Get, Returns, Summary } from "@tsed/schema";

import { Chain } from "../chains/config/chain.config";

@Controller("/gas")
export class GasController {
  @Get("")
  @UseCache()
  @ContentType("json")
  @Summary("Get the current gas price")
  @Description("Returns the current gas price on the requested chain")
  @Returns(200)
  @Returns(404).Description("Chain gas prices not available")
  async getGasPrices(@QueryParams("chain") chain?: Network): Promise<GasPrices> {
    const targetChain = Chain.getChain(chain);
    return targetChain.getGasPrices();
  }
}
