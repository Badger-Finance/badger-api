export declare const vaultsHarvestsSdkMock: {
  [x: string]: {
    data: {
      timestamp: number;
      harvests: {
        timestamp: number;
        block: number;
        amount: {
          type: string;
          hex: string;
        };
        token: string;
      }[];
      treeDistributions: {
        timestamp: number;
        block: number;
        token: string;
        amount: {
          type: string;
          hex: string;
        };
      }[];
    }[];
  };
};
