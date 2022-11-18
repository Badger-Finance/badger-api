export enum ApiErrorCode {
  // Validation Errors
  QueryParamInvalid = 1000,
  InvalidAddress = 1001,
  UnsupportedChain = 1002,
  OutOfRange = 1003,

  // Allocation Errors
  NoDataForChain = 2000,
  NoDataForAddress = 2001,
  NoDataForVault = 2002,

  UnknownVault = 2100,

  // Access Errors
  AccessDeniedDevModeOnly = 3000,

  // Internal Errors
  InternalError = 4000,
  DdbError = 4001,

  // Citadel Errors
  NoDataInBouncerList = 9000,
}
