import { BigNumber } from 'ethers';

export interface Liquidation {
	/*
	 * Following variables set upon creation of liquidation:
	 * Liquidated (and expired or not), Pending a Dispute, or Dispute has resolved
	 *  - 0 == Uninitialized
	 *  - 1 == NotDisputed
	 *  - 2 == Disputed
	 *  - 3 == DisputeSucceeded
	 *  - 4 == DisputeFailed
	 */
	state: number;
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

export interface Position {
	tokensOutstanding: BigNumber;
	withdrawalRequestPassTimestamp: BigNumber;
	withdrawalRequestAmount: BigNumber;
	rawCollateral: BigNumber;
	transferPositionRequestPassTimestamp: BigNumber;
}

export interface SponsorData {
	liquidations: Liquidation[];
	position: Position;
	pendingWithdrawal: boolean;
}

export interface SyntheticData {
	// Long name of the synhetic (includes expiration date)
	name: string;
	// Token address of the underlying collateral currency.
	collateralCurrency: string;
	// Token address of the synthetic token currency.
	tokenCurrency: string;
	globalCollateralizationRatio: BigNumber;
	totalPositionCollateral: BigNumber; // Total collateral supplied.
	totalTokensOutstanding: BigNumber; // Token debt issued.
	collateralRequirement: BigNumber;
	expirationTimestamp: BigNumber;
	// Min number of sponsor tokens to mint (will default to 100 tokens or ~$100).
	minSponsorTokens: BigNumber;
	// Amount of time (in seconds) a sponsor must wait to withdraw without liquidation
	// for "slow" withdrawals.
	withdrawalLiveness: BigNumber;
	// Amount of time (in seconds) a liquidator must wait to liquidate a sponsor
	// position without a dispute.
	liquidationLiveness: BigNumber;
	/*
	 * Tracks the cumulative fees that have been paid by the contract for use by derived contracts.
	 * The multiplier starts at 1, and is updated by computing cumulativeFeeMultiplier * (1 - effectiveFee).
	 * Put another way, the cumulativeFeeMultiplier is (1 - effectiveFee1) * (1 - effectiveFee2) ...
	 * For example:
	 * The cumulativeFeeMultiplier should start at 1.
	 * If a 1% fee is charged, the multiplier should update to .99.
	 * If another 1% fee is charged, the multiplier should be 0.99^2 (0.9801).
	 */
	cumulativeFeeMultiplier: BigNumber;
}

// Many UMA contracts return custom type FixedPoint.Unsigned for uint256 which is a struct defined below.
// ```
// struct FixedPoint.Unsigned {
//     uint256 rawValue;
// }
// ```
// These resolve to be an single value arr -> [BigNumber] so we define a type here to represent these.
export interface FixedPointUnsigned {
	[index: number]: BigNumber;
}
