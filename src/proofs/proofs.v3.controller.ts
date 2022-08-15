import { MerkleProof, Network } from '@badger-dao/sdk';
import { Controller, Inject } from '@tsed/di';
import { QueryParams } from '@tsed/platform-params';
import { ContentType, Get } from '@tsed/schema';

import { Chain } from '../chains/config/chain.config';
import { QueryParamError } from '../errors/validation/query.param.error';
import { ProofsService } from './proofs.service';

@Controller('/proofs')
export class ProofsV3Controller {
  @Inject()
  proofsService!: ProofsService;

  @Get()
  @ContentType('json')
  async getBouncerProof(
    @QueryParams('address') address: string,
    @QueryParams('chain') chain?: Network
  ): Promise<MerkleProof> {
    if (!address) {
      throw new QueryParamError('address');
    }
    return this.proofsService.getBouncerProof(Chain.getChain(chain), address);
  }
}
