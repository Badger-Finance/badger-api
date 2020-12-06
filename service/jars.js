const { UNI_WBTC, UNI_DAI, UNI_USDC, UNI_USDT, DAI, THREE_CRV, SCRV, RENBTC } = require("./util/constants");

module.exports.jars = {
  "0xc80090aa05374d336875907372ee4ee636cbc562": {
    asset: "WBTC-ETH",
    token: UNI_WBTC,
    protocol: "uniswap",
  },
  "0xcffa068f1e44d98d3753966ebd58d4cfe3bb5162": {
    asset: "DAI-ETH",
    token: UNI_DAI,
    protocol: "uniswap",
  },
  "0x53bf2e62fa20e2b4522f05de3597890ec1b352c6": {
    asset: "USDC-ETH",
    token: UNI_USDC,
    protocol: "uniswap",
  },
  "0x09fc573c502037b149ba87782acc81cf093ec6ef": {
    asset: "USDT-ETH",
    token: UNI_USDT,
    protocol: "uniswap",
  },
  "0x6949bb624e8e8a90f87cd2058139fcd77d2f3f87": {
    asset: "cDAI",
    token: DAI,
    protocol: "compound",
  },
  "0x1bb74b5ddc1f4fc91d6f9e7906cf68bc93538e33": {
    asset: "3poolCRV",
    token: THREE_CRV,
    protocol: "curve",
  },
  "0x68d14d66b2b0d6e157c06dc8fefa3d8ba0e66a89": {
    asset: "sCRV",
    token: SCRV,
    protocol: "curve",
  },
  "0x2e35392f4c36eba7ecafe4de34199b2373af22ec": {
    asset: "renBTCCRV",
    token: RENBTC,
    protocol: "curve",
  }
};
