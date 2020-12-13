const { UNI_BADGER, SBTC, RENBTC, BADGER, TBTC } = require("./util/constants");

module.exports.setts = {
  "0xd04c48a53c111300ad41190d63681ed3dad998ec": {
    asset: "sBTCCRV",
    protocol: "curve",
    token: SBTC,
    geyser: "0x10fc82867013fce1bd624fafc719bb92df3172fc",
  },
  "0x6def55d2e18486b9ddfaa075bc4e4ee0b28c1545": {
    asset: "renBTCCRV",
    protocol: "curve",
    token: RENBTC,
    geyser: "0x2296f174374508278dc12b806a7f27c87d53ca15",
  },
  "0xb9d076fde463dbc9f915e5392f807315bf940334": {
    asset: "tBTCCRV",
    protocol: "curve",
    token: TBTC,
    geyser: "0x085a9340ff7692ab6703f17ab5ffc917b580a6fd",
  },
  "0xaf5a1decfa95baf63e0084a35c62592b774a2a87": {
    asset: "hrenBTCCRV",
    protocol: "curve",
    token: RENBTC,
    geyser: "0xed0b7f5d9f6286d00763b0ffcba886d8f9d56d5e",
  },
  "0x19d97d8fa813ee2f51ad4b4e04ea08baf4dffc28": {
    asset: "BADGER",
    protocol: "badger",
    token: BADGER,
    geyser: "0xa9429271a28f8543efffa136994c0839e7d7bf77",
  },
  "0x235c9e24d3fb2fafd58a2e49d454fdcd2dbf7ff1": {
    asset: "BADGER-WBTC",
    protocol: "uniswap",
    token: UNI_BADGER,
    geyser: "0xa207d69ea6fb967e54baa8639c408c31767ba62d",
  }
};
