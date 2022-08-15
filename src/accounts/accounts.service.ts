import { Account } from '@badger-dao/sdk';
import { Service } from '@tsed/di';
import { ethers } from 'ethers';

import { Chain } from '../chains/config/chain.config';
import { InvalidAddrError } from '../errors/validation/invalid.addr.error';
import { getCachedAccount } from './accounts.utils';

@Service()
export class AccountsService {
  async getAccount(chain: Chain, address: string): Promise<Account> {
    let checksumAddress = address;
    try {
      checksumAddress = ethers.utils.getAddress(address);
    } catch {
      throw new InvalidAddrError(`${address}`);
    }
    return getCachedAccount(chain, checksumAddress);
  }
}
