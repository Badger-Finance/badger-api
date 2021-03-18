import { Controller, Get, PathParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { SponsorData, SyntheticData } from '../interface/Claw';
import { ClawService } from '../service/claw/ClawService';

/*
 * The expiring multiparty (EMP) contract represents a collaterizable synthetic token.
 * We mint these using underlying sett tokens as collateral. In our case its:
 *   - bBADGER -> bCLAW
 *   - bwBTC/ETH SLP -> sCLAW
 *
 * See EMP contract docs for more contract specific info:
 * https://docs-dot-uma-protocol.appspot.com/uma/contracts/ExpiringMultiParty.html
 *
 * See UMA docs for high level info:
 * https://docs.umaproject.org/
 *
 */
@Controller('/claw')
export class ClawController {
  constructor(private clawService: ClawService) {}

  @Get('/emp/:empAddress')
  @ContentType('json')
  async getSyntheticData(@PathParams('empAddress') empAddress: string): Promise<SyntheticData> {
    return await this.clawService.getSyntheticData(empAddress);
  }

  @Get('/emp/:empAddress/sponsor/:sponsorAddress')
  @ContentType('json')
  async getSponsorData(
    @PathParams('empAddress') empAddress: string,
    @PathParams('sponsorAddress') sponsorAddress: string,
  ): Promise<SponsorData> {
    return await this.clawService.getSponsorData(empAddress, sponsorAddress);
  }
}
