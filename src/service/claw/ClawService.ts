import { Service } from '@tsed/common';
import { ethers, BigNumber, utils } from 'ethers';
import { ETHERS_JSONRPC_PROVIDER } from '../../util/constants';
import { empAbi } from '../../util/abi';
import { SponsorData, SyntheticData } from '../../interface/Claw';

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
        ] : [
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            string,
            string,
        ] = (await Promise.all([
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
        ]));
        let globalCollateralizationRatio = BigNumber.from(0);
        if (totalTokensOutstanding.gt(BigNumber.from(0))) {
            globalCollateralizationRatio = (
                cumulativeFeeMultiplier.mul(rawTotalPositionCollateral)
            ).div(totalTokensOutstanding)
        }
        
        const priceIdentifierReadable = utils.toUtf8String(priceIdentifier).replace(/\0/g, '');
        const expirationDate = new Date(expirationTimestamp.toNumber() * 1000);
        return {
            name: `${priceIdentifierReadable} ${expirationDate.getUTCMonth() + 1}-${expirationDate.getUTCDate()}`,
            collateralCurrency,
            globalCollateralizationRatio,
            cumulativeFeeMultiplier,
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
