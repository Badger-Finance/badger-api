"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_utils_1 = require("./config.utils");
const stage_enum_1 = require("./enums/stage.enum");
const tokens_config_1 = require("./tokens.config");
describe("utils", () => {
  const oldNodeEnv = { ...process.env };
  function resetProccessEnv() {
    process.env = { ...oldNodeEnv };
  }
  afterAll(resetProccessEnv);
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(jest.fn);
  });
  describe("checksumEntries", () => {
    describe("given a valid address record with all lowercase addresses", () => {
      it("returns the address record with checksummed addresses", () => {
        const input = Object.fromEntries(Object.entries(tokens_config_1.TOKENS).map((e) => [e[0], e[1].toLowerCase()]));
        const actual = (0, config_utils_1.checksumEntries)(input);
        expect(actual).toEqual(tokens_config_1.TOKENS);
      });
    });
    describe("given an invalid input", () => {
      it("throws an error", () => {
        expect(() => (0, config_utils_1.checksumEntries)({ property: "invalid " })).toThrow();
      });
    });
  });
  describe("getEnvVar", () => {
    describe("in prod ENV", () => {
      it("return value", () => {
        const envVarName = "RPC_NODE";
        process.env.NODE_ENV = stage_enum_1.Stage.Production;
        process.env[envVarName] = "https://some.node.rpc.com";
        expect((0, config_utils_1.getEnvVar)(envVarName)).toBe(process.env[envVarName]);
        resetProccessEnv();
      });
      it("throw error, when no value", () => {
        const envVarName = "RPC_NODE";
        process.env.NODE_ENV = stage_enum_1.Stage.Production;
        expect(() => (0, config_utils_1.getEnvVar)(envVarName)).toThrow(Error);
        resetProccessEnv();
      });
    });
    describe("in Offline/Test ENV", () => {
      it("test return value", () => {
        const envVarName = "RPC_NODE";
        process.env.NODE_ENV = "test";
        process.env[envVarName] = "https://some.node.rpc.com";
        expect((0, config_utils_1.getEnvVar)(envVarName)).toBe(process.env[envVarName]);
        resetProccessEnv();
      });
      it("offline return value", () => {
        const envVarName = "RPC_NODE";
        process.env.IS_OFFLINE = "true";
        process.env[envVarName] = "https://some.node.rpc.com";
        expect((0, config_utils_1.getEnvVar)(envVarName)).toBe(process.env[envVarName]);
        resetProccessEnv();
      });
      it("test return placeholder string", () => {
        const envVarName = "RPC_NODE";
        process.env.NODE_ENV = "test";
        expect((0, config_utils_1.getEnvVar)(envVarName)).toBe("Missing value");
        resetProccessEnv();
      });
      it("offlline return placeholder string", () => {
        const envVarName = "RPC_NODE";
        process.env.IS_OFFLINE = "true";
        expect((0, config_utils_1.getEnvVar)(envVarName)).toBe("Missing value");
        resetProccessEnv();
      });
    });
  });
});
//# sourceMappingURL=config.utils.spec.js.map
