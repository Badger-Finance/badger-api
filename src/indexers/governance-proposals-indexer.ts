import { DataMapper } from '@aws/dynamodb-data-mapper';
import {
  CallDisputedEvent,
  CallDisputedResolvedEvent,
  CallExecutedEvent,
  CallScheduledEvent,
  CancelledEvent,
} from '@badger-dao/sdk/lib/contracts/TimelockController';
import { GovernanceProxyMock } from '@badger-dao/sdk/lib/governance/mocks/governance.proxy.mock';

import { getDataMapper } from '../aws/dynamodb.utils';
import { GovernanceProposals } from '../aws/models/governance-proposals.model';
import { GovernanceProposalsChild } from '../aws/models/governance-proposals-child.interface';
import { GovernanceProposalsDisputes } from '../aws/models/governance-proposals-disputes.interface';
import { GovernanceProposalsStatuses } from '../aws/models/governance-proposals-statuses.interface';
import { getSupportedChains } from '../chains/chains.utils';
import { Chain } from '../chains/config/chain.config';
import { PRODUCTION } from '../config/constants';
import { getLastProposalUpdateBlock } from '../governance/governance.utils';

export async function updateGovernanceProposals() {
  if (PRODUCTION) {
    console.info('Governance proposals not rdy for production, skipping');
    return;
  }

  console.info('Updating governance proposals started');

  const mapper = getDataMapper();

  for (const chain of getSupportedChains()) {
    const timelockAddress = chain.sdk.governance.timelockAddress;

    await chain.sdk.ready();

    if (!timelockAddress) {
      console.info(`No timelock address for ${chain.network}, skipping`);
      continue;
    }

    const lastScannedBlock = await getLastProposalUpdateBlock(chain.network);

    // nit: there is sense to expose this as a method in sdk, wo any proxies
    const governanceProxy = new GovernanceProxyMock(chain.sdk);

    const scanRangeOpts = {
      startBlock: 0,
      endBlock: 0,
    };

    await governanceProxy.processEventsScanRangePr(timelockAddress, scanRangeOpts);

    if (lastScannedBlock) {
      scanRangeOpts.startBlock = lastScannedBlock + 1;
    }

    const proposalsCreated = await chain.sdk.governance.loadScheduledProposals(scanRangeOpts);
    const proposalsStatusesChanged = await chain.sdk.governance.loadProposalsStatusChange(scanRangeOpts);
    const proposalsDisputed = await chain.sdk.governance.loadProposalsDisputes(scanRangeOpts);

    if (proposalsCreated.length === 0 && proposalsStatusesChanged.length === 0 && proposalsDisputed.length === 0) {
      console.info(`No new proposals for ${chain.network}`);
      continue;
    }

    const updatedProposalsStatuses: (CallExecutedEvent | CancelledEvent)[] = [];
    const updatedProposalsDisputes: (CallDisputedEvent | CallDisputedResolvedEvent)[] = [];

    // save new created proposals
    const updatedProposals: GovernanceProposals[] = [];

    for (const proposal of proposalsCreated) {
      const isBatchChild = proposal.args.index.toNumber() > 0;

      // We have 2 types of proposals: Single and Batch
      // Single(Relative) proposal is a proposal that has only one transaction (target, callData, value)
      // Batch(Relative+Children) proposal is a proposal that has more than one transaction(action), still they share same id,
      // but they have different index and different target, callData, value
      // For sake of simplicity we save batch proposals as children of the main proposal with index 0
      if (!isBatchChild) {
        await saveRelativeProposal(
          chain,
          timelockAddress,
          proposal,
          proposalsStatusesChanged,
          proposalsDisputed,
          updatedProposals,
          updatedProposalsStatuses,
          updatedProposalsDisputes,
        );
      } else {
        await saveChildProposal(
          chain,
          mapper,
          timelockAddress,
          proposal,
          proposalsStatusesChanged,
          updatedProposals,
          updatedProposalsStatuses,
        );
      }
    }

    try {
      if (updatedProposals.length > 0) {
        for await (const _ of mapper.batchPut(updatedProposals)) {
        }
      }
    } catch (err) {
      console.error({ message: 'Unable to save governance proposals', err });
    }

    // update proposals statuses and disputes
    const statusesToUpdate = proposalsStatusesChanged.filter((e) => !updatedProposalsStatuses.includes(e));
    const disputesToUpdate = proposalsDisputed.filter((e) => !updatedProposalsDisputes.includes(e));

    if (statusesToUpdate.length === 0 && disputesToUpdate.length === 0) {
      console.info(`No new statuses or disputes for ${chain.network}`);
      continue;
    }

    for (const status of statusesToUpdate) {
      let proposal!: GovernanceProposals;
      const proposalDdbIdx = GovernanceProposals.genIdx(chain.network, timelockAddress, status.args.id);

      try {
        proposal = await mapper.get(
          Object.assign(new GovernanceProposals(), {
            idx: proposalDdbIdx,
          }),
        );
      } catch (err) {
        console.error({ message: `Unable to find proposal ${proposalDdbIdx} to update`, err });
        continue;
      }

      if (proposal.statuses.find((s) => s.transactionHash === status.transactionHash)) {
        continue;
      }

      const block = await status.getBlock();

      const proposalStatus = Object.assign(new GovernanceProposalsStatuses(), {
        name: status.event,
        sender: status.args.sender,
        status: status.args.status,
        transactionHash: status.transactionHash,
        blockNumber: block.number,
        updatedAt: block.timestamp,
      });

      if (status.event === 'CallExecuted') {
        proposalStatus.value = (<CallExecutedEvent>status).args.value.toNumber();

        if ((<CallExecutedEvent>status).args.index.toNumber() === 0) {
          proposal.statuses.push(proposalStatus);
        } else {
          const child = proposal.children.find((c) => c.index === (<CallExecutedEvent>status).args.index.toNumber());
          if (!child) {
            console.error({
              message: `Unable to find child ${(<CallExecutedEvent>(
                status
              )).args.index.toNumber()} proposal ${proposalDdbIdx} to update`,
            });
            continue;
          }
          child.executed = proposalStatus;
        }
      } else {
        proposal.statuses.push(proposalStatus);
      }

      proposal.currentStatus = status.args.status;
      proposal.updateBlock = block.number;

      try {
        await mapper.put(proposal);
      } catch (err) {
        console.error({ message: `Unable to save governance proposal ${proposalDdbIdx}`, err });
      }

      console.info(`New status ${status.transactionHash} for proposal ${proposalDdbIdx} added`);
    }

    for (const dispute of disputesToUpdate) {
      let proposal!: GovernanceProposals;
      const proposalDdbIdx = GovernanceProposals.genIdx(chain.network, timelockAddress, dispute.args.id);

      try {
        proposal = await mapper.get(
          Object.assign(new GovernanceProposals(), {
            idx: proposalDdbIdx,
          }),
        );
      } catch (err) {
        console.error({ message: `Unable to find proposal ${proposalDdbIdx} to update`, err });
        continue;
      }

      if (proposal.disputes.find((d) => d.transactionHash === dispute.transactionHash)) {
        continue;
      }

      const block = await dispute.getBlock();

      const proposalDispute = Object.assign(new GovernanceProposalsDisputes(), {
        name: dispute.event,
        ruling: dispute.event === 'CallDisputedResolved' ? (<CallDisputedResolvedEvent>dispute).args.ruling : null,
        sender: dispute.args.sender,
        status: dispute.args.status,
        transactionHash: dispute.transactionHash,
        blockNumber: block.number,
        updatedAt: block.timestamp,
      });

      proposal.disputes.push(proposalDispute);

      proposal.currentStatus = dispute.args.status;
      proposal.updateBlock = block.number;

      try {
        await mapper.put(proposal);
      } catch (err) {
        console.error({ message: `Unable to save governance proposal ${proposalDdbIdx}`, err });
      }

      console.info(`New dispute ${dispute.transactionHash} for proposal ${proposalDdbIdx} added`);
    }
  }

  console.info('Updating governance proposals ended');
}

async function saveRelativeProposal(
  chain: Chain,
  timelockAddress: string,
  proposal: CallScheduledEvent,
  proposalsStatusesChanged: (CallExecutedEvent | CancelledEvent)[],
  proposalsDisputed: (CallDisputedEvent | CallDisputedResolvedEvent)[],
  updatedProposals: GovernanceProposals[],
  updatedProposalsStatuses: (CallExecutedEvent | CancelledEvent)[],
  updatedProposalsDisputes: (CallDisputedEvent | CallDisputedResolvedEvent)[],
) {
  let latestEvent!: GovernanceProposalsStatuses | GovernanceProposalsDisputes;

  const block = await proposal.getBlock();

  const proposalsStatuses = await Promise.all(
    proposalsStatusesChanged
      .filter((e) => {
        return (
          e.args.id === proposal.args.id ||
          (e.args.id === proposal.args.id &&
            e.event === 'CallExecuted' &&
            (<CallExecutedEvent>e).args.index.toNumber() === 0)
        );
      })
      .map(async (e) => {
        const block = await e.getBlock();

        updatedProposalsStatuses.push(e);

        const proposalStatus = Object.assign(new GovernanceProposalsStatuses(), {
          name: e.event,
          sender: e.args.sender,
          status: e.args.status,
          transactionHash: e.transactionHash,
          blockNumber: block.number,
          updatedAt: block.timestamp,
        });

        if (e.event === 'CallExecuted') {
          proposalStatus.value = (<CallExecutedEvent>e).args.value.toNumber();
        }

        if (!latestEvent || block.number > (latestEvent && latestEvent?.blockNumber)) {
          latestEvent = proposalStatus;
        }

        return proposalStatus;
      }),
  );

  const proposalsDisputes = await Promise.all(
    proposalsDisputed
      .filter((e) => e.args.id === proposal.args.id)
      .map(async (e) => {
        const block = await e.getBlock();

        updatedProposalsDisputes.push(e);

        const proposalDispute = Object.assign(new GovernanceProposalsDisputes(), {
          name: e.event,
          ruling: e.event === 'CallDisputedResolved' ? (<CallDisputedResolvedEvent>e).args.ruling : null,
          sender: e.args.sender,
          status: e.args.status,
          transactionHash: e.transactionHash,
          blockNumber: block.number,
          updatedAt: block.timestamp,
        });

        if (!latestEvent || block.number > (latestEvent && latestEvent?.blockNumber)) {
          latestEvent = proposalDispute;
        }

        return proposalDispute;
      }),
  );

  const proposalDdbIdx = GovernanceProposals.genIdx(chain.network, timelockAddress, proposal.args.id);

  updatedProposals.push(
    Object.assign(new GovernanceProposals(), {
      idx: proposalDdbIdx,
      proposalId: proposal.args.id,
      network: chain.network,
      createdAt: Date.now() / 1000,
      contractAddr: timelockAddress,
      targetAddr: proposal.args.target,
      value: proposal.args.value.toNumber(),
      callData: proposal.args.data,
      readyTime: proposal.args.readyTime.toNumber(),
      sender: proposal.args.sender,
      currentStatus: !latestEvent ? proposal.args.status : latestEvent.status,
      creationBlock: block.number,
      updateBlock: !latestEvent ? block.number : latestEvent.blockNumber,
      statuses: proposalsStatuses,
      disputes: proposalsDisputes,
      children: [],
    }),
  );

  console.info(
    `New proposal ${proposalDdbIdx} with ${proposalsStatuses.length} 
        statuses and ${proposalsDisputes.length} disputes added`,
  );
}

async function saveChildProposal(
  chain: Chain,
  mapper: DataMapper,
  timelockAddress: string,
  proposal: CallScheduledEvent,
  proposalsStatusesChanged: (CallExecutedEvent | CancelledEvent)[],
  updatedProposals: GovernanceProposals[],
  updatedProposalsStatuses: (CallExecutedEvent | CancelledEvent)[],
) {
  let relativeFromDdb = false;
  let relativeProposal: GovernanceProposals | undefined;

  if (updatedProposals.length > 0) {
    relativeProposal = updatedProposals.find((p) => p.proposalId === proposal.args.id);
  }

  if (!relativeProposal) {
    try {
      const proposalDdbIdx = GovernanceProposals.genIdx(chain.network, timelockAddress, proposal.args.id);
      relativeProposal = await mapper.get(Object.assign(new GovernanceProposals(), { idx: proposalDdbIdx }));
      relativeFromDdb = true;
    } catch (err) {
      console.error({ message: `Unable to find proposal ${proposal.args.id} to update`, err });
      return;
    }
  }

  const executedStatusEvent = proposalsStatusesChanged.find((e) => {
    return (
      e.args.id === proposal.args.id &&
      e.event === 'CallExecuted' &&
      (<CallExecutedEvent>e).args.index.toNumber() === proposal.args.index.toNumber()
    );
  });

  const childProposal = Object.assign(new GovernanceProposalsChild(), {
    index: proposal.args.index.toNumber(),
    value: proposal.args.value.toNumber(),
    callData: proposal.args.data,
    sender: proposal.args.sender,
    targetAddr: proposal.args.target,
    predecessor: proposal.args.predecessor,
  });

  if (executedStatusEvent) {
    const block = await executedStatusEvent.getBlock();

    updatedProposalsStatuses.push(executedStatusEvent);

    childProposal.executed = Object.assign(new GovernanceProposalsStatuses(), {
      name: executedStatusEvent.event,
      sender: executedStatusEvent.args.sender,
      status: executedStatusEvent.args.status,
      transactionHash: executedStatusEvent.transactionHash,
      blockNumber: block.number,
      updatedAt: block.timestamp,
    });

    if (executedStatusEvent.event === 'CallExecuted') {
      childProposal.executed.value = (<CallExecutedEvent>executedStatusEvent).args.index.toNumber();
    }
  }

  if (relativeProposal.children) {
    relativeProposal.children.push(childProposal);
  } else {
    relativeProposal.children = [childProposal];
  }

  if (relativeFromDdb) updatedProposals.push(relativeProposal);

  console.info(`New child proposal ${proposal.args.index} for ${relativeProposal.idx} added`);
}
