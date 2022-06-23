import { Network } from '@badger-dao/sdk';
import { MerkleProof } from '@badger-dao/sdk/lib/api/types/merkle-proof';
import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';

import { Chain } from '../chains/config/chain.config';
import { QueryParamError } from '../errors/validation/query.param.error';
import { CitadelMerkleClaim } from './interfaces/citadel-merkle-claim.interface';
import { ProofsService } from './proofs.service';

@Controller('/proof')
export class ProofsV3Controller {
  @Inject()
  proofsService!: ProofsService;

  @Get()
  @ContentType('json')
  async getBouncerProof(
    @QueryParams('address') address: string,
    @QueryParams('chain') chain?: Network,
  ): Promise<MerkleProof> {
    if (!address) throw new QueryParamError('address');

    return this.proofsService.getBouncerProof(Chain.getChain(chain), address);
  }

  @Get('/citadel')
  @ContentType('json')
  async getCitadelProof(@QueryParams('address') address: string): Promise<CitadelMerkleClaim> {
    if (!address) throw new QueryParamError('address');

    return this.proofsService.getCitadelClaim(address);
  }
}
