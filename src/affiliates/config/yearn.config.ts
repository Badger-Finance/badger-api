import { BigNumber, ethers } from 'ethers';
import { Chain } from '../../chains/config/chain.config';
import { yearnAffiliateVaultAbi } from '../../config/abi/yearn-affiliate-vault.abi';
import { yearnAffiliateVaultWrapperAbi } from '../../config/abi/yearn-affiliate-vault-wrapper.abi';
import { Protocol } from '../../config/constants';
import { SettAffiliateData } from '../../setts/interfaces/sett-affiliate-data.interface';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
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
      const vaultWrapper = new ethers.Contract(sett.settToken, yearnAffiliateVaultWrapperAbi, chain.provider);
      const vaultAddress = await vaultWrapper.bestVault();
      const vault = new ethers.Contract(vaultAddress, yearnAffiliateVaultAbi, chain.provider);
      const [available, limit]: [BigNumber, BigNumber] = await Promise.all([
        vault.availableDepositLimit(),
        vault.depositLimit(),
      ]);
      affiliateData.availableDepositLimit = parseFloat(ethers.utils.formatEther(available));
      affiliateData.depositLimit = parseFloat(ethers.utils.formatEther(limit));
    }
    return affiliateData;
  }
}
