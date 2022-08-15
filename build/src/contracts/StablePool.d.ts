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
export declare namespace IPoolSwapStructs {
  type SwapRequestStruct = {
    kind: BigNumberish;
    tokenIn: string;
    tokenOut: string;
    amount: BigNumberish;
    poolId: BytesLike;
    lastChangeBlock: BigNumberish;
    from: string;
    to: string;
    userData: BytesLike;
  };
  type SwapRequestStructOutput = [number, string, string, BigNumber, string, BigNumber, string, string, string] & {
    kind: number;
    tokenIn: string;
    tokenOut: string;
    amount: BigNumber;
    poolId: string;
    lastChangeBlock: BigNumber;
    from: string;
    to: string;
    userData: string;
  };
}
export interface StablePoolInterface extends utils.Interface {
  contractName: "StablePool";
  functions: {
    "DOMAIN_SEPARATOR()": FunctionFragment;
    "allowance(address,address)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "decimals()": FunctionFragment;
    "decreaseAllowance(address,uint256)": FunctionFragment;
    "disableRecoveryMode()": FunctionFragment;
    "enableRecoveryMode()": FunctionFragment;
    "getActionId(bytes4)": FunctionFragment;
    "getAmplificationParameter()": FunctionFragment;
    "getAuthorizer()": FunctionFragment;
    "getLastInvariant()": FunctionFragment;
    "getOwner()": FunctionFragment;
    "getPausedState()": FunctionFragment;
    "getPoolId()": FunctionFragment;
    "getRate()": FunctionFragment;
    "getScalingFactors()": FunctionFragment;
    "getSwapFeePercentage()": FunctionFragment;
    "getVault()": FunctionFragment;
    "inRecoveryMode()": FunctionFragment;
    "increaseAllowance(address,uint256)": FunctionFragment;
    "name()": FunctionFragment;
    "nonces(address)": FunctionFragment;
    "onExitPool(bytes32,address,address,uint256[],uint256,uint256,bytes)": FunctionFragment;
    "onJoinPool(bytes32,address,address,uint256[],uint256,uint256,bytes)": FunctionFragment;
    "onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256[],uint256,uint256)": FunctionFragment;
    "pause()": FunctionFragment;
    "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)": FunctionFragment;
    "queryExit(bytes32,address,address,uint256[],uint256,uint256,bytes)": FunctionFragment;
    "queryJoin(bytes32,address,address,uint256[],uint256,uint256,bytes)": FunctionFragment;
    "setAssetManagerPoolConfig(address,bytes)": FunctionFragment;
    "setSwapFeePercentage(uint256)": FunctionFragment;
    "startAmplificationParameterUpdate(uint256,uint256)": FunctionFragment;
    "stopAmplificationParameterUpdate()": FunctionFragment;
    "symbol()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transfer(address,uint256)": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "unpause()": FunctionFragment;
  };
  encodeFunctionData(functionFragment: "DOMAIN_SEPARATOR", values?: undefined): string;
  encodeFunctionData(functionFragment: "allowance", values: [string, string]): string;
  encodeFunctionData(functionFragment: "approve", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(functionFragment: "decreaseAllowance", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "disableRecoveryMode", values?: undefined): string;
  encodeFunctionData(functionFragment: "enableRecoveryMode", values?: undefined): string;
  encodeFunctionData(functionFragment: "getActionId", values: [BytesLike]): string;
  encodeFunctionData(functionFragment: "getAmplificationParameter", values?: undefined): string;
  encodeFunctionData(functionFragment: "getAuthorizer", values?: undefined): string;
  encodeFunctionData(functionFragment: "getLastInvariant", values?: undefined): string;
  encodeFunctionData(functionFragment: "getOwner", values?: undefined): string;
  encodeFunctionData(functionFragment: "getPausedState", values?: undefined): string;
  encodeFunctionData(functionFragment: "getPoolId", values?: undefined): string;
  encodeFunctionData(functionFragment: "getRate", values?: undefined): string;
  encodeFunctionData(functionFragment: "getScalingFactors", values?: undefined): string;
  encodeFunctionData(functionFragment: "getSwapFeePercentage", values?: undefined): string;
  encodeFunctionData(functionFragment: "getVault", values?: undefined): string;
  encodeFunctionData(functionFragment: "inRecoveryMode", values?: undefined): string;
  encodeFunctionData(functionFragment: "increaseAllowance", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(functionFragment: "nonces", values: [string]): string;
  encodeFunctionData(
    functionFragment: "onExitPool",
    values: [BytesLike, string, string, BigNumberish[], BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "onJoinPool",
    values: [BytesLike, string, string, BigNumberish[], BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "onSwap",
    values: [IPoolSwapStructs.SwapRequestStruct, BigNumberish[], BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "permit",
    values: [string, string, BigNumberish, BigNumberish, BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "queryExit",
    values: [BytesLike, string, string, BigNumberish[], BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "queryJoin",
    values: [BytesLike, string, string, BigNumberish[], BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "setAssetManagerPoolConfig", values: [string, BytesLike]): string;
  encodeFunctionData(functionFragment: "setSwapFeePercentage", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "startAmplificationParameterUpdate",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "stopAmplificationParameterUpdate", values?: undefined): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
  encodeFunctionData(functionFragment: "transfer", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "transferFrom", values: [string, string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  decodeFunctionResult(functionFragment: "DOMAIN_SEPARATOR", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "decreaseAllowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "disableRecoveryMode", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "enableRecoveryMode", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getActionId", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getAmplificationParameter", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getAuthorizer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getLastInvariant", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getOwner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getPausedState", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getPoolId", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getRate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getScalingFactors", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getSwapFeePercentage", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getVault", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "inRecoveryMode", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "increaseAllowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "nonces", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "onExitPool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "onJoinPool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "onSwap", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "permit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "queryExit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "queryJoin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setAssetManagerPoolConfig", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setSwapFeePercentage", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "startAmplificationParameterUpdate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stopAmplificationParameterUpdate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
  events: {
    "AmpUpdateStarted(uint256,uint256,uint256,uint256)": EventFragment;
    "AmpUpdateStopped(uint256)": EventFragment;
    "Approval(address,address,uint256)": EventFragment;
    "PausedStateChanged(bool)": EventFragment;
    "RecoveryModeStateChanged(bool)": EventFragment;
    "SwapFeePercentageChanged(uint256)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
  };
  getEvent(nameOrSignatureOrTopic: "AmpUpdateStarted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AmpUpdateStopped"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PausedStateChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RecoveryModeStateChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SwapFeePercentageChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
}
export declare type AmpUpdateStartedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, BigNumber],
  {
    startValue: BigNumber;
    endValue: BigNumber;
    startTime: BigNumber;
    endTime: BigNumber;
  }
>;
export declare type AmpUpdateStartedEventFilter = TypedEventFilter<AmpUpdateStartedEvent>;
export declare type AmpUpdateStoppedEvent = TypedEvent<
  [BigNumber],
  {
    currentValue: BigNumber;
  }
>;
export declare type AmpUpdateStoppedEventFilter = TypedEventFilter<AmpUpdateStoppedEvent>;
export declare type ApprovalEvent = TypedEvent<
  [string, string, BigNumber],
  {
    owner: string;
    spender: string;
    value: BigNumber;
  }
>;
export declare type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;
export declare type PausedStateChangedEvent = TypedEvent<
  [boolean],
  {
    paused: boolean;
  }
>;
export declare type PausedStateChangedEventFilter = TypedEventFilter<PausedStateChangedEvent>;
export declare type RecoveryModeStateChangedEvent = TypedEvent<
  [boolean],
  {
    enabled: boolean;
  }
>;
export declare type RecoveryModeStateChangedEventFilter = TypedEventFilter<RecoveryModeStateChangedEvent>;
export declare type SwapFeePercentageChangedEvent = TypedEvent<
  [BigNumber],
  {
    swapFeePercentage: BigNumber;
  }
>;
export declare type SwapFeePercentageChangedEventFilter = TypedEventFilter<SwapFeePercentageChangedEvent>;
export declare type TransferEvent = TypedEvent<
  [string, string, BigNumber],
  {
    from: string;
    to: string;
    value: BigNumber;
  }
>;
export declare type TransferEventFilter = TypedEventFilter<TransferEvent>;
export interface StablePool extends BaseContract {
  contractName: "StablePool";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: StablePoolInterface;
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
    DOMAIN_SEPARATOR(overrides?: CallOverrides): Promise<[string]>;
    allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    balanceOf(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    decimals(overrides?: CallOverrides): Promise<[number]>;
    decreaseAllowance(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    disableRecoveryMode(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    enableRecoveryMode(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    getActionId(selector: BytesLike, overrides?: CallOverrides): Promise<[string]>;
    getAmplificationParameter(overrides?: CallOverrides): Promise<
      [BigNumber, boolean, BigNumber] & {
        value: BigNumber;
        isUpdating: boolean;
        precision: BigNumber;
      }
    >;
    getAuthorizer(overrides?: CallOverrides): Promise<[string]>;
    getLastInvariant(overrides?: CallOverrides): Promise<
      [BigNumber, BigNumber] & {
        lastInvariant: BigNumber;
        lastInvariantAmp: BigNumber;
      }
    >;
    getOwner(overrides?: CallOverrides): Promise<[string]>;
    getPausedState(overrides?: CallOverrides): Promise<
      [boolean, BigNumber, BigNumber] & {
        paused: boolean;
        pauseWindowEndTime: BigNumber;
        bufferPeriodEndTime: BigNumber;
      }
    >;
    getPoolId(overrides?: CallOverrides): Promise<[string]>;
    getRate(overrides?: CallOverrides): Promise<[BigNumber]>;
    getScalingFactors(overrides?: CallOverrides): Promise<[BigNumber[]]>;
    getSwapFeePercentage(overrides?: CallOverrides): Promise<[BigNumber]>;
    getVault(overrides?: CallOverrides): Promise<[string]>;
    inRecoveryMode(overrides?: CallOverrides): Promise<[boolean]>;
    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    name(overrides?: CallOverrides): Promise<[string]>;
    nonces(owner: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    onExitPool(
      poolId: BytesLike,
      sender: string,
      recipient: string,
      balances: BigNumberish[],
      lastChangeBlock: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      userData: BytesLike,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    onJoinPool(
      poolId: BytesLike,
      sender: string,
      recipient: string,
      balances: BigNumberish[],
      lastChangeBlock: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      userData: BytesLike,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    "onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256[],uint256,uint256)"(
      swapRequest: IPoolSwapStructs.SwapRequestStruct,
      balances: BigNumberish[],
      indexIn: BigNumberish,
      indexOut: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    "onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256,uint256)"(
      request: IPoolSwapStructs.SwapRequestStruct,
      balanceTokenIn: BigNumberish,
      balanceTokenOut: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    pause(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    permit(
      owner: string,
      spender: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    queryExit(
      poolId: BytesLike,
      sender: string,
      recipient: string,
      balances: BigNumberish[],
      lastChangeBlock: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      userData: BytesLike,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    queryJoin(
      poolId: BytesLike,
      sender: string,
      recipient: string,
      balances: BigNumberish[],
      lastChangeBlock: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      userData: BytesLike,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    setAssetManagerPoolConfig(
      token: string,
      poolConfig: BytesLike,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    setSwapFeePercentage(
      swapFeePercentage: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    startAmplificationParameterUpdate(
      rawEndValue: BigNumberish,
      endTime: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    stopAmplificationParameterUpdate(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    symbol(overrides?: CallOverrides): Promise<[string]>;
    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;
    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    unpause(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
  };
  DOMAIN_SEPARATOR(overrides?: CallOverrides): Promise<string>;
  allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<BigNumber>;
  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;
  decimals(overrides?: CallOverrides): Promise<number>;
  decreaseAllowance(
    spender: string,
    amount: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  disableRecoveryMode(
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  enableRecoveryMode(
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  getActionId(selector: BytesLike, overrides?: CallOverrides): Promise<string>;
  getAmplificationParameter(overrides?: CallOverrides): Promise<
    [BigNumber, boolean, BigNumber] & {
      value: BigNumber;
      isUpdating: boolean;
      precision: BigNumber;
    }
  >;
  getAuthorizer(overrides?: CallOverrides): Promise<string>;
  getLastInvariant(overrides?: CallOverrides): Promise<
    [BigNumber, BigNumber] & {
      lastInvariant: BigNumber;
      lastInvariantAmp: BigNumber;
    }
  >;
  getOwner(overrides?: CallOverrides): Promise<string>;
  getPausedState(overrides?: CallOverrides): Promise<
    [boolean, BigNumber, BigNumber] & {
      paused: boolean;
      pauseWindowEndTime: BigNumber;
      bufferPeriodEndTime: BigNumber;
    }
  >;
  getPoolId(overrides?: CallOverrides): Promise<string>;
  getRate(overrides?: CallOverrides): Promise<BigNumber>;
  getScalingFactors(overrides?: CallOverrides): Promise<BigNumber[]>;
  getSwapFeePercentage(overrides?: CallOverrides): Promise<BigNumber>;
  getVault(overrides?: CallOverrides): Promise<string>;
  inRecoveryMode(overrides?: CallOverrides): Promise<boolean>;
  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  name(overrides?: CallOverrides): Promise<string>;
  nonces(owner: string, overrides?: CallOverrides): Promise<BigNumber>;
  onExitPool(
    poolId: BytesLike,
    sender: string,
    recipient: string,
    balances: BigNumberish[],
    lastChangeBlock: BigNumberish,
    protocolSwapFeePercentage: BigNumberish,
    userData: BytesLike,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  onJoinPool(
    poolId: BytesLike,
    sender: string,
    recipient: string,
    balances: BigNumberish[],
    lastChangeBlock: BigNumberish,
    protocolSwapFeePercentage: BigNumberish,
    userData: BytesLike,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  "onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256[],uint256,uint256)"(
    swapRequest: IPoolSwapStructs.SwapRequestStruct,
    balances: BigNumberish[],
    indexIn: BigNumberish,
    indexOut: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  "onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256,uint256)"(
    request: IPoolSwapStructs.SwapRequestStruct,
    balanceTokenIn: BigNumberish,
    balanceTokenOut: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  pause(
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  permit(
    owner: string,
    spender: string,
    value: BigNumberish,
    deadline: BigNumberish,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  queryExit(
    poolId: BytesLike,
    sender: string,
    recipient: string,
    balances: BigNumberish[],
    lastChangeBlock: BigNumberish,
    protocolSwapFeePercentage: BigNumberish,
    userData: BytesLike,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  queryJoin(
    poolId: BytesLike,
    sender: string,
    recipient: string,
    balances: BigNumberish[],
    lastChangeBlock: BigNumberish,
    protocolSwapFeePercentage: BigNumberish,
    userData: BytesLike,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  setAssetManagerPoolConfig(
    token: string,
    poolConfig: BytesLike,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  setSwapFeePercentage(
    swapFeePercentage: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  startAmplificationParameterUpdate(
    rawEndValue: BigNumberish,
    endTime: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  stopAmplificationParameterUpdate(
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  symbol(overrides?: CallOverrides): Promise<string>;
  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
  transfer(
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  transferFrom(
    sender: string,
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  unpause(
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  callStatic: {
    DOMAIN_SEPARATOR(overrides?: CallOverrides): Promise<string>;
    allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<BigNumber>;
    approve(spender: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;
    decimals(overrides?: CallOverrides): Promise<number>;
    decreaseAllowance(spender: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
    disableRecoveryMode(overrides?: CallOverrides): Promise<void>;
    enableRecoveryMode(overrides?: CallOverrides): Promise<void>;
    getActionId(selector: BytesLike, overrides?: CallOverrides): Promise<string>;
    getAmplificationParameter(overrides?: CallOverrides): Promise<
      [BigNumber, boolean, BigNumber] & {
        value: BigNumber;
        isUpdating: boolean;
        precision: BigNumber;
      }
    >;
    getAuthorizer(overrides?: CallOverrides): Promise<string>;
    getLastInvariant(overrides?: CallOverrides): Promise<
      [BigNumber, BigNumber] & {
        lastInvariant: BigNumber;
        lastInvariantAmp: BigNumber;
      }
    >;
    getOwner(overrides?: CallOverrides): Promise<string>;
    getPausedState(overrides?: CallOverrides): Promise<
      [boolean, BigNumber, BigNumber] & {
        paused: boolean;
        pauseWindowEndTime: BigNumber;
        bufferPeriodEndTime: BigNumber;
      }
    >;
    getPoolId(overrides?: CallOverrides): Promise<string>;
    getRate(overrides?: CallOverrides): Promise<BigNumber>;
    getScalingFactors(overrides?: CallOverrides): Promise<BigNumber[]>;
    getSwapFeePercentage(overrides?: CallOverrides): Promise<BigNumber>;
    getVault(overrides?: CallOverrides): Promise<string>;
    inRecoveryMode(overrides?: CallOverrides): Promise<boolean>;
    increaseAllowance(spender: string, addedValue: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
    name(overrides?: CallOverrides): Promise<string>;
    nonces(owner: string, overrides?: CallOverrides): Promise<BigNumber>;
    onExitPool(
      poolId: BytesLike,
      sender: string,
      recipient: string,
      balances: BigNumberish[],
      lastChangeBlock: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      userData: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber[], BigNumber[]]>;
    onJoinPool(
      poolId: BytesLike,
      sender: string,
      recipient: string,
      balances: BigNumberish[],
      lastChangeBlock: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      userData: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber[], BigNumber[]]>;
    "onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256[],uint256,uint256)"(
      swapRequest: IPoolSwapStructs.SwapRequestStruct,
      balances: BigNumberish[],
      indexIn: BigNumberish,
      indexOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    "onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256,uint256)"(
      request: IPoolSwapStructs.SwapRequestStruct,
      balanceTokenIn: BigNumberish,
      balanceTokenOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    pause(overrides?: CallOverrides): Promise<void>;
    permit(
      owner: string,
      spender: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
    queryExit(
      poolId: BytesLike,
      sender: string,
      recipient: string,
      balances: BigNumberish[],
      lastChangeBlock: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      userData: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber[]] & {
        bptIn: BigNumber;
        amountsOut: BigNumber[];
      }
    >;
    queryJoin(
      poolId: BytesLike,
      sender: string,
      recipient: string,
      balances: BigNumberish[],
      lastChangeBlock: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      userData: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber[]] & {
        bptOut: BigNumber;
        amountsIn: BigNumber[];
      }
    >;
    setAssetManagerPoolConfig(token: string, poolConfig: BytesLike, overrides?: CallOverrides): Promise<void>;
    setSwapFeePercentage(swapFeePercentage: BigNumberish, overrides?: CallOverrides): Promise<void>;
    startAmplificationParameterUpdate(
      rawEndValue: BigNumberish,
      endTime: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
    stopAmplificationParameterUpdate(overrides?: CallOverrides): Promise<void>;
    symbol(overrides?: CallOverrides): Promise<string>;
    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
    transfer(recipient: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
    transferFrom(sender: string, recipient: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
    unpause(overrides?: CallOverrides): Promise<void>;
  };
  filters: {
    "AmpUpdateStarted(uint256,uint256,uint256,uint256)"(
      startValue?: null,
      endValue?: null,
      startTime?: null,
      endTime?: null
    ): AmpUpdateStartedEventFilter;
    AmpUpdateStarted(startValue?: null, endValue?: null, startTime?: null, endTime?: null): AmpUpdateStartedEventFilter;
    "AmpUpdateStopped(uint256)"(currentValue?: null): AmpUpdateStoppedEventFilter;
    AmpUpdateStopped(currentValue?: null): AmpUpdateStoppedEventFilter;
    "Approval(address,address,uint256)"(
      owner?: string | null,
      spender?: string | null,
      value?: null
    ): ApprovalEventFilter;
    Approval(owner?: string | null, spender?: string | null, value?: null): ApprovalEventFilter;
    "PausedStateChanged(bool)"(paused?: null): PausedStateChangedEventFilter;
    PausedStateChanged(paused?: null): PausedStateChangedEventFilter;
    "RecoveryModeStateChanged(bool)"(enabled?: null): RecoveryModeStateChangedEventFilter;
    RecoveryModeStateChanged(enabled?: null): RecoveryModeStateChangedEventFilter;
    "SwapFeePercentageChanged(uint256)"(swapFeePercentage?: null): SwapFeePercentageChangedEventFilter;
    SwapFeePercentageChanged(swapFeePercentage?: null): SwapFeePercentageChangedEventFilter;
    "Transfer(address,address,uint256)"(from?: string | null, to?: string | null, value?: null): TransferEventFilter;
    Transfer(from?: string | null, to?: string | null, value?: null): TransferEventFilter;
  };
  estimateGas: {
    DOMAIN_SEPARATOR(overrides?: CallOverrides): Promise<BigNumber>;
    allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<BigNumber>;
    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;
    decimals(overrides?: CallOverrides): Promise<BigNumber>;
    decreaseAllowance(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    disableRecoveryMode(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    enableRecoveryMode(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    getActionId(selector: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
    getAmplificationParameter(overrides?: CallOverrides): Promise<BigNumber>;
    getAuthorizer(overrides?: CallOverrides): Promise<BigNumber>;
    getLastInvariant(overrides?: CallOverrides): Promise<BigNumber>;
    getOwner(overrides?: CallOverrides): Promise<BigNumber>;
    getPausedState(overrides?: CallOverrides): Promise<BigNumber>;
    getPoolId(overrides?: CallOverrides): Promise<BigNumber>;
    getRate(overrides?: CallOverrides): Promise<BigNumber>;
    getScalingFactors(overrides?: CallOverrides): Promise<BigNumber>;
    getSwapFeePercentage(overrides?: CallOverrides): Promise<BigNumber>;
    getVault(overrides?: CallOverrides): Promise<BigNumber>;
    inRecoveryMode(overrides?: CallOverrides): Promise<BigNumber>;
    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    name(overrides?: CallOverrides): Promise<BigNumber>;
    nonces(owner: string, overrides?: CallOverrides): Promise<BigNumber>;
    onExitPool(
      poolId: BytesLike,
      sender: string,
      recipient: string,
      balances: BigNumberish[],
      lastChangeBlock: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      userData: BytesLike,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    onJoinPool(
      poolId: BytesLike,
      sender: string,
      recipient: string,
      balances: BigNumberish[],
      lastChangeBlock: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      userData: BytesLike,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    "onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256[],uint256,uint256)"(
      swapRequest: IPoolSwapStructs.SwapRequestStruct,
      balances: BigNumberish[],
      indexIn: BigNumberish,
      indexOut: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    "onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256,uint256)"(
      request: IPoolSwapStructs.SwapRequestStruct,
      balanceTokenIn: BigNumberish,
      balanceTokenOut: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    pause(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    permit(
      owner: string,
      spender: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    queryExit(
      poolId: BytesLike,
      sender: string,
      recipient: string,
      balances: BigNumberish[],
      lastChangeBlock: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      userData: BytesLike,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    queryJoin(
      poolId: BytesLike,
      sender: string,
      recipient: string,
      balances: BigNumberish[],
      lastChangeBlock: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      userData: BytesLike,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    setAssetManagerPoolConfig(
      token: string,
      poolConfig: BytesLike,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    setSwapFeePercentage(
      swapFeePercentage: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    startAmplificationParameterUpdate(
      rawEndValue: BigNumberish,
      endTime: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    stopAmplificationParameterUpdate(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    symbol(overrides?: CallOverrides): Promise<BigNumber>;
    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    unpause(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
  };
  populateTransaction: {
    DOMAIN_SEPARATOR(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    balanceOf(account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    decreaseAllowance(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    disableRecoveryMode(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    enableRecoveryMode(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    getActionId(selector: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getAmplificationParameter(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getAuthorizer(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getLastInvariant(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getPausedState(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getPoolId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getScalingFactors(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getSwapFeePercentage(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getVault(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    inRecoveryMode(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    nonces(owner: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    onExitPool(
      poolId: BytesLike,
      sender: string,
      recipient: string,
      balances: BigNumberish[],
      lastChangeBlock: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      userData: BytesLike,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    onJoinPool(
      poolId: BytesLike,
      sender: string,
      recipient: string,
      balances: BigNumberish[],
      lastChangeBlock: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      userData: BytesLike,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    "onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256[],uint256,uint256)"(
      swapRequest: IPoolSwapStructs.SwapRequestStruct,
      balances: BigNumberish[],
      indexIn: BigNumberish,
      indexOut: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    "onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256,uint256)"(
      request: IPoolSwapStructs.SwapRequestStruct,
      balanceTokenIn: BigNumberish,
      balanceTokenOut: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    pause(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    permit(
      owner: string,
      spender: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    queryExit(
      poolId: BytesLike,
      sender: string,
      recipient: string,
      balances: BigNumberish[],
      lastChangeBlock: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      userData: BytesLike,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    queryJoin(
      poolId: BytesLike,
      sender: string,
      recipient: string,
      balances: BigNumberish[],
      lastChangeBlock: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      userData: BytesLike,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    setAssetManagerPoolConfig(
      token: string,
      poolConfig: BytesLike,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    setSwapFeePercentage(
      swapFeePercentage: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    startAmplificationParameterUpdate(
      rawEndValue: BigNumberish,
      endTime: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    stopAmplificationParameterUpdate(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    unpause(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
  };
}
