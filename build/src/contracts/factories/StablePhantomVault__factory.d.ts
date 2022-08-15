import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { StablePhantomVault, StablePhantomVaultInterface } from "../StablePhantomVault";
export declare class StablePhantomVault__factory {
  static readonly abi: (
    | {
        inputs: {
          components: {
            internalType: string;
            name: string;
            type: string;
          }[];
          internalType: string;
          name: string;
          type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
        name?: undefined;
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
        stateMutability?: undefined;
        outputs?: undefined;
      }
    | {
        inputs: (
          | {
              components: {
                internalType: string;
                name: string;
                type: string;
              }[];
              internalType: string;
              name: string;
              type: string;
            }
          | {
              internalType: string;
              name: string;
              type: string;
              components?: undefined;
            }
        )[];
        name: string;
        outputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
      }
  )[];
  static createInterface(): StablePhantomVaultInterface;
  static connect(address: string, signerOrProvider: Signer | Provider): StablePhantomVault;
}
