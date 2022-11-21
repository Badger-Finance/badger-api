import { GovernanceProposals } from '../aws/models/governance-proposals.model';
import { Chain } from '../chains/config/chain.config';
import { NodataForAddrError } from '../errors/allocation/nodata.for.addr.error';
import { OutOfRangeError } from '../errors/validation/out.of.range.error';
import { countProposalsByNetwork, getProposalByIdx, getProposalsList } from './governance.utils';
import { GovernanceProposalsList } from './interfaces/governance.proposals.list';

export class GovernanceService {
  async getGovernanceProposal(chain: Chain, id: string): Promise<GovernanceProposals> {
    const proposal = await getProposalByIdx(chain, id);

    if (!proposal) {
      throw new NodataForAddrError(id);
    }

    return proposal;
  }

  async listGovernanceProposals(chain: Chain, page: number, perPage: number): Promise<GovernanceProposalsList> {
    const offset = (page - 1) * perPage;

    const totalItems = await countProposalsByNetwork(chain.network);
    const totalPages = Math.ceil(totalItems / perPage);

    if (page > totalPages) {
      console.error(`Page ${page} is out of range`);
      throw new OutOfRangeError(page);
    }

    return {
      page,
      perPage,
      totalItems,
      totalPages,
      items: await getProposalsList(chain.network, perPage, offset),
    };
  }
}
