import { GovernanceProposal } from '@badger-dao/sdk/lib/api/interfaces/governance-proposal.interface';
import { GovernanceProposalsList } from '@badger-dao/sdk/lib/api/interfaces/governance-proposals-list.interface';

import { Chain } from '../chains/config/chain.config';
import { NodataForAddrError } from '../errors/allocation/nodata.for.addr.error';
import { OutOfRangeError } from '../errors/validation/out.of.range.error';
import {
  countProposalsByNetwork,
  getProposalByIdx,
  getProposalsList,
  packDdbProposalForResponse,
} from './governance.utils';

export class GovernanceService {
  async getGovernanceProposal(chain: Chain, id: string): Promise<GovernanceProposal> {
    const proposal = await getProposalByIdx(chain, id);

    if (!proposal) {
      throw new NodataForAddrError(id);
    }

    return packDdbProposalForResponse(proposal);
  }

  async listGovernanceProposals(chain: Chain, page: number, perPage: number): Promise<GovernanceProposalsList> {
    const offset = (page - 1) * perPage;

    const totalItems = await countProposalsByNetwork(chain.network);
    const totalPages = Math.ceil(totalItems / perPage);

    if (page > totalPages) {
      console.error(`Page ${page} is out of range`);
      throw new OutOfRangeError(page);
    }

    const proposals = await getProposalsList(chain.network, perPage, offset);

    return {
      page,
      perPage,
      totalItems,
      totalPages,
      items: proposals.map(packDdbProposalForResponse),
    };
  }
}
