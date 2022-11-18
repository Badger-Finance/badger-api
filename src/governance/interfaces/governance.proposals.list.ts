import { GovernanceProposals } from '../../aws/models/governance-proposals.model';

export interface GovernanceProposalsList {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: GovernanceProposals[];
}
