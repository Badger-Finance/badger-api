import { MerkleProof, Network } from "@badger-dao/sdk";
import { Controller,Inject } from "@tsed/di";
import { PathParams, QueryParams } from "@tsed/platform-params";
import { ContentType, Deprecated, Get } from "@tsed/schema";

import { Chain } from "../chains/config/chain.config";
import { ProofsService } from "./proofs.service";

@Deprecated()
@Controller("/proofs")
export class ProofsV2Controller {
  @Inject()
  proofsService!: ProofsService;

  @Get("/:address")
  @ContentType("json")
  async getBouncerProof(
    @PathParams("address") address: string,
    @QueryParams("chain") chain?: Network
  ): Promise<MerkleProof> {
    return this.proofsService.getBouncerProof(Chain.getChain(chain), address);
  }
}
