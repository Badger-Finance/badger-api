import { Network } from "@badger-dao/sdk";
import { PlatformServerless } from "@tsed/platform-serverless";
import { PlatformServerlessTest } from "@tsed/platform-serverless-testing";

import { getChainStartBlockKey } from "../aws/dynamodb.utils";
import { NetworkStatus } from "../errors/enums/network-status.enum";
import { TEST_ADDR } from "../test/constants";
import { setupMockChain } from "../test/mocks.utils";
import * as accountsUtils from "./accounts.utils";
import { AccountsV2Controller } from "./accounts.v2.controller";

export function setupMockAccounts() {
  jest.spyOn(accountsUtils, "getClaimableBalanceSnapshot").mockImplementation(async () => ({
    chainStartBlock: getChainStartBlockKey(Network.Ethereum, 10),
    address: TEST_ADDR,
    chain: Network.Ethereum,
    startBlock: 100,
    claimableBalances: [],
    expiresAt: Date.now(),
    pageId: 0
  }));
  jest.spyOn(accountsUtils, "getLatestMetadata").mockImplementation(async (chain) => ({
    startBlock: 10,
    endBlock: 15,
    chainStartBlock: getChainStartBlockKey(Network.Ethereum, 10),
    chain: chain.network,
    cycle: 10,
    count: 0
  }));
}

describe("accounts.v2.controller", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [AccountsV2Controller]
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  beforeEach(() => {
    setupMockChain();
  });

  describe("GET /v2/accounts", () => {
    describe("with no specified account", () => {
      it("returns a not found response", async () => {
        const { statusCode } = await PlatformServerlessTest.request.get("/accounts");
        expect(statusCode).toEqual(NetworkStatus.NotFound);
      });
    });

    describe("with an invalid account input", () => {
      it("returns a bad request response", async () => {
        const { body, statusCode } = await PlatformServerlessTest.request.get("/accounts/0xjintao");
        expect(statusCode).toEqual(NetworkStatus.BadRequest);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe("with a non participant account", () => {
      it("returns a default account response", async () => {
        jest.spyOn(accountsUtils, "getCachedAccount").mockImplementation(async (_chain, address) => ({
          address,
          value: 0,
          earnedValue: 0,
          boost: 1,
          rank: 1035,
          boostRank: 1035,
          multipliers: {},
          data: {},
          claimableBalances: {},
          stakeRatio: 0,
          nftBalance: 0,
          bveCvxBalance: 0,
          diggBalance: 0,
          nativeBalance: 0,
          nonNativeBalance: 0
        }));
        const { body, statusCode } = await PlatformServerlessTest.request.get("/accounts/" + TEST_ADDR);
        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe("with a participant account", () => {
      it("returns a cached account response", async () => {
        jest.spyOn(accountsUtils, "getCachedAccount").mockImplementation(async (_chain, address) => ({
          address,
          value: 10,
          earnedValue: 1,
          boost: 2000,
          rank: 1,
          boostRank: 1,
          multipliers: {},
          data: {},
          claimableBalances: {},
          stakeRatio: 1,
          nftBalance: 3,
          bveCvxBalance: 0,
          diggBalance: 0,
          nativeBalance: 3,
          nonNativeBalance: 5
        }));
        const { body, statusCode } = await PlatformServerlessTest.request.get("/accounts/" + TEST_ADDR);
        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });
});
