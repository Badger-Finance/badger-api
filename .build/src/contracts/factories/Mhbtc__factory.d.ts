import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { Mhbtc, MhbtcInterface } from "../Mhbtc";
export declare class Mhbtc__factory {
  static readonly abi: (
    | {
        inputs: {
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
        stateMutability: string;
        type: string;
        anonymous?: undefined;
      }
    | {
        inputs: never[];
        name: string;
        outputs: (
          | {
              internalType: string;
              name: string;
              type: string;
              components?: undefined;
            }
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
        )[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
      }
    | {
        inputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        name: string;
        outputs: {
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
      }
    | {
        inputs: never[];
        name: string;
        outputs: {
          components: (
            | {
                internalType: string;
                name: string;
                type: string;
                components?: undefined;
              }
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
          )[];
          internalType: string;
          name: string;
          type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
      }
    | {
        inputs: (
          | {
              internalType: string;
              name: string;
              type: string;
              components?: undefined;
            }
          | {
              components: (
                | {
                    internalType: string;
                    name: string;
                    type: string;
                    components?: undefined;
                  }
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
              )[];
              internalType: string;
              name: string;
              type: string;
            }
        )[];
        name: string;
        outputs: never[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
      }
  )[];
  static createInterface(): MhbtcInterface;
  static connect(address: string, signerOrProvider: Signer | Provider): Mhbtc;
}
