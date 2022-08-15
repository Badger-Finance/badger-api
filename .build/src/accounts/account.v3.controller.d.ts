import { Network } from "@badger-dao/sdk";
import { AccountsService } from "./accounts.service";
import { AccountModel } from "./interfaces/account-model.interface";
export declare class AccountV3Controller {
  accountsService: AccountsService;
  getAccount(address: string, chain?: Network): Promise<AccountModel>;
}
