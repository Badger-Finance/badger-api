"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsV2Controller = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const schema_1 = require("@tsed/schema");
const chain_config_1 = require("../chains/config/chain.config");
const accounts_service_1 = require("./accounts.service");
const account_model_interface_1 = require("./interfaces/account-model.interface");
let AccountsV2Controller = class AccountsV2Controller {
  async getAccount(userId, chain) {
    return this.accountsService.getAccount(chain_config_1.Chain.getChain(chain), userId);
  }
};
tslib_1.__decorate(
  [(0, common_1.Inject)(), tslib_1.__metadata("design:type", accounts_service_1.AccountsService)],
  AccountsV2Controller.prototype,
  "accountsService",
  void 0
);
tslib_1.__decorate(
  [
    (0, common_1.Get)("/:accountId"),
    (0, schema_1.ContentType)("json"),
    (0, schema_1.Summary)("Get badger user account information"),
    (0, schema_1.Description)(
      "Return key user information for a given account. Includes positions, earnings from use, and claimable balances."
    ),
    (0, schema_1.Returns)(200, account_model_interface_1.AccountModel),
    (0, schema_1.Returns)(400).Description("Not a valid chain"),
    (0, schema_1.Returns)(404).Description("Not a valid account"),
    tslib_1.__param(0, (0, common_1.PathParams)("accountId")),
    tslib_1.__param(1, (0, common_1.QueryParams)("chain")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
  ],
  AccountsV2Controller.prototype,
  "getAccount",
  null
);
AccountsV2Controller = tslib_1.__decorate(
  [(0, schema_1.Deprecated)(), (0, common_1.Controller)("/accounts")],
  AccountsV2Controller
);
exports.AccountsV2Controller = AccountsV2Controller;
//# sourceMappingURL=accounts.v2.controller.js.map
