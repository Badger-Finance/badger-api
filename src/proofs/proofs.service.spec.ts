import { PlatformTest } from "@tsed/common";

import * as s3Utils from "../aws/s3.utils";
import { Chain } from "../chains/config/chain.config";
import { TOKENS } from "../config/tokens.config";
import { MOCK_BOUNCER_FILE, TEST_ADDR } from "../test/constants";
import { setupMockChain } from "../test/mocks.utils";
import { ProofsService } from "./proofs.service";

describe("proofs.service", () => {
  let service: ProofsService;

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<ProofsService>(ProofsService);
  });

  afterEach(PlatformTest.reset);

  describe("getBouncerProof", () => {
    let chain: Chain;

    beforeEach(() => {
      chain = setupMockChain();
    });

    it("throws a 404 when a chain is missing a bouncer file", async () => {
      jest.spyOn(s3Utils, "getObject").mockImplementation();
      await expect(service.getBouncerProof(chain, TEST_ADDR)).rejects.toThrow(
        `${chain.network} does not have requested data`
      );
    });

    it("throws a 404 when a chain is missing an entry for the user in the bouncer file", async () => {
      jest.spyOn(s3Utils, "getObject").mockImplementation(async () => JSON.stringify(MOCK_BOUNCER_FILE));
      await expect(service.getBouncerProof(chain, TOKENS.BADGER)).rejects.toThrow(
        `No data for specified address: ${TOKENS.BADGER}`
      );
    });

    it("returns the user proof for a user on the bouncer list", async () => {
      jest.spyOn(s3Utils, "getObject").mockImplementation(async () => JSON.stringify(MOCK_BOUNCER_FILE));
      const result = await service.getBouncerProof(chain, TEST_ADDR);
      expect(result).toMatchSnapshot();
    });
  });
});
