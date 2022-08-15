"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
async function request(baseURL, params) {
  try {
    const { data } = await axios_1.default.get(baseURL, { params });
    return data;
  } catch (error) {
    throw error;
  }
}
exports.request = request;
//# sourceMappingURL=request.js.map
