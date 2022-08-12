import { Account } from '@badger-dao/sdk';
import { Chain } from '../chains/config/chain.config';
export declare class AccountsService {
    getAccount(chain: Chain, address: string): Promise<Account>;
}
