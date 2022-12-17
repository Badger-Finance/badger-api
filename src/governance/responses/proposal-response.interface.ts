import { GovernanceProposalAction } from '@badger-dao/sdk';
import { GovernanceProposal } from '@badger-dao/sdk/lib/api/interfaces/governance-proposal.interface';
import { GovernanceProposalsDispute } from '@badger-dao/sdk/lib/api/interfaces/governance-proposals-dispute.interface';
import { GovernanceProposalsStatus } from '@badger-dao/sdk/lib/api/interfaces/governance-proposals-status.interface';
import { Description, Example, Property, Title } from '@tsed/schema';

export class ProposalResponse implements Omit<GovernanceProposal, 'contractAddr'> {
  @Title('proposalId')
  @Description('id of the proposal sequence')
  @Example('0xe9bfab585a583ae5cc2395f40bfb61b5c93dee4356079f1c642d7157be8300c8')
  @Property()
  public proposalId!: string;

  @Title('createdAt')
  @Description('time when proposal was indexed')
  @Example(new Date().getTime() / 1000)
  @Property()
  public createdAt!: number;

  @Title('readyTime')
  @Description('time when proposal is ready to be executed')
  @Example(new Date().getTime() / 1000)
  @Property()
  public readyTime!: number;

  @Title('currentStatus')
  @Description('current status of the proposal')
  @Example('queued')
  @Property()
  public currentStatus!: string;

  @Title('creationBlock')
  @Description('creation block of the proposal')
  @Example(234234)
  @Property()
  public creationBlock!: number;

  @Title('updateBlock')
  @Description('update block of the proposal')
  @Example(245888713)
  @Property()
  public updateBlock!: number;

  @Title('statuses')
  @Description('status history of the proposal')
  @Example([
    {
      name: 'CallExecuted',
      sender: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      status: 'Executed',
      transactionHash: '0x2260fac5e523423tgfdgdfgcfedf7c193bc2c599',
      value: 0,
      updatedAt: new Date().getTime() / 1000,
    },
  ])
  @Property()
  public statuses!: Array<GovernanceProposalsStatus>;

  @Title('disputes')
  @Description('disputes history of the proposal')
  @Example([
    {
      name: 'CallDisputed',
      ruling: true,
      sender: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      transactionHash: '0x2260fac5e523423tgfdgdfgcfedf7c193bc2c599',
      status: 'Disputed',
    },
  ])
  @Property()
  public disputes!: Array<GovernanceProposalsDispute>;

  @Title('actions')
  @Description('actions for target addresses')
  @Example([
    {
      index: 4,
      value: 0,
      callData: '0xc7b9d530000000000000000000000000e8ea1d8b3a5a4cec7e94ae330ff18e82b5d22fa6',
      decodedCallData: {
        name: 'deposit',
        signatureHash: '0xb6b55f256c3eb337f96418d59e773db6e805074f5e574a2bebb7d71394043619',
        inputTypes: [
          {
            internalType: 'uint256',
            name: '_amount',
            type: 'uint256',
          },
        ],
        decodedParams: [
          {
            type: 'BigNumber',
            hex: '0x4563918244f40000',
          },
        ],
      },
      target: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      predecessor: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      sender: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      executed: 'executed',
    },
  ])
  @Property()
  public actions!: Array<GovernanceProposalAction>;
}
