import { DataMapper } from '@aws/dynamodb-data-mapper';
import {
  CallDisputedEvent,
  CallExecutedEvent,
  CallScheduledEvent,
  CancelledEvent,
  RejectedEvent,
} from '@badger-dao/sdk/lib/contracts/TimelockController';

import { getDataMapper } from '../aws/dynamodb.utils';
import { GovernanceProposals } from '../aws/models/governance-proposals.model';
import { GovernanceProposalsAction } from '../aws/models/governance-proposals-action.interface';
import { GovernanceProposalsDisputes } from '../aws/models/governance-proposals-disputes.interface';
import { GovernanceProposalsStatuses } from '../aws/models/governance-proposals-statuses.interface';
import { getSupportedChains } from '../chains/chains.utils';
import { Chain } from '../chains/config/chain.config';
import { PRODUCTION } from '../config/constants';
import { EMPTY_DECODED_CALLDATA_INDEXED } from '../governance/governance.constants';
import {
  getLastScannedBlockDefault,
  getOrCreateMetadata,
  getScanRangeOpts,
  saveIndexingMetadata,
} from './utils/scan.utils';

const TASK_NAME = 'govenance-proposals-indexer';

export async function updateGovernanceProposals() {
  if (PRODUCTION) {
    console.info('Governance proposals not rdy for production, skipping');
    return 'done';
  }

  console.info('Updating governance proposals started');

  const mapper = getDataMapper();

  const indexingMeta = await getOrCreateMetadata(TASK_NAME, getLastScannedBlockDefault());

  for (const chain of getSupportedChains()) {
    const timelockAddress = chain.sdk.governance.timelockAddress;

    await chain.sdk.ready();

    if (!timelockAddress) {
      console.info(`No timelock address for ${chain.network}, skipping`);
      continue;
    }

    const lastScannedBlock = indexingMeta.data[`${chain.network}`].lastScannedBlock;

    const chainScanRange = {
      startBlock: 0,
      endBlock: 0,
    };

    await chain.sdk.governance.processEventsScanRange(timelockAddress, chainScanRange);

    const scanRangeOpts = getScanRangeOpts(chainScanRange, lastScannedBlock);

    indexingMeta.data[chain.network].lastScannedBlock = scanRangeOpts.endBlock;

    const proposalsCreated = await chain.sdk.governance.loadScheduledProposals(scanRangeOpts);
    const proposalsStatusesChanged = await chain.sdk.governance.loadProposalsStatusChange(scanRangeOpts);
    const proposalsDisputed = await chain.sdk.governance.loadProposalsDisputes(scanRangeOpts);

    if (proposalsCreated.length === 0 && proposalsStatusesChanged.length === 0 && proposalsDisputed.length === 0) {
      console.info(`No new proposals for ${chain.network}`);
      continue;
    }

    const updatedProposalsStatuses: (CallExecutedEvent | CancelledEvent | RejectedEvent)[] = [];
    const updatedProposalsDisputes: CallDisputedEvent[] = [];

    // save new created proposals
    const updatedProposals: GovernanceProposals[] = [];

    for (const proposal of proposalsCreated) {
      const isRootProposal = proposal.args.index.toNumber() === 0;

      if (isRootProposal) {
        await saveRootProposal(
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
        await saveProposalsAction(
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
        reasoning: _isControllEvent(status.event) ? (<ControllEvents>status).args.reasoning : '',
        transactionHash: status.transactionHash,
        blockNumber: block.number,
        updatedAt: block.timestamp,
      });

      if (status.event === 'CallExecuted') {
        proposalStatus.value = (<CallExecutedEvent>status).args.value.toNumber();

        const action = proposal.actions.find((c) => c.index === (<CallExecutedEvent>status).args.index.toNumber());

        if (!action) {
          console.error({
            message: `Unable to find child ${(<CallExecutedEvent>(
              status
            )).args.index.toNumber()} proposal ${proposalDdbIdx} to update`,
          });
          continue;
        }
        action.executed = proposalStatus.status;
      }

      proposal.statuses.push(proposalStatus);

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

  await saveIndexingMetadata(indexingMeta);

  console.info('Updating governance proposals ended');

  return 'done';
}

async function saveRootProposal(
  chain: Chain,
  timelockAddress: string,
  proposal: CallScheduledEvent,
  proposalsStatusesChanged: (CallExecutedEvent | CancelledEvent | RejectedEvent)[],
  proposalsDisputed: CallDisputedEvent[],
  updatedProposals: GovernanceProposals[],
  updatedProposalsStatuses: (CallExecutedEvent | CancelledEvent | RejectedEvent)[],
  updatedProposalsDisputes: CallDisputedEvent[],
) {
  let latestEvent!: GovernanceProposalsStatuses | GovernanceProposalsDisputes;

  const block = await proposal.getBlock();

  const proposalsStatuses = await Promise.all(
    proposalsStatusesChanged
      .filter((e) => e.args.id === proposal.args.id)
      .map(async (e) => {
        const block = await e.getBlock();

        updatedProposalsStatuses.push(e);

        const proposalStatus = Object.assign(new GovernanceProposalsStatuses(), {
          name: e.event,
          sender: e.args.sender,
          status: e.args.status,
          reasoning: _isControllEvent(e.event) ? (<ControllEvents>e).args.reasoning : '',
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

  const actionExecuted = proposalsStatusesChanged.find((e) => {
    return (
      e.args.id === proposal.args.id && e.event === 'CallExecuted' && (<CallExecutedEvent>e).args.index.toNumber() === 0
    );
  });

  const proposalDdbIdx = GovernanceProposals.genIdx(chain.network, timelockAddress, proposal.args.id);

  updatedProposals.push(
    Object.assign(new GovernanceProposals(), {
      idx: proposalDdbIdx,
      proposalId: proposal.args.id,
      network: chain.network,
      createdAt: Date.now() / 1000,
      contractAddr: timelockAddress,
      decodedCallData: EMPTY_DECODED_CALLDATA_INDEXED,
      readyTime: proposal.args.readyTime.toNumber(),
      currentStatus: !latestEvent ? proposal.args.status : latestEvent.status,
      creationBlock: block.number,
      description: proposal.args.description,
      updateBlock: !latestEvent ? block.number : latestEvent.blockNumber,
      statuses: proposalsStatuses,
      disputes: proposalsDisputes,
      actions: [
        Object.assign(new GovernanceProposalsAction(), {
          index: proposal.args.index.toNumber(),
          value: proposal.args.value.toNumber(),
          callData: proposal.args.data,
          decodedCallData: EMPTY_DECODED_CALLDATA_INDEXED,
          transactionHash: proposal.transactionHash,
          sender: proposal.args.sender,
          executed: !actionExecuted ? proposal.args.status : latestEvent.status,
          targetAddr: proposal.args.target,
          predecessor: proposal.args.predecessor,
        }),
      ],
    }),
  );

  console.info(
    `New proposal ${proposalDdbIdx} with ${proposalsStatuses.length} 
        statuses and ${proposalsDisputes.length} disputes added`,
  );
}

async function saveProposalsAction(
  chain: Chain,
  mapper: DataMapper,
  timelockAddress: string,
  proposal: CallScheduledEvent,
  proposalsStatusesChanged: (CallExecutedEvent | CancelledEvent | RejectedEvent)[],
  updatedProposals: GovernanceProposals[],
  updatedProposalsStatuses: (CallExecutedEvent | CancelledEvent | RejectedEvent)[],
) {
  let rootFromDdb = false;
  let rootProposal: GovernanceProposals | undefined;

  if (updatedProposals.length > 0) {
    rootProposal = updatedProposals.find((p) => p.proposalId === proposal.args.id);
  }

  if (!rootProposal) {
    try {
      const proposalDdbIdx = GovernanceProposals.genIdx(chain.network, timelockAddress, proposal.args.id);
      rootProposal = await mapper.get(Object.assign(new GovernanceProposals(), { idx: proposalDdbIdx }));
      rootFromDdb = true;
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

  const proposalsAction = Object.assign(new GovernanceProposalsAction(), {
    index: proposal.args.index.toNumber(),
    value: proposal.args.value.toNumber(),
    callData: proposal.args.data,
    decodedCallData: EMPTY_DECODED_CALLDATA_INDEXED,
    transactionHash: proposal.transactionHash,
    sender: proposal.args.sender,
    executed: proposal.args.status,
    targetAddr: proposal.args.target,
    predecessor: proposal.args.predecessor,
  });

  if (executedStatusEvent) {
    updatedProposalsStatuses.push(executedStatusEvent);

    proposalsAction.executed = executedStatusEvent.args.status;
  }

  rootProposal.actions.push(proposalsAction);

  if (rootFromDdb) {
    // index works only on root etries fields
    rootProposal.decodedCallData = EMPTY_DECODED_CALLDATA_INDEXED;

    updatedProposals.push(rootProposal);
  }

  console.info(`New action ${proposal.args.index} for ${rootProposal.idx} added`);
}

type ControllEvents = CancelledEvent | RejectedEvent;

function _isControllEvent(eventName: string | undefined) {
  return ['Cancelled', 'Rejected'].includes(eventName || '');
}
