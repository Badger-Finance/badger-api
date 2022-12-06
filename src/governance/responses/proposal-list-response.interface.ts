import { GovernanceProposalsList } from '@badger-dao/sdk';
import { GovernanceProposal } from '@badger-dao/sdk/lib/api/interfaces/governance-proposal.interface';
import { Description, Example, Property, Title } from '@tsed/schema';

export class ProposalListResponse implements GovernanceProposalsList {
  @Title('page')
  @Description('current page')
  @Example(1)
  @Property()
  page!: number;

  @Title('perPage')
  @Description('items per page')
  @Example(10)
  @Property()
  perPage!: number;

  @Title('totalItems')
  @Description('total items')
  @Example(50)
  @Property()
  totalItems!: number;

  @Title('totalPages')
  @Description('pages count')
  @Example(5)
  @Property()
  totalPages!: number;

  @Title('items')
  @Description('Proposals items')
  @Property()
  items!: GovernanceProposal[];
}
