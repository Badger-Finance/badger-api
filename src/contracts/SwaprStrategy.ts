/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface SwaprStrategyInterface extends utils.Interface {
  functions: {
    "stakingContract()": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "stakingContract"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "stakingContract",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "stakingContract",
    data: BytesLike
  ): Result;

  events: {};
}

export interface SwaprStrategy extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SwaprStrategyInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    stakingContract(overrides?: CallOverrides): Promise<[string]>;
  };

  stakingContract(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    stakingContract(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    stakingContract(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    stakingContract(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
