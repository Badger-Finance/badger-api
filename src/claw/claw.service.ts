import { Service } from '@tsed/common';
import { BigNumber, ethers, utils } from 'ethers';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { Emp__factory } from '../contracts';
import { FixedPointUnsigned, Liquidation, Position, SponsorData, SyntheticData } from './interface/claw.interface';

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

@Service()
export class ClawService {
  async getSyntheticData(empAddress: string): Promise<SyntheticData> {
    const provider = Chain.getChain(ChainNetwork.Ethereum).provider;
    const empContract = Emp__factory.connect(empAddress, provider);
    const [
      cumulativeFeeMultiplier,
      rawTotalPositionCollateral,
      totalTokensOutstanding,
      totalPositionCollateral,
      collateralRequirement,
      expirationTimestamp,
      expiryPrice,
      minSponsorTokens,
      withdrawalLiveness,
      liquidationLiveness,
    ] = await Promise.all([
      empContract.cumulativeFeeMultiplier(),
      empContract.rawTotalPositionCollateral(),
      empContract.totalTokensOutstanding(),
      empContract.totalPositionCollateral(),
      empContract.collateralRequirement(),
      empContract.expirationTimestamp(),
      empContract.expiryPrice(),
      empContract.minSponsorTokens(),
      empContract.withdrawalLiveness(),
      empContract.liquidationLiveness(),
    ]);
    let globalCollateralizationRatio = BigNumber.from(0);
    if (totalTokensOutstanding.gt(BigNumber.from(0))) {
      globalCollateralizationRatio = cumulativeFeeMultiplier
        .mul(rawTotalPositionCollateral)
        .div(totalTokensOutstanding);
    }

    const [priceIdentifier, collateralCurrency, tokenCurrency] = await Promise.all([
      empContract.priceIdentifier(),
      empContract.collateralCurrency(),
      empContract.tokenCurrency(),
    ]);
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
      expiryPrice,
      minSponsorTokens,
      withdrawalLiveness,
      liquidationLiveness,
      tokenCurrency,
    } as SyntheticData;
  }

  async getSponsorData(empAddress: string, sponsorAddress: string): Promise<SponsorData> {
    const provider = Chain.getChain(ChainNetwork.Ethereum).provider;
    const empContract = Emp__factory.connect(empAddress, provider);
    const liquidations = await getLiquidations(empContract, sponsorAddress);
    const position = await getPosition(empContract, sponsorAddress);
    return {
      liquidations,
      position,
      pendingWithdrawal: position.withdrawalRequestPassTimestamp.toNumber() != 0,
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
  const [tokensOutstanding, withdrawalRequestPassTimestamp, withdrawalRequestAmount, rawCollateral]: [
    FixedPointUnsigned,
    BigNumber,
    FixedPointUnsigned,
    FixedPointUnsigned,
  ] = await empContract.positions(sponsorAddress);
  return {
    tokensOutstanding: convertFixedPointUnsigned(tokensOutstanding),
    withdrawalRequestPassTimestamp,
    withdrawalRequestAmount: convertFixedPointUnsigned(withdrawalRequestAmount),
    rawCollateral: convertFixedPointUnsigned(rawCollateral),
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
