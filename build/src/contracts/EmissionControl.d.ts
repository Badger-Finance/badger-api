import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export interface EmissionControlInterface extends utils.Interface {
  contractName: "EmissionControl";
  functions: {
    "MAX_BPS()": FunctionFragment;
    "addManager(address)": FunctionFragment;
    "boostedEmissionRate(address)": FunctionFragment;
    "manager(address)": FunctionFragment;
    "owner()": FunctionFragment;
    "proRataEmissionRate(address)": FunctionFragment;
    "removeManager(address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setBoostedEmission(address,uint256)": FunctionFragment;
    "setTokenWeight(address,uint256)": FunctionFragment;
    "tokenWeight(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };
  encodeFunctionData(functionFragment: "MAX_BPS", values?: undefined): string;
  encodeFunctionData(functionFragment: "addManager", values: [string]): string;
  encodeFunctionData(functionFragment: "boostedEmissionRate", values: [string]): string;
  encodeFunctionData(functionFragment: "manager", values: [string]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "proRataEmissionRate", values: [string]): string;
  encodeFunctionData(functionFragment: "removeManager", values: [string]): string;
  encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
  encodeFunctionData(functionFragment: "setBoostedEmission", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "setTokenWeight", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "tokenWeight", values: [string]): string;
  encodeFunctionData(functionFragment: "transferOwnership", values: [string]): string;
  decodeFunctionResult(functionFragment: "MAX_BPS", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "addManager", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "boostedEmissionRate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "manager", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "proRataEmissionRate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "removeManager", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setBoostedEmission", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setTokenWeight", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenWeight", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "TokenBoostedEmissionChanged(address,uint256)": EventFragment;
    "TokenWeightChanged(address,uint256)": EventFragment;
  };
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokenBoostedEmissionChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokenWeightChanged"): EventFragment;
}
export declare type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  {
    previousOwner: string;
    newOwner: string;
  }
>;
export declare type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export declare type TokenBoostedEmissionChangedEvent = TypedEvent<
  [string, BigNumber],
  {
    _vault: string;
    _weight: BigNumber;
  }
>;
export declare type TokenBoostedEmissionChangedEventFilter = TypedEventFilter<TokenBoostedEmissionChangedEvent>;
export declare type TokenWeightChangedEvent = TypedEvent<
  [string, BigNumber],
  {
    _token: string;
    _weight: BigNumber;
  }
>;
export declare type TokenWeightChangedEventFilter = TypedEventFilter<TokenWeightChangedEvent>;
export interface EmissionControl extends BaseContract {
  contractName: "EmissionControl";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: EmissionControlInterface;
  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;
  listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;
  functions: {
    MAX_BPS(overrides?: CallOverrides): Promise<[BigNumber]>;
    addManager(
      _manager: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    boostedEmissionRate(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    manager(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;
    owner(overrides?: CallOverrides): Promise<[string]>;
    proRataEmissionRate(_vault: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    removeManager(
      _manager: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    renounceOwnership(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    setBoostedEmission(
      _vault: string,
      _weight: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    setTokenWeight(
      _token: string,
      _weight: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    tokenWeight(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    transferOwnership(
      newOwner: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
  };
  MAX_BPS(overrides?: CallOverrides): Promise<BigNumber>;
  addManager(
    _manager: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  boostedEmissionRate(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
  manager(arg0: string, overrides?: CallOverrides): Promise<boolean>;
  owner(overrides?: CallOverrides): Promise<string>;
  proRataEmissionRate(_vault: string, overrides?: CallOverrides): Promise<BigNumber>;
  removeManager(
    _manager: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  renounceOwnership(
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  setBoostedEmission(
    _vault: string,
    _weight: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  setTokenWeight(
    _token: string,
    _weight: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  tokenWeight(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
  transferOwnership(
    newOwner: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  callStatic: {
    MAX_BPS(overrides?: CallOverrides): Promise<BigNumber>;
    addManager(_manager: string, overrides?: CallOverrides): Promise<void>;
    boostedEmissionRate(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    manager(arg0: string, overrides?: CallOverrides): Promise<boolean>;
    owner(overrides?: CallOverrides): Promise<string>;
    proRataEmissionRate(_vault: string, overrides?: CallOverrides): Promise<BigNumber>;
    removeManager(_manager: string, overrides?: CallOverrides): Promise<void>;
    renounceOwnership(overrides?: CallOverrides): Promise<void>;
    setBoostedEmission(_vault: string, _weight: BigNumberish, overrides?: CallOverrides): Promise<void>;
    setTokenWeight(_token: string, _weight: BigNumberish, overrides?: CallOverrides): Promise<void>;
    tokenWeight(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    transferOwnership(newOwner: string, overrides?: CallOverrides): Promise<void>;
  };
  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): OwnershipTransferredEventFilter;
    "TokenBoostedEmissionChanged(address,uint256)"(
      _vault?: string | null,
      _weight?: BigNumberish | null
    ): TokenBoostedEmissionChangedEventFilter;
    TokenBoostedEmissionChanged(
      _vault?: string | null,
      _weight?: BigNumberish | null
    ): TokenBoostedEmissionChangedEventFilter;
    "TokenWeightChanged(address,uint256)"(
      _token?: string | null,
      _weight?: BigNumberish | null
    ): TokenWeightChangedEventFilter;
    TokenWeightChanged(_token?: string | null, _weight?: BigNumberish | null): TokenWeightChangedEventFilter;
  };
  estimateGas: {
    MAX_BPS(overrides?: CallOverrides): Promise<BigNumber>;
    addManager(
      _manager: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    boostedEmissionRate(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    manager(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    owner(overrides?: CallOverrides): Promise<BigNumber>;
    proRataEmissionRate(_vault: string, overrides?: CallOverrides): Promise<BigNumber>;
    removeManager(
      _manager: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    renounceOwnership(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    setBoostedEmission(
      _vault: string,
      _weight: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    setTokenWeight(
      _token: string,
      _weight: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    tokenWeight(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    transferOwnership(
      newOwner: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
  };
  populateTransaction: {
    MAX_BPS(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    addManager(
      _manager: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    boostedEmissionRate(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    manager(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    proRataEmissionRate(_vault: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    removeManager(
      _manager: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    renounceOwnership(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    setBoostedEmission(
      _vault: string,
      _weight: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    setTokenWeight(
      _token: string,
      _weight: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    tokenWeight(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    transferOwnership(
      newOwner: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
  };
}
