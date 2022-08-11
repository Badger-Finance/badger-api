export enum NetworkStatus {
  // Ok Status
  Success = 200,
  // client errors
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  // server errors
  Internal = 500,
  Unavailable = 503,
  Timeout = 504,
}
