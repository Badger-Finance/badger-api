import { Network } from "@badger-dao/sdk";
import { AccountsService } from "./accounts.service";
import { AccountModel } from "./interfaces/account-model.interface";
export declare class AccountsV2Controller {
  accountsService: AccountsService;
  getAccount(userId: string, chain: Network): Promise<AccountModel>;
}
