import { MerkleProof, Network } from '@badger-dao/sdk';
import { Controller } from '@tsed/di';
import { QueryParams } from '@tsed/platform-params';
import { ContentType, Get } from '@tsed/schema';

import { getBouncerProof } from '../aws/s3.utils';
import { getOrCreateChain } from '../chains/chains.utils';
import { QueryParamError } from '../errors/validation/query.param.error';

@Controller('/proofs')
export class ProofsV3Controller {
  @Get()
  @ContentType('json')
  async getBouncerProof(
    @QueryParams('address') address: string,
    @QueryParams('chain') chain?: Network,
  ): Promise<MerkleProof> {
    if (!address) {
      throw new QueryParamError('address');
    }
    return getBouncerProof(getOrCreateChain(chain), address);
  }
}
