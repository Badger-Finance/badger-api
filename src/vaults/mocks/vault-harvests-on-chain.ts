import { HarvestType } from "@badger-dao/sdk";

import { TEST_ADDR, TEST_TOKEN } from "../../test/constants";
import { VaultHarvestsExtendedResp } from "../interfaces/vault-harvest-extended-resp.interface";

export const vaultHarvestsOnChainMock: Record<string, VaultHarvestsExtendedResp[]> = {
  [TEST_TOKEN]: [
    {
      timestamp: 1636878824,
      block: 13870247,
      amount: 0.004992355665779731,
      token: "0x075b1bb99792c9e1041ba13afef80c91a1e70fb3",
      eventType: HarvestType.Harvest,
      strategyBalance: 2481.941296192305,
      estimatedApr: 0.01
    },
    {
      timestamp: 1637346968,
      block: 13647172,
      amount: 0.01741109755651847,
      token: "0x075b1bb99792c9e1041ba13afef80c91a1e70fb3",
      eventType: HarvestType.Harvest,
      strategyBalance: 2366.0613517200886,
      estimatedApr: 0.06
    },
    {
      timestamp: 1637717848,
      block: 13674352,
      amount: 0.02354000454094577,
      token: "0x075b1bb99792c9e1041ba13afef80c91a1e70fb3",
      eventType: HarvestType.Harvest,
      strategyBalance: 2314.0426476124358,
      estimatedApr: 0.09
    },
    {
      timestamp: 1638065247,
      block: 13699647,
      amount: 0.014972638754161653,
      token: "0x075b1bb99792c9e1041ba13afef80c91a1e70fb3",
      eventType: HarvestType.Harvest,
      strategyBalance: 2300.047794001301,
      estimatedApr: 0.01
    },
    {
      timestamp: 1640034477,
      block: 13844434,
      amount: 0.036611569490331085,
      token: "0x075b1bb99792c9e1041ba13afef80c91a1e70fb3",
      eventType: HarvestType.Harvest,
      strategyBalance: 2285.8514972932135,
      estimatedApr: 0.15
    },
    {
      timestamp: 1640380383,
      block: 13870247,
      amount: 0,
      token: "0x075b1bb99792c9e1041ba13afef80c91a1e70fb3",
      eventType: HarvestType.Harvest,
      strategyBalance: 2257.6472384811345,
      estimatedApr: 0
    },
    {
      timestamp: 1640731025,
      block: 13896464,
      amount: 0.013538827735603299,
      token: "0x075b1bb99792c9e1041ba13afef80c91a1e70fb3",
      eventType: HarvestType.Harvest,
      strategyBalance: 2255.6396126895474,
      estimatedApr: 0
    },
    {
      timestamp: 1636878824,
      block: 13612910,
      amount: 0.004992355665779731,
      token: "0x075b1bb99792c9e1041ba13afef80c91a1e70fb3",
      eventType: HarvestType.TreeDistribution,
      strategyBalance: 2481.941296192305,
      estimatedApr: 0.01
    },
    {
      timestamp: 1637346968,
      block: 13647172,
      amount: 0.01741109755651847,
      token: "0x075b1bb99792c9e1041ba13afef80c91a1e70fb3",
      eventType: HarvestType.TreeDistribution,
      strategyBalance: 2366.0613517200886,
      estimatedApr: 0.06
    },
    {
      timestamp: 1637717848,
      block: 13674352,
      amount: 0.02354000454094577,
      token: "0x075b1bb99792c9e1041ba13afef80c91a1e70fb3",
      eventType: HarvestType.TreeDistribution,
      strategyBalance: 2314.0426476124358,
      estimatedApr: 0.09
    },
    {
      timestamp: 1638065247,
      block: 13699647,
      amount: 0.014972638754161653,
      token: "0x075b1bb99792c9e1041ba13afef80c91a1e70fb3",
      eventType: HarvestType.TreeDistribution,
      strategyBalance: 2300.047794001301,
      estimatedApr: 0.01
    },
    {
      timestamp: 1640034477,
      block: 13844434,
      amount: 0.036611569490331085,
      token: "0x075b1bb99792c9e1041ba13afef80c91a1e70fb3",
      eventType: HarvestType.TreeDistribution,
      strategyBalance: 2285.8514972932135,
      estimatedApr: 0.15
    },
    {
      timestamp: 1640380383,
      block: 13870247,
      amount: 0,
      token: "0x075b1bb99792c9e1041ba13afef80c91a1e70fb3",
      eventType: HarvestType.TreeDistribution,
      strategyBalance: 2257.6472384811345,
      estimatedApr: 0
    },
    {
      timestamp: 1640731025,
      block: 13896464,
      amount: 0.013538827735603299,
      token: "0x075b1bb99792c9e1041ba13afef80c91a1e70fb3",
      eventType: HarvestType.TreeDistribution,
      strategyBalance: 2255.6396126895474,
      estimatedApr: 0
    }
  ],
  [TEST_ADDR]: [
    {
      timestamp: 1636874531,
      block: 13612609,
      amount: 0.14279248845801554,
      token: "0x49849c98ae39fff122806c06791fa73784fb3675",
      eventType: HarvestType.Harvest,
      strategyBalance: 2340.323802791289,
      estimatedApr: 0.41
    },
    {
      timestamp: 1637345324,
      block: 13647062,
      amount: 0.24151759209301635,
      token: "0x49849c98ae39fff122806c06791fa73784fb3675",
      eventType: HarvestType.Harvest,
      strategyBalance: 3245.35879183169,
      estimatedApr: 0.09
    },
    {
      timestamp: 1640044054,
      block: 13845169,
      amount: 0.9904075784157815,
      token: "0x49849c98ae39fff122806c06791fa73784fb3675",
      eventType: HarvestType.Harvest,
      strategyBalance: 5282.35224785979,
      estimatedApr: 681.2
    },
    {
      timestamp: 1640044922,
      block: 13845245,
      amount: 0.000119121343940281,
      token: "0x49849c98ae39fff122806c06791fa73784fb3675",
      eventType: HarvestType.Harvest,
      strategyBalance: 5282.352366981134,
      estimatedApr: 0
    },
    {
      timestamp: 1636874531,
      block: 13612609,
      amount: 0.14279248845801554,
      token: "0x49849c98ae39fff122806c06791fa73784fb3675",
      eventType: HarvestType.TreeDistribution,
      strategyBalance: 2340.323802791289,
      estimatedApr: 0.41
    },
    {
      timestamp: 1637345324,
      block: 13647062,
      amount: 0.24151759209301635,
      token: "0x49849c98ae39fff122806c06791fa73784fb3675",
      eventType: HarvestType.TreeDistribution,
      strategyBalance: 3245.35879183169,
      estimatedApr: 0.09
    },
    {
      timestamp: 1640044054,
      block: 13845169,
      amount: 0.9904075784157815,
      token: "0x49849c98ae39fff122806c06791fa73784fb3675",
      eventType: HarvestType.TreeDistribution,
      strategyBalance: 5282.35224785979,
      estimatedApr: 681.2
    },
    {
      timestamp: 1640044922,
      block: 13845245,
      amount: 0.000119121343940281,
      token: "0x49849c98ae39fff122806c06791fa73784fb3675",
      eventType: HarvestType.TreeDistribution,
      strategyBalance: 5282.352366981134,
      estimatedApr: 0
    }
  ]
};
