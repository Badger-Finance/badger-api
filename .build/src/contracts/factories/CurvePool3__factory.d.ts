import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { CurvePool3, CurvePool3Interface } from "../CurvePool3";
export declare class CurvePool3__factory {
  static readonly abi: (
    | {
        name: string;
        inputs: {
          name: string;
          type: string;
          indexed: boolean;
        }[];
        anonymous: boolean;
        type: string;
        stateMutability?: undefined;
        outputs?: undefined;
      }
    | {
        stateMutability: string;
        type: string;
        inputs: {
          name: string;
          type: string;
        }[];
        outputs: never[];
        name?: undefined;
        anonymous?: undefined;
      }
    | {
        stateMutability: string;
        type: string;
        name?: undefined;
        inputs?: undefined;
        anonymous?: undefined;
        outputs?: undefined;
      }
    | {
        stateMutability: string;
        type: string;
        name: string;
        inputs: {
          name: string;
          type: string;
        }[];
        outputs: {
          name: string;
          type: string;
        }[];
        anonymous?: undefined;
      }
  )[];
  static createInterface(): CurvePool3Interface;
  static connect(address: string, signerOrProvider: Signer | Provider): CurvePool3;
}
