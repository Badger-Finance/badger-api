import { BadRequest } from '@tsed/exceptions';
import { Chain } from '../../chains/config/chain.config';
import { Protocol } from '../../config/constants';
import { SettAffiliateData } from '../../setts/interfaces/sett-affiliate-data.interface';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';

type Affiliates = { [protocol: string]: Affiliate };

export abstract class Affiliate {
  private static affiliates: Affiliates = {};

  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  static register(protocol: Protocol, affiliate: Affiliate): void {
    this.affiliates[protocol] = affiliate;
  }

  static getAffiliate(affiliateData: SettAffiliateData): Affiliate {
    const affiliate = this.affiliates[affiliateData.protocol];
    if (!affiliate) {
      throw new BadRequest(`${affiliate} is not a affiliate`);
    }
    return affiliate;
  }

  abstract getAffiliateVaultData(chain: Chain, sett: SettDefinition): Promise<SettAffiliateData>;
}
