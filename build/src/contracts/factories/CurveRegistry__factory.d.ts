import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { CurveRegistry, CurveRegistryInterface } from "../CurveRegistry";
export declare class CurveRegistry__factory {
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
  static createInterface(): CurveRegistryInterface;
  static connect(address: string, signerOrProvider: Signer | Provider): CurveRegistry;
}
