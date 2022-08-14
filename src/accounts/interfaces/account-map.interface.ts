import { CachedAccount } from "../../aws/models/cached-account.model";

export interface AccountMap {
  [address: string]: CachedAccount;
}
