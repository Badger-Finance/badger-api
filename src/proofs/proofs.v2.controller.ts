import { Network } from '@badger-dao/sdk';
import { MerkleProof } from '@badger-dao/sdk/lib/api/types/merkle-proof';
import { Controller, Get, Inject, PathParams, QueryParams } from '@tsed/common';
import { ContentType, Deprecated } from '@tsed/schema';

import { Chain } from '../chains/config/chain.config';
import { ProofsService } from './proofs.service';

@Deprecated()
@Controller('/proofs')
export class ProofsV2Controller {
  @Inject()
  proofsService!: ProofsService;

  @Get('/:address')
  @ContentType('json')
  async getBouncerProof(
    @PathParams('address') address: string,
    @QueryParams('chain') chain?: Network,
  ): Promise<MerkleProof> {
    return this.proofsService.getBouncerProof(Chain.getChain(chain), address);
  }
}
