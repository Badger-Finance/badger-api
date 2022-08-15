import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { UniV2, UniV2Interface } from "../UniV2";
export declare class UniV2__factory {
  static readonly abi: (
    | {
        inputs: never[];
        payable: boolean;
        stateMutability: string;
        type: string;
        anonymous?: undefined;
        name?: undefined;
        constant?: undefined;
        outputs?: undefined;
      }
    | {
        anonymous: boolean;
        inputs: {
          indexed: boolean;
          internalType: string;
          name: string;
          type: string;
        }[];
        name: string;
        type: string;
        payable?: undefined;
        stateMutability?: undefined;
        constant?: undefined;
        outputs?: undefined;
      }
    | {
        constant: boolean;
        inputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        name: string;
        outputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        payable: boolean;
        stateMutability: string;
        type: string;
        anonymous?: undefined;
      }
  )[];
  static createInterface(): UniV2Interface;
  static connect(address: string, signerOrProvider: Signer | Provider): UniV2;
}
