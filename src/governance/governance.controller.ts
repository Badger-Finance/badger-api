import { Network } from '@badger-dao/sdk';
import { Controller, Inject } from '@tsed/di';
import { QueryParams } from '@tsed/platform-params';
import { ContentType, Description, Get, Returns, Summary } from '@tsed/schema';

import { getOrCreateChain } from '../chains/chains.utils';
import { PRODUCTION } from '../config/constants';
import { NotFoundError } from '../errors/allocation/not.found.error';
import { QueryParamError } from '../errors/validation/query.param.error';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from './governance.constants';
import { GovernanceService } from './governance.service';
import { ProposalListResponse } from './responses/proposal-list-response.interface';
import { ProposalResponse } from './responses/proposal-response.interface';

@Controller('/governance')
export class GovernanceController {
  @Inject()
  governanceService!: GovernanceService;

  @Get('/proposal')
  @ContentType('json')
  @Summary('Get a specific proposal')
  @Description('Return a specific proposal for the requested chain')
  @Returns(200, ProposalResponse)
  @Returns(400).Description('Not a valid chain')
  @Returns(404).Description('No data for id proposal')
  @Returns(404).Description('Chain does not have requested data')
  async getProposal(@QueryParams('id') id: string, @QueryParams('chain') chain?: Network): Promise<ProposalResponse> {
    if (PRODUCTION) throw new NotFoundError();

    if (!id) {
      throw new QueryParamError('id');
    }

    return this.governanceService.getGovernanceProposal(getOrCreateChain(chain), id);
  }

  @Get('/proposals/list')
  @ContentType('json')
  @Summary('Get a list of proposals')
  @Description('Return a list of proposals for the requested chain')
  @Returns(200, ProposalListResponse)
  @Returns(400).Description('Not a valid chain')
  async listProposals(
    @QueryParams('chain') chain?: Network,
    @QueryParams('page') page?: number,
    @QueryParams('perPage') perPage?: number,
  ): Promise<ProposalListResponse> {
    if (PRODUCTION) throw new NotFoundError();

    const pageInt = page ? Number(page) : DEFAULT_PAGE;
    let perPageInt = perPage ? Number(perPage) : DEFAULT_PAGE_SIZE;

    if (perPageInt > MAX_PAGE_SIZE) perPageInt = MAX_PAGE_SIZE;

    return this.governanceService.listGovernanceProposals(getOrCreateChain(chain), pageInt, perPageInt);
  }
}
