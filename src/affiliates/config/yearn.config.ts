import { BigNumber, ethers } from 'ethers';
import { Chain } from '../../chains/config/chain.config';
import { guestListAbi } from '../../config/abi/guest-list.abi';
import { yearnAffiliateVaultWrapperAbi } from '../../config/abi/yearn-affiliate-vault-wrapper.abi';
import { Protocol } from '../../config/constants';
import { SettAffiliateData } from '../../setts/interfaces/sett-affiliate-data.interface';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { getToken } from '../../tokens/tokens.utils';
import { Affiliate } from './affiliate.config';

export class Yearn extends Affiliate {
  constructor() {
    super(Protocol.Yearn);
    Affiliate.register(Protocol.Yearn, this);
  }

  async getAffiliateVaultData(chain: Chain, sett: SettDefinition): Promise<SettAffiliateData> {
    const affiliateData: SettAffiliateData = {
      protocol: Protocol.Yearn,
    };
    if (sett.hasBouncer) {
      try {
        const vaultWrapper = new ethers.Contract(sett.settToken, yearnAffiliateVaultWrapperAbi, chain.provider);
        const guestListAddress = await vaultWrapper.guestList();
        const guesList = new ethers.Contract(guestListAddress, guestListAbi, chain.provider);
        const [available, limit]: [BigNumber, BigNumber] = await Promise.all([
          guesList.remainingTotalDepositAllowed(),
          guesList.totalDepositCap(),
        ]);
        const depositToken = getToken(sett.depositToken);
        affiliateData.availableDepositLimit = parseFloat(ethers.utils.formatUnits(available, depositToken.decimals));
        affiliateData.depositLimit = parseFloat(ethers.utils.formatUnits(limit, depositToken.decimals));
      } catch {
        affiliateData.availableDepositLimit = 0;
        affiliateData.depositLimit = 50;
      }
    }
    return affiliateData;
  }
}
