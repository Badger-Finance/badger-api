export interface FactoryAPYResonse {
  data: {
    poolDetails: {
      apy: number;
      poolAddress: string;
    }[];
  };
}
