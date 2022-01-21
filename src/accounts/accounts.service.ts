import { Account } from '@badger-dao/sdk';
import { Service } from '@tsed/di';
import { BadRequest } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { Chain } from '../chains/config/chain.config';
import { getCachedAccount } from './accounts.utils';

@Service()
export class AccountsService {
  async getAccount(chain: Chain, address: string): Promise<Account> {
    let checksumAddress = address;
    try {
      checksumAddress = ethers.utils.getAddress(address);
    } catch {
      throw new BadRequest(`${checksumAddress} is not a valid account`);
    }
    return getCachedAccount(chain, checksumAddress);
  }
}
