import { Service } from "@tsed/common";
import { ethers, BigNumber } from "ethers";
import { ETHERS_JSONRPC_PROVIDER } from "../../util/constants";
import { empAbi } from "../../util/abi";
import { SponsorData, SyntheticData } from "../../interface/Claw";

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
    ] : [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] = (await Promise.all([
      empContract.cumulativeFeeMultiplier(),
      empContract.rawTotalPositionCollateral(),
      empContract.totalTokensOutstanding(),
      empContract.totalPositionCollateral(),
      empContract.collateralRequirement(),
      empContract.expirationTimestamp(),
      empContract.minSponsorTokens(),
      empContract.withdrawalLiveness(),
      empContract.liquidationLiveness(),
    ]));
    const globalCollateralizationRatio = (cumulativeFeeMultiplier.mul(rawTotalPositionCollateral)).div(totalTokensOutstanding)
    return {
      globalCollateralizationRatio,
      totalPositionCollateral,
      totalTokensOutstanding,
      collateralRequirement,
      expirationTimestamp,
      minSponsorTokens,
      withdrawalLiveness,
      liquidationLiveness,
    } as SyntheticData;
  }

  async getSponsorData(empAddress: string, sponsorAddress: string): Promise<SponsorData> {
    const empContract = new ethers.Contract(empAddress, empAbi, ETHERS_JSONRPC_PROVIDER);
    const liquidations = await empContract.getLiquidations(sponsorAddress);
    const position = await empContract.positions(sponsorAddress);
    return {
      liquidations,
      position,
      pendingWithdrawal: position.transferPositionRequestPassTimestamp.toNumber() != 0,
    } as SponsorData;
  }

}
