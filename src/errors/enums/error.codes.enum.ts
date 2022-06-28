export enum ApiErrorCode {
  // Validation Errors
  QueryParamInvalid = 1000,
  InvalidAddress = 1001,
  UnsupportedChain = 1002,

  // Allocation Errors
  NoDataForChain = 2000,
  NoDataForAddress = 2001,
  NoDataForVault = 2002,

  UnknownVault = 2100,

  // Citadel Errors
  NoDataInBouncerList = 9000,
}
