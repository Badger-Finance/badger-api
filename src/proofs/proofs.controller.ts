import { Network } from '@badger-dao/sdk';
import { MerkleProof } from '@badger-dao/sdk/lib/api/types/merkle-proof';
import { Controller, Get, Inject, PathParams, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { ProofsService } from './proofs.service';
import { CitadelMerkleClaim } from './interfaces/citadel-merkle-claim.interface';

@Controller('/proofs')
export class ProofsController {
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

  @Get('/citadel/:address')
  @ContentType('json')
  async getCitadelProof(@PathParams('address') address: string): Promise<CitadelMerkleClaim> {
    return this.proofsService.getCitadelClaim(address);
  }
}
