import { BigNumber } from "ethers";

interface Liqudation {
  /* 
   * Following variables set upon creation of liquidation:
   * Liquidated (and expired or not), Pending a Dispute, or Dispute has resolved
   *  - 0 == Uninitialized
   *  - 1 == NotDisputed
   *  - 2 == Disputed
   *  - 3 == DisputeSucceeded
   *  - 4 == DisputeFailed
   */
  state: BigNumber;
  liquidationTime: BigNumber; // Time when liquidation is initiated, needed to get price from Oracle
  tokensOutstanding: BigNumber; // Synthetic tokens required to be burned by liquidator to initiate dispute
  lockedCollateral: BigNumber; // Collateral locked by contract and released upon expiry or post-dispute
  sponsor: string; // Address of the liquidated position's sponsor
  liquidator: string; // Address who created this liquidation
  // Following variables determined by the position that is being liquidated:
  // Amount of collateral being liquidated, which could be different from
  // lockedCollateral if there were pending withdrawals at the time of liquidation
  liquidatedCollateral: BigNumber;
  // Unit value (starts at 1) that is used to track the fees per unit of collateral over the course of the liquidation.
  rawUnitCollateral: BigNumber;
  // Following variable set upon initiation of a dispute:
  disputer: string; // Person who is disputing a liquidation
  // Following variable set upon a resolution of a dispute:
  settlementPrice: BigNumber; // Final price as determined by an Oracle following a dispute
  finalFee: BigNumber;
}

interface Position {
  tokensOutstanding: BigNumber;
  withdrawalRequestPassTimestamp: BigNumber;
  withdrawalRequestAmount: BigNumber;
  rawCollateral: BigNumber;
  transferPositionRequestPassTimestamp: BigNumber;
}

export interface SponsorData {
  liquidations: Liqudation[];
  position: Position;
  pendingWithdrawal: boolean,
}

export interface SyntheticData {
  globalCollateralizationRatio: BigNumber;
  totalPositionCollateral: BigNumber; // Total collateral supplied.
  totalTokensOutstanding: BigNumber; // Token debt issued.
  collateralRequirement: BigNumber;
}
