"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultModel = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const schema_1 = require("@tsed/schema");
const ethers_1 = require("ethers");
const tokens_config_1 = require("../../config/tokens.config");
const bouncer_type_enum_1 = require("../../rewards/enums/bouncer-type.enum");
const full_token_mock_1 = require("../../tokens/mocks/full-token.mock");
const tokens_utils_1 = require("../../tokens/tokens.utils");
const vault_strategy_interface_1 = require("./vault-strategy.interface");
class VaultModel {
  constructor({
    name,
    state,
    asset,
    vaultAsset,
    underlyingToken,
    vaultToken,
    value,
    available,
    balance,
    protocol,
    pricePerFullShare,
    tokens,
    apr,
    apy,
    boost,
    minApr,
    maxApr,
    minApy,
    maxApy,
    sources,
    sourcesApy,
    bouncer,
    strategy,
    type,
    behavior,
    yieldProjection,
    lastHarvest,
    version
  }) {
    this.name = name;
    this.state = state;
    this.asset = asset;
    this.vaultAsset = vaultAsset;
    this.underlyingToken = underlyingToken;
    this.vaultToken = vaultToken;
    this.value = value;
    this.available = available;
    this.balance = balance;
    this.protocol = protocol;
    this.pricePerFullShare = pricePerFullShare;
    this.tokens = tokens;
    this.apr = apr;
    this.apy = apy;
    this.boost = boost;
    this.minApr = minApr;
    this.maxApr = maxApr;
    this.minApy = minApy;
    this.maxApy = maxApy;
    this.sources = sources;
    this.sourcesApy = sourcesApy;
    this.bouncer = bouncer;
    this.strategy = strategy;
    this.type = type;
    this.behavior = behavior;
    this.yieldProjection = yieldProjection;
    this.lastHarvest = lastHarvest;
    this.version = version;
  }
}
tslib_1.__decorate(
  [
    (0, schema_1.Title)("name"),
    (0, schema_1.Description)("vault display name"),
    (0, schema_1.Example)("Convex Tricrypto"),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
  ],
  VaultModel.prototype,
  "name",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("asset"),
    (0, schema_1.Description)("vault underlying asset name"),
    (0, schema_1.Example)("crvTricrypto"),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
  ],
  VaultModel.prototype,
  "asset",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("vaultAsset"),
    (0, schema_1.Description)("Vault asset name"),
    (0, schema_1.Example)("bcrvTricrypto"),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
  ],
  VaultModel.prototype,
  "vaultAsset",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("state"),
    (0, schema_1.Description)("Launch state of the vault"),
    (0, schema_1.Example)(sdk_1.VaultState.Guarded),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
  ],
  VaultModel.prototype,
  "state",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("underlyingToken"),
    (0, schema_1.Description)("Contract address for deposit token"),
    (0, schema_1.Example)("0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
  ],
  VaultModel.prototype,
  "underlyingToken",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("vaultToken"),
    (0, schema_1.Description)("Contract address for vault token"),
    (0, schema_1.Example)("0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
  ],
  VaultModel.prototype,
  "vaultToken",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("value"),
    (0, schema_1.Description)("Currency denominated vault value"),
    (0, schema_1.Example)(1245388.433),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultModel.prototype,
  "value",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("available"),
    (0, schema_1.Description)("Vault available token balance"),
    (0, schema_1.Example)(4053.3221),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultModel.prototype,
  "available",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("balance"),
    (0, schema_1.Description)("Vault underlying token balance"),
    (0, schema_1.Example)(4053.3221),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultModel.prototype,
  "balance",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("protocol"),
    (0, schema_1.Description)("Vault underlying protocol"),
    (0, schema_1.Example)(sdk_1.Protocol.Convex),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
  ],
  VaultModel.prototype,
  "protocol",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("pricePerFullShare"),
    (0, schema_1.Description)("Price per full share, conversion from vault tokens to underlying tokens"),
    (0, schema_1.Example)(1.00032103),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultModel.prototype,
  "pricePerFullShare",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("tokens"),
    (0, schema_1.Description)("Token balances held by the vault"),
    (0, schema_1.Example)([
      (0, tokens_utils_1.mockBalance)(full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER], 3882.35294118),
      (0, tokens_utils_1.mockBalance)(full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.WBTC], 1)
    ]),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Array)
  ],
  VaultModel.prototype,
  "tokens",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("apr"),
    (0, schema_1.Description)("Baseline Vault APR"),
    (0, schema_1.Example)(18.00032103),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultModel.prototype,
  "apr",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("apy"),
    (0, schema_1.Description)("Baseline Vault APY"),
    (0, schema_1.Example)(18.00032103),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultModel.prototype,
  "apy",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("boost"),
    (0, schema_1.Description)(
      "Boost configuration indicating if the vault is boostable, and how much weight it contributes"
    ),
    (0, schema_1.Example)(true),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Object)
  ],
  VaultModel.prototype,
  "boost",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("minApr"),
    (0, schema_1.Description)("Minimum vault APR as modifid by badger boost"),
    (0, schema_1.Example)(8.03),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultModel.prototype,
  "minApr",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("maxApr"),
    (0, schema_1.Description)("Maximum vault APR as modifid by badger boost"),
    (0, schema_1.Example)(8.03),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultModel.prototype,
  "maxApr",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("minApr"),
    (0, schema_1.Description)("Minimum vault APY as modifid by badger boost"),
    (0, schema_1.Example)(8.03),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultModel.prototype,
  "minApy",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("maxApr"),
    (0, schema_1.Description)("Maximum vault APY as modifid by badger boost"),
    (0, schema_1.Example)(8.03),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultModel.prototype,
  "maxApy",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("sources"),
    (0, schema_1.Description)("Vault APR individual yield source breakdown"),
    // @Example([MOCK_YIELD_SOURCES])
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Array)
  ],
  VaultModel.prototype,
  "sources",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("sourcesApy"),
    (0, schema_1.Description)("Vault APY individual yield source breakdown"),
    // @Example([MOCK_YIELD_SOURCES])
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Array)
  ],
  VaultModel.prototype,
  "sourcesApy",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("bouncer"),
    (0, schema_1.Description)("Enumeration displaying the badger bouncer type associated with the vault"),
    (0, schema_1.Example)(bouncer_type_enum_1.BouncerType.Badger),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
  ],
  VaultModel.prototype,
  "bouncer",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("strategy"),
    (0, schema_1.Description)("Vault strategy information"),
    (0, schema_1.Example)({
      address: ethers_1.ethers.constants.AddressZero,
      withdrawFee: 50,
      performanceFee: 20,
      strategistFee: 10
    }),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", vault_strategy_interface_1.VaultStrategy)
  ],
  VaultModel.prototype,
  "strategy",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("type"),
    (0, schema_1.Description)("Enumeration displaying the vault type"),
    (0, schema_1.Example)(sdk_1.VaultType.Standard),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
  ],
  VaultModel.prototype,
  "type",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("behavior"),
    (0, schema_1.Description)("Short description of the vaults strategy operations"),
    (0, schema_1.Example)(sdk_1.VaultBehavior.DCA),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
  ],
  VaultModel.prototype,
  "behavior",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("yieldProjection"),
    (0, schema_1.Description)("Projection of current yield and harvest yield"),
    (0, schema_1.Example)({
      yieldApr: 10,
      yieldTokens: [tokens_config_1.TOKENS.CRV],
      yieldValue: 30,
      harvestApr: 9.95,
      harvestApy: 14.32,
      harvestTokens: [tokens_config_1.TOKENS.BCVXCRV],
      harvestValue: 35
    }),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Object)
  ],
  VaultModel.prototype,
  "yieldProjection",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("lastHarvest"),
    (0, schema_1.Description)("Timestamp of the previous harvest"),
    (0, schema_1.Example)(Date.now()),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultModel.prototype,
  "lastHarvest",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("version"),
    (0, schema_1.Description)("Version of Badger Vault"),
    (0, schema_1.Example)(sdk_1.VaultVersion.v1_5),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
  ],
  VaultModel.prototype,
  "version",
  void 0
);
exports.VaultModel = VaultModel;
//# sourceMappingURL=vault-model.interface.js.map
