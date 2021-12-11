export interface BlocknativeGasResponse {
  blockPrices: {
    estimatedPrices: {
      maxPriorityFeePerGas: number;
      maxFeePerGas: number;
    }[];
  }[];
}
