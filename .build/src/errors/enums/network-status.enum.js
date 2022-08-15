"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkStatus = void 0;
var NetworkStatus;
(function (NetworkStatus) {
  // Ok Status
  NetworkStatus[(NetworkStatus["Success"] = 200)] = "Success";
  // client errors
  NetworkStatus[(NetworkStatus["BadRequest"] = 400)] = "BadRequest";
  NetworkStatus[(NetworkStatus["Unauthorized"] = 401)] = "Unauthorized";
  NetworkStatus[(NetworkStatus["Forbidden"] = 403)] = "Forbidden";
  NetworkStatus[(NetworkStatus["NotFound"] = 404)] = "NotFound";
  // server errors
  NetworkStatus[(NetworkStatus["Internal"] = 500)] = "Internal";
  NetworkStatus[(NetworkStatus["Unavailable"] = 503)] = "Unavailable";
  NetworkStatus[(NetworkStatus["Timeout"] = 504)] = "Timeout";
})((NetworkStatus = exports.NetworkStatus || (exports.NetworkStatus = {})));
//# sourceMappingURL=network-status.enum.js.map
