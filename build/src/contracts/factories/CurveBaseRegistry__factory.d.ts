import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { CurveBaseRegistry, CurveBaseRegistryInterface } from "../CurveBaseRegistry";
export declare class CurveBaseRegistry__factory {
  static readonly abi: (
    | {
        name: string;
        inputs: {
          type: string;
          name: string;
          indexed: boolean;
        }[];
        anonymous: boolean;
        type: string;
        outputs?: undefined;
        stateMutability?: undefined;
      }
    | {
        outputs: never[];
        inputs: {
          type: string;
          name: string;
        }[];
        stateMutability: string;
        type: string;
        name?: undefined;
        anonymous?: undefined;
      }
    | {
        name: string;
        outputs: {
          type: string;
          name: string;
        }[];
        inputs: {
          type: string;
          name: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
      }
  )[];
  static createInterface(): CurveBaseRegistryInterface;
  static connect(address: string, signerOrProvider: Signer | Provider): CurveBaseRegistry;
}
