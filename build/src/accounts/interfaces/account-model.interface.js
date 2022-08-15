"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountModel = void 0;
const tslib_1 = require("tslib");
const schema_1 = require("@tsed/schema");
const ethers_1 = require("ethers");
const tokens_config_1 = require("../../config/tokens.config");
const full_token_mock_1 = require("../../tokens/mocks/full-token.mock");
const tokens_utils_1 = require("../../tokens/tokens.utils");
class AccountModel {
  constructor(account) {
    this.address = account.address;
    this.boost = account.boost;
    this.boostRank = account.boostRank;
    this.value = account.value;
    this.earnedValue = account.earnedValue;
    this.data = account.data;
    this.claimableBalances = account.claimableBalances;
    this.stakeRatio = account.stakeRatio;
    this.nativeBalance = account.nativeBalance;
    this.nonNativeBalance = account.nonNativeBalance;
    this.nftBalance = account.nftBalance;
    this.bveCvxBalance = account.bveCvxBalance;
    this.diggBalance = account.diggBalance;
  }
}
tslib_1.__decorate(
  [
    (0, schema_1.Title)("id"),
    (0, schema_1.Description)("Account Address"),
    (0, schema_1.Example)("0xb89b8702deac50254d002225b61286bc622d741e"),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
  ],
  AccountModel.prototype,
  "address",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("boost"),
    (0, schema_1.Description)("Badger Boost"),
    (0, schema_1.Example)("2.74"),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  AccountModel.prototype,
  "boost",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("boostRank"),
    (0, schema_1.Description)("Badger Boost Rank"),
    (0, schema_1.Example)("6"),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  AccountModel.prototype,
  "boostRank",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("value"),
    (0, schema_1.Description)("Currency value of an account's current holdings"),
    (0, schema_1.Example)(88888.888),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  AccountModel.prototype,
  "value",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("earnedValue"),
    (0, schema_1.Description)("Currency value of an account's total earnings"),
    (0, schema_1.Example)(1313.13),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  AccountModel.prototype,
  "earnedValue",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("data"),
    (0, schema_1.Description)(
      "Account sett balance information, positions, earnings, and tokens keyed by vault address"
    ),
    (0, schema_1.Example)({
      [tokens_config_1.TOKENS.BADGER]: {
        address: tokens_config_1.TOKENS.BADGER,
        name: full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER].name,
        symbol: full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER].symbol,
        balance: 3.4,
        value: (0, tokens_utils_1.mockBalance)(full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER], 3.4)
          .value,
        tokens: [
          (0, tokens_utils_1.mockBalance)(full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER], 3.4)
        ],
        earnedBalance: 0.4,
        earnedValue: (0, tokens_utils_1.mockBalance)(
          full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER],
          0.4
        ).value,
        earnedTokens: [
          (0, tokens_utils_1.mockBalance)(full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER], 0.4)
        ]
      },
      [tokens_config_1.TOKENS.DIGG]: {
        address: tokens_config_1.TOKENS.DIGG,
        name: full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.DIGG].name,
        symbol: full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.DIGG].symbol,
        balance: 3.4,
        value: (0, tokens_utils_1.mockBalance)(full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.DIGG], 3.4)
          .value,
        tokens: [(0, tokens_utils_1.mockBalance)(full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.DIGG], 3.4)],
        earnedBalance: 0.4,
        earnedValue: (0, tokens_utils_1.mockBalance)(
          full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.DIGG],
          0.4
        ).value,
        earnedTokens: [
          (0, tokens_utils_1.mockBalance)(full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.DIGG], 0.4)
        ]
      }
    }),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Object)
  ],
  AccountModel.prototype,
  "data",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("claimableBalancesMap"),
    (0, schema_1.Description)("Claimable amounts of tokens currently available for an account in the Badger Tree"),
    (0, schema_1.Example)({
      [tokens_config_1.TOKENS.BADGER]: ethers_1.ethers.constants.WeiPerEther.mul(4).toString(),
      [tokens_config_1.TOKENS.XSUSHI]: ethers_1.ethers.constants.WeiPerEther.mul(88).toString(),
      [tokens_config_1.TOKENS.DIGG]: ethers_1.ethers.constants.WeiPerEther.mul(128834885688).toString()
    }),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Object)
  ],
  AccountModel.prototype,
  "claimableBalances",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("stakeRatio"),
    (0, schema_1.Description)("Ratio of native to non native holdings"),
    (0, schema_1.Example)(1.2),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  AccountModel.prototype,
  "stakeRatio",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("nftBalance"),
    (0, schema_1.Description)("Currency value of an account's current nft hodlings"),
    (0, schema_1.Example)(1313.13),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  AccountModel.prototype,
  "nftBalance",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("bveCvxBalance"),
    (0, schema_1.Description)("Currency value of an account's current bveCVX hodlings"),
    (0, schema_1.Example)(1313.13),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  AccountModel.prototype,
  "bveCvxBalance",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("diggBalance"),
    (0, schema_1.Description)("Currency value of an account's current digg hodlings"),
    (0, schema_1.Example)(1313.13),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  AccountModel.prototype,
  "diggBalance",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("nativeBalance"),
    (0, schema_1.Description)("Currency value of an account's current native hodlings"),
    (0, schema_1.Example)(1313.13),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  AccountModel.prototype,
  "nativeBalance",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("nonNativeBalance"),
    (0, schema_1.Description)("Currency value of an account's current non-native hodlings"),
    (0, schema_1.Example)(1313.13),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  AccountModel.prototype,
  "nonNativeBalance",
  void 0
);
exports.AccountModel = AccountModel;
//# sourceMappingURL=account-model.interface.js.map
