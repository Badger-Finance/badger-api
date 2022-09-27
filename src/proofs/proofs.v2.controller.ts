import { MerkleProof, Network } from '@badger-dao/sdk';
import { Controller } from '@tsed/di';
import { PathParams, QueryParams } from '@tsed/platform-params';
import { ContentType, Deprecated, Get } from '@tsed/schema';

import { getBouncerProof } from '../aws/s3.utils';
import { getOrCreateChain } from '../chains/chains.utils';

@Deprecated()
@Controller('/proofs')
export class ProofsV2Controller {
  @Get('/:address')
  @ContentType('json')
  async getBouncerProof(
    @PathParams('address') address: string,
    @QueryParams('chain') chain?: Network,
  ): Promise<MerkleProof> {
    return getBouncerProof(getOrCreateChain(chain), address);
  }
}
