import { Service } from '@tsed/common';
import { BigNumber, ethers, utils } from 'ethers';
import { FixedPointUnsigned, Liquidation, Position, SponsorData, SyntheticData } from '../../interface/Claw';
import { empAbi } from '../../util/abi';
import { ETHERS_JSONRPC_PROVIDER } from '../../util/constants';

type LiqudationUnformatted = [
	string,
	string,
	number,
	BigNumber,
	FixedPointUnsigned,
	FixedPointUnsigned,
	FixedPointUnsigned,
	FixedPointUnsigned,
	string,
	FixedPointUnsigned,
	FixedPointUnsigned,
];

type SyntheticDataPayload = [
	BigNumber,
	BigNumber,
	BigNumber,
	FixedPointUnsigned,
	BigNumber,
	BigNumber,
	BigNumber,
	BigNumber,
	BigNumber,
	string,
	string,
	string,
];

@Service()
export class ClawService {
	async getSyntheticData(empAddress: string): Promise<SyntheticData> {
		const empContract = new ethers.Contract(empAddress, empAbi, ETHERS_JSONRPC_PROVIDER);
		const [
			cumulativeFeeMultiplier,
			rawTotalPositionCollateral,
			totalTokensOutstanding,
			totalPositionCollateral,
			collateralRequirement,
			expirationTimestamp,
			minSponsorTokens,
			withdrawalLiveness,
			liquidationLiveness,
			priceIdentifier,
			collateralCurrency,
			tokenCurrency,
		]: SyntheticDataPayload = (await Promise.all([
			empContract.cumulativeFeeMultiplier(),
			empContract.rawTotalPositionCollateral(),
			empContract.totalTokensOutstanding(),
			empContract.totalPositionCollateral(),
			empContract.collateralRequirement(),
			empContract.expirationTimestamp(),
			empContract.minSponsorTokens(),
			empContract.withdrawalLiveness(),
			empContract.liquidationLiveness(),
			empContract.priceIdentifier(),
			empContract.collateralCurrency(),
			empContract.tokenCurrency(),
		])) as SyntheticDataPayload;
		let globalCollateralizationRatio = BigNumber.from(0);
		if (totalTokensOutstanding.gt(BigNumber.from(0))) {
			globalCollateralizationRatio = cumulativeFeeMultiplier
				.mul(rawTotalPositionCollateral)
				.div(totalTokensOutstanding);
		}

		const priceIdentifierReadable = utils.toUtf8String(priceIdentifier).replace(/\0/g, '');
		const expirationDate = new Date(expirationTimestamp.toNumber() * 1000);
		return {
			name: `${priceIdentifierReadable} ${expirationDate.getUTCMonth() + 1}-${expirationDate.getUTCDate()}`,
			collateralCurrency,
			globalCollateralizationRatio,
			cumulativeFeeMultiplier,
			totalPositionCollateral: convertFixedPointUnsigned(totalPositionCollateral),
			totalTokensOutstanding,
			collateralRequirement,
			expirationTimestamp,
			minSponsorTokens,
			withdrawalLiveness,
			liquidationLiveness,
			tokenCurrency,
		} as SyntheticData;
	}

	async getSponsorData(empAddress: string, sponsorAddress: string): Promise<SponsorData> {
		const empContract = new ethers.Contract(empAddress, empAbi, ETHERS_JSONRPC_PROVIDER);
		const liquidations = await getLiquidations(empContract, sponsorAddress);
		const position = await getPosition(empContract, sponsorAddress);
		return {
			liquidations,
			position,
			pendingWithdrawal: position.transferPositionRequestPassTimestamp.toNumber() != 0,
		} as SponsorData;
	}
}

const getLiquidations = async (empContract: ethers.Contract, sponsorAddress: string): Promise<Liquidation[]> => {
	const liquidations: LiqudationUnformatted[] = await empContract.getLiquidations(sponsorAddress);
	return liquidations.map(convertLiquidation);
};

const convertLiquidation = (liquidation: LiqudationUnformatted): Liquidation => {
	const [
		sponsor,
		liquidator,
		state,
		liquidationTime,
		tokensOutstanding,
		lockedCollateral,
		liquidatedCollateral,
		rawUnitCollateral,
		disputer,
		settlementPrice,
		finalFee,
	] = liquidation;
	return {
		sponsor,
		liquidator,
		state,
		liquidationTime,
		tokensOutstanding: convertFixedPointUnsigned(tokensOutstanding),
		lockedCollateral: convertFixedPointUnsigned(lockedCollateral),
		liquidatedCollateral: convertFixedPointUnsigned(liquidatedCollateral),
		rawUnitCollateral: convertFixedPointUnsigned(rawUnitCollateral),
		disputer,
		settlementPrice: convertFixedPointUnsigned(settlementPrice),
		finalFee: convertFixedPointUnsigned(finalFee),
	};
};

const getPosition = async (empContract: ethers.Contract, sponsorAddress: string): Promise<Position> => {
	const [
		tokensOutstanding,
		withdrawalRequestPassTimestamp,
		withdrawalRequestAmount,
		rawCollateral,
		transferPositionRequestPassTimestamp,
	]: [FixedPointUnsigned, BigNumber, FixedPointUnsigned, FixedPointUnsigned, BigNumber] = await empContract.positions(
		sponsorAddress,
	);
	return {
		tokensOutstanding: convertFixedPointUnsigned(tokensOutstanding),
		withdrawalRequestPassTimestamp,
		withdrawalRequestAmount: convertFixedPointUnsigned(withdrawalRequestAmount),
		rawCollateral: convertFixedPointUnsigned(rawCollateral),
		transferPositionRequestPassTimestamp,
	};
};

// Many UMA contracts return custom type FixedPoint.Unsigned for uint256 which is a struct defined below.
// ```
// struct FixedPoint.Unsigned {
//     uint256 rawValue;
// }
// ```
// These resolve to be an single value arr -> [BigNumber] so we need to validate/extract the internal value.
const convertFixedPointUnsigned = (maybeUnsigned: FixedPointUnsigned): BigNumber => {
	if (!Array.isArray(maybeUnsigned) || maybeUnsigned.length !== 1) {
		throw new Error(`value not unsigned value ${maybeUnsigned}`);
	}
	return maybeUnsigned[0];
};
