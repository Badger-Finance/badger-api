import { PlatformTest } from "@tsed/common";
import { BadRequest } from "@tsed/exceptions";
import SuperTest from "supertest";

import { ChainVaults } from "../chains/vaults/chain.vaults";
import { NetworkStatus } from "../errors/enums/network-status.enum";
import { Server } from "../server";
import { TEST_ADDR } from "../test/constants";
import { setupRewardsMocks } from "./reward.v2.controller.spec";

describe("rewards.v3.controller", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(PlatformTest.bootstrap(Server));
  beforeAll(async () => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe("GET /v3/rewards/schedules", () => {
    describe("with no specified chain", () => {
      it("returns schedules for default chain and all vaults", async () => {
        setupRewardsMocks();
        const { body } = await request.get("/v3/rewards/schedules/list").expect(200);
        expect(body).toMatchSnapshot();
      });
    });

    describe("with active param true", () => {
      it("returns active schedules for default chain and all vaults", async () => {
        setupRewardsMocks();
        const { body } = await request.get("/v3/rewards/schedules/list?active=true").expect(200);
        expect(body).toMatchSnapshot();
      });
    });

    describe("with an invalid specified chain", () => {
      it("returns a 400", async () => {
        setupRewardsMocks();
        const { body } = await request.get("/v3/rewards/schedules/list?chain=invalid").expect(BadRequest.STATUS);
        expect(body).toMatchSnapshot();
      });
    });
  });

  describe("GET /v3/rewards/schedules", () => {
    describe("with no specified chain", () => {
      it("returns schedule for default chain and one vault", async () => {
        setupRewardsMocks();
        const { body } = await request.get(`/v3/rewards/schedules?address=${TEST_ADDR}`).expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
      });
    });

    describe("with active param true", () => {
      it("returns schedules for default chain and one vault", async () => {
        setupRewardsMocks();
        const { body } = await request.get(`/v3/rewards/schedules?address=${TEST_ADDR}&active=true`).expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
      });
    });

    describe("with an invalid specified chain", () => {
      it("returns a 400", async () => {
        setupRewardsMocks();
        const { body } = await request.get(`/v3/rewards/schedules?address=${TEST_ADDR}&chain=invalid`).expect(NetworkStatus.BadRequest);
        expect(body).toMatchSnapshot();
      });
    });

    describe("with invalid param specified", () => {
      it("returns a 404, NotFound", async () => {
        setupRewardsMocks();
        jest.spyOn(ChainVaults.prototype, "getVault").mockImplementation(async (_) => {
          throw new Error("Missing Vault");
        });
        const { body } = await request.get(`/v3/rewards/schedules?address=unknowsvaultdata`).expect(NetworkStatus.NotFound);
        expect(body).toMatchSnapshot();
      });
    });
  });
});
