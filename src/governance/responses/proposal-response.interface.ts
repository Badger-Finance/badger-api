import { GovernanceProposal } from '@badger-dao/sdk/lib/api/interfaces/governance-proposal.interface';
import { Description, Example, Property, Title } from '@tsed/schema';

import { GovernanceProposalsChild } from '../../aws/models/governance-proposals-child.interface';
import { GovernanceProposalsDisputes } from '../../aws/models/governance-proposals-disputes.interface';
import { GovernanceProposalsStatuses } from '../../aws/models/governance-proposals-statuses.interface';

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

  @Title('target')
  @Description('target address of the proposal')
  @Example('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599')
  @Property()
  public targetAddr!: string;

  @Title('value')
  @Description('value of the proposal')
  @Example(0)
  @Property()
  public value!: number;

  @Title('callData')
  @Description('call data of the proposal to be execute')
  @Example('0xc7b9d530000000000000000000000000e8ea1d8b3a5a4cec7e94ae330ff18e82b5d22fa6')
  @Property()
  public callData!: string;

  @Title('decodedCallData')
  @Description('decoded call data of the proposal to be execute')
  @Example('0xc7b9d530000000000000000000000000e8ea1d8b3a5a4cec7e94ae330ff18e82b5d22fa6')
  @Property()
  public decodedCallData!: string | null;

  @Title('readyTime')
  @Description('time when proposal is ready to be executed')
  @Example(new Date().getTime() / 1000)
  @Property()
  public readyTime!: number;

  @Title('sender')
  @Description('address of the sender')
  @Example('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599')
  @Property()
  public sender!: string;

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

  @Title('transactionHash')
  @Description('hash of the transaction')
  @Example('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599')
  @Property()
  public transactionHash!: string;

  @Title('updateBlock')
  @Description('update block of the proposal')
  @Example(245888713)
  @Property()
  public updateBlock!: number;

  @Title('statuses')
  @Description('status history of the proposal')
  @Example([
    Object.assign(new GovernanceProposalsStatuses(), {
      name: 'CallExecuted',
      sender: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      status: 'Executed',
      value: 0,
      updatedAt: new Date().getTime() / 1000,
    }),
  ])
  @Property()
  public statuses!: Array<GovernanceProposalsStatuses>;

  @Title('disputes')
  @Description('disputes history of the proposal')
  @Example([
    Object.assign(new GovernanceProposalsDisputes(), {
      name: 'CallDisputed',
      ruling: true,
      sender: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      status: 'Disputed',
    }),
  ])
  @Property()
  public disputes!: Array<GovernanceProposalsDisputes>;

  @Title('children')
  @Description('batched actions or the root proposal')
  @Example([
    Object.assign(new GovernanceProposalsChild(), {
      index: 4,
      value: 0,
      callData: '0xc7b9d530000000000000000000000000e8ea1d8b3a5a4cec7e94ae330ff18e82b5d22fa6',
      target: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      predecessor: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      sender: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      executed: Object.assign(new GovernanceProposalsStatuses(), {
        name: 'CallExecuted',
        sender: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        status: 'Executed',
        value: 0,
        updatedAt: new Date().getTime() / 1000,
      }),
    }),
  ])
  @Property()
  public children!: Array<GovernanceProposalsChild>;
}
