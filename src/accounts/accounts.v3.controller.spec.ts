import { PlatformServerless } from "@tsed/platform-serverless";
import { PlatformServerlessTest } from "@tsed/platform-serverless-testing";

import { NetworkStatus } from "../errors/enums/network-status.enum";
import { TEST_ADDR } from "../test/constants";
import { setupMockChain } from "../test/mocks.utils";
import * as accountsUtils from "./accounts.utils";
import { setupMockAccounts } from "./accounts.v2.controller.spec";
import { AccountsV3Controller } from "./accounts.v3.controller";

describe("accounts.v3.controller", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [AccountsV3Controller]
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  beforeEach(() => {
    setupMockChain();
    setupMockAccounts();
  });

  describe("GET /v3/account", () => {
    describe("with no specified account", () => {
      it("returns a not found response", async () => {
        const { body, statusCode } = await PlatformServerlessTest.request.get("/accounts");
        expect(statusCode).toEqual(NetworkStatus.BadRequest);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe("with an invalid account input", () => {
      it("returns a bad request response", async () => {
        const { body, statusCode } = await PlatformServerlessTest.request
          .get("/accounts")
          .query({ address: "0xjintao" });
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
        const { body, statusCode } = await PlatformServerlessTest.request
          .get(`/accounts`)
          .query({ address: TEST_ADDR });
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
        const { body, statusCode } = await PlatformServerlessTest.request
          .get(`/accounts`)
          .query({ address: TEST_ADDR });
        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });
});
