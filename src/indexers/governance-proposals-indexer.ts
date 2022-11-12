// import {
//   CallScheduledEvent
// } from "@badger-dao/sdk/lib/contracts/TimelockController";
import { GovernanceProxyMock } from '@badger-dao/sdk/lib/governance/mocks/governance.proxy.mock';

import { getSupportedChains } from '../chains/chains.utils';
import { getLastProposalUpdateBlock } from '../governance/governance.utils';

export async function updateGovernanceProposals() {
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
    const proposalsStatusesChanged = await chain.sdk.governance.loadScheduledProposals(scanRangeOpts);
    const proposalsDisputed = await chain.sdk.governance.loadScheduledProposals(scanRangeOpts);

    if (proposalsCreated.length === 0 && proposalsStatusesChanged.length === 0 && proposalsDisputed.length === 0) {
      console.info(`No new proposals for ${chain.network}`);
      continue;
    }

    // const updatedProposalsStatuses: CallScheduledEvent[] = [];
    // const updatedProposalsDisputes: CallScheduledEvent[] = [];
    //
    // for (const proposal of proposalsCreated) {
    //
    // }
  }
}
