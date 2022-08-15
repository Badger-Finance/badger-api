"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultTokenBalance = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const constants_1 = require("../../config/constants");
const cached_token_balance_interface_1 = require("../../tokens/interfaces/cached-token-balance.interface");
let VaultTokenBalance = class VaultTokenBalance {};
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.hashKey)(), tslib_1.__metadata("design:type", String)],
  VaultTokenBalance.prototype,
  "vault",
  void 0
);
tslib_1.__decorate(
  [
    (0, dynamodb_data_mapper_annotations_1.attribute)({
      memberType: (0, dynamodb_data_mapper_1.embed)(cached_token_balance_interface_1.CachedTokenBalance)
    }),
    tslib_1.__metadata("design:type", Array)
  ],
  VaultTokenBalance.prototype,
  "tokenBalances",
  void 0
);
VaultTokenBalance = tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.table)(constants_1.VAULT_BALANCES_DATA)],
  VaultTokenBalance
);
exports.VaultTokenBalance = VaultTokenBalance;
//# sourceMappingURL=vault-token-balance.model.js.map
