import {
  CallDisputedEvent,
  CallDisputedResolvedEvent,
  CallExecutedEvent,
  CancelledEvent,
} from '@badger-dao/sdk/lib/contracts/TimelockController';
import { GovernanceProxyMock } from '@badger-dao/sdk/lib/governance/mocks/governance.proxy.mock';

import { getDataMapper } from '../aws/dynamodb.utils';
import { GovernanceProposals } from '../aws/models/governance-proposals.model';
import { GovernanceProposalsDisputes } from '../aws/models/governance-proposals-disputes.interface';
import { GovernanceProposalsStatuses } from '../aws/models/governance-proposals-statuses.interface';
import { getSupportedChains } from '../chains/chains.utils';
import { getLastProposalUpdateBlock } from '../governance/governance.utils';

export async function updateGovernanceProposals() {
  console.info('Updating governance proposals started');

  const mapper = getDataMapper();

  for (const chain of getSupportedChains()) {
    const timelockAddress = chain.sdk.governance.timelockAddress;

    if (!timelockAddress) {
      console.info(`No timelock address for ${chain.network}`);
      continue;
    }

    const lastScannedBlock = await getLastProposalUpdateBlock(chain.network);

    const governanceProxy = new GovernanceProxyMock(chain.sdk);

    const scanRangeOpts = {
      startBlock: 0,
      endBlock: 0,
    };

    // in sake of MVP, arbitrum gens blocks too fast, so we need to limit the range
    // otherwise this schedulle won't complete in hours for the 1st run
    if (!lastScannedBlock) {
      await governanceProxy.processEventsScanRangePr(timelockAddress, scanRangeOpts);
      if (scanRangeOpts.endBlock - scanRangeOpts.startBlock > 2_000_000) {
        scanRangeOpts.startBlock = scanRangeOpts.endBlock - 2_000_000 + 1;
      }
    } else {
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
    const createdProposals: GovernanceProposals[] = [];

    for (const proposal of proposalsCreated) {
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
              transactionHash: e.transactionHash,
              blockNumber: block.number,
              updatedAt: block.timestamp,
            });

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

      createdProposals.push(Object.assign(new GovernanceProposals()), {
        idx: proposalDdbIdx,
        proposalId: proposal.args.id,
        network: chain.network,
        createdAt: Date.now() / 1000,
        contractAddr: timelockAddress,
        targetAddr: proposal.args.target,
        value: proposal.args.value.toNumber(),
        callData: proposal.args.data,
        predecessor: proposal.args.predecessor,
        readyTime: proposal.args.readyTime.toNumber(),
        sender: proposal.args.sender,
        currentStatus: !latestEvent ? proposal.args.status : latestEvent.status,
        creationBlock: block.number,
        updateBlock: !latestEvent ? block.number : latestEvent.blockNumber,
        statuses: proposalsStatuses,
        disputes: proposalsDisputes,
      });

      console.info(
        `New proposal ${proposalDdbIdx} with ${proposalsStatuses.length} statuses and ${proposalsDisputes.length} disputes added`,
      );
    }

    try {
      createdProposals.length > 0 && (await mapper.put(createdProposals));
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
