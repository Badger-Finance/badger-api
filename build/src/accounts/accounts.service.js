"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
const tslib_1 = require("tslib");
const di_1 = require("@tsed/di");
const ethers_1 = require("ethers");
const invalid_addr_error_1 = require("../errors/validation/invalid.addr.error");
const accounts_utils_1 = require("./accounts.utils");
let AccountsService = class AccountsService {
  async getAccount(chain, address) {
    let checksumAddress = address;
    try {
      checksumAddress = ethers_1.ethers.utils.getAddress(address);
    } catch {
      throw new invalid_addr_error_1.InvalidAddrError(`${address}`);
    }
    return (0, accounts_utils_1.getCachedAccount)(chain, checksumAddress);
  }
};
AccountsService = tslib_1.__decorate([(0, di_1.Service)()], AccountsService);
exports.AccountsService = AccountsService;
//# sourceMappingURL=accounts.service.js.map
