"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountV3Controller = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const schema_1 = require("@tsed/schema");
const chain_config_1 = require("../chains/config/chain.config");
const query_param_error_1 = require("../errors/validation/query.param.error");
const accounts_service_1 = require("./accounts.service");
const account_model_interface_1 = require("./interfaces/account-model.interface");
let AccountV3Controller = class AccountV3Controller {
  async getAccount(address, chain) {
    if (!address) throw new query_param_error_1.QueryParamError("address");
    return this.accountsService.getAccount(chain_config_1.Chain.getChain(chain), address);
  }
};
tslib_1.__decorate(
  [(0, common_1.Inject)(), tslib_1.__metadata("design:type", accounts_service_1.AccountsService)],
  AccountV3Controller.prototype,
  "accountsService",
  void 0
);
tslib_1.__decorate(
  [
    (0, common_1.Get)(),
    (0, schema_1.ContentType)("json"),
    (0, schema_1.Summary)("Get badger user account information"),
    (0, schema_1.Description)(
      "Return key user information for a given account. Includes positions, earnings from use, and claimable balances."
    ),
    (0, schema_1.Returns)(200, account_model_interface_1.AccountModel),
    (0, schema_1.Returns)(400).Description("Not a valid chain"),
    (0, schema_1.Returns)(404).Description("Not a valid account"),
    tslib_1.__param(0, (0, common_1.QueryParams)("address")),
    tslib_1.__param(1, (0, common_1.QueryParams)("chain")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
  ],
  AccountV3Controller.prototype,
  "getAccount",
  null
);
AccountV3Controller = tslib_1.__decorate([(0, common_1.Controller)("/account")], AccountV3Controller);
exports.AccountV3Controller = AccountV3Controller;
//# sourceMappingURL=account.v3.controller.js.map
