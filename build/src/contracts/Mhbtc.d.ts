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
export declare type AmpDataStruct = {
  initialA: BigNumberish;
  targetA: BigNumberish;
  rampStartTime: BigNumberish;
  rampEndTime: BigNumberish;
};
export declare type AmpDataStructOutput = [BigNumber, BigNumber, BigNumber, BigNumber] & {
  initialA: BigNumber;
  targetA: BigNumber;
  rampStartTime: BigNumber;
  rampEndTime: BigNumber;
};
export declare type WeightLimitsStruct = {
  min: BigNumberish;
  max: BigNumberish;
};
export declare type WeightLimitsStructOutput = [BigNumber, BigNumber] & {
  min: BigNumber;
  max: BigNumber;
};
export declare type BassetPersonalStruct = {
  addr: string;
  integrator: string;
  hasTxFee: boolean;
  status: BigNumberish;
};
export declare type BassetPersonalStructOutput = [string, string, boolean, number] & {
  addr: string;
  integrator: string;
  hasTxFee: boolean;
  status: number;
};
export declare type BassetDataStruct = {
  ratio: BigNumberish;
  vaultBalance: BigNumberish;
};
export declare type BassetDataStructOutput = [BigNumber, BigNumber] & {
  ratio: BigNumber;
  vaultBalance: BigNumber;
};
export declare type FeederConfigStruct = {
  supply: BigNumberish;
  a: BigNumberish;
  limits: WeightLimitsStruct;
};
export declare type FeederConfigStructOutput = [BigNumber, BigNumber, WeightLimitsStructOutput] & {
  supply: BigNumber;
  a: BigNumber;
  limits: WeightLimitsStructOutput;
};
export declare type InvariantConfigStruct = {
  a: BigNumberish;
  limits: WeightLimitsStruct;
};
export declare type InvariantConfigStructOutput = [BigNumber, WeightLimitsStructOutput] & {
  a: BigNumber;
  limits: WeightLimitsStructOutput;
};
export interface MhbtcInterface extends utils.Interface {
  contractName: "Mhbtc";
  functions: {
    "allowance(address,address)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "collectPendingFees()": FunctionFragment;
    "collectPlatformInterest()": FunctionFragment;
    "data()": FunctionFragment;
    "decimals()": FunctionFragment;
    "decreaseAllowance(address,uint256)": FunctionFragment;
    "getBasset(address)": FunctionFragment;
    "getBassets()": FunctionFragment;
    "getConfig()": FunctionFragment;
    "getMintMultiOutput(address[],uint256[])": FunctionFragment;
    "getMintOutput(address,uint256)": FunctionFragment;
    "getPrice()": FunctionFragment;
    "getRedeemExactBassetsOutput(address[],uint256[])": FunctionFragment;
    "getRedeemOutput(address,uint256)": FunctionFragment;
    "getSwapOutput(address,address,uint256)": FunctionFragment;
    "increaseAllowance(address,uint256)": FunctionFragment;
    "initialize(string,string,(address,address,bool,uint8),(address,address,bool,uint8),address[],(uint256,(uint128,uint128)))": FunctionFragment;
    "mAsset()": FunctionFragment;
    "migrateBassets(address[],address)": FunctionFragment;
    "mint(address,uint256,uint256,address)": FunctionFragment;
    "mintMulti(address[],uint256[],uint256,address)": FunctionFragment;
    "name()": FunctionFragment;
    "nexus()": FunctionFragment;
    "pause()": FunctionFragment;
    "paused()": FunctionFragment;
    "redeem(address,uint256,uint256,address)": FunctionFragment;
    "redeemExactBassets(address[],uint256[],uint256,address)": FunctionFragment;
    "redeemProportionately(uint256,uint256[],address)": FunctionFragment;
    "setCacheSize(uint256)": FunctionFragment;
    "setFees(uint256,uint256,uint256)": FunctionFragment;
    "setWeightLimits(uint128,uint128)": FunctionFragment;
    "startRampA(uint256,uint256)": FunctionFragment;
    "stopRampA()": FunctionFragment;
    "swap(address,address,uint256,uint256,address)": FunctionFragment;
    "symbol()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transfer(address,uint256)": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "unpause()": FunctionFragment;
  };
  encodeFunctionData(functionFragment: "allowance", values: [string, string]): string;
  encodeFunctionData(functionFragment: "approve", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(functionFragment: "collectPendingFees", values?: undefined): string;
  encodeFunctionData(functionFragment: "collectPlatformInterest", values?: undefined): string;
  encodeFunctionData(functionFragment: "data", values?: undefined): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(functionFragment: "decreaseAllowance", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "getBasset", values: [string]): string;
  encodeFunctionData(functionFragment: "getBassets", values?: undefined): string;
  encodeFunctionData(functionFragment: "getConfig", values?: undefined): string;
  encodeFunctionData(functionFragment: "getMintMultiOutput", values: [string[], BigNumberish[]]): string;
  encodeFunctionData(functionFragment: "getMintOutput", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "getPrice", values?: undefined): string;
  encodeFunctionData(functionFragment: "getRedeemExactBassetsOutput", values: [string[], BigNumberish[]]): string;
  encodeFunctionData(functionFragment: "getRedeemOutput", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "getSwapOutput", values: [string, string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "increaseAllowance", values: [string, BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string, BassetPersonalStruct, BassetPersonalStruct, string[], InvariantConfigStruct]
  ): string;
  encodeFunctionData(functionFragment: "mAsset", values?: undefined): string;
  encodeFunctionData(functionFragment: "migrateBassets", values: [string[], string]): string;
  encodeFunctionData(functionFragment: "mint", values: [string, BigNumberish, BigNumberish, string]): string;
  encodeFunctionData(functionFragment: "mintMulti", values: [string[], BigNumberish[], BigNumberish, string]): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(functionFragment: "nexus", values?: undefined): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(functionFragment: "redeem", values: [string, BigNumberish, BigNumberish, string]): string;
  encodeFunctionData(
    functionFragment: "redeemExactBassets",
    values: [string[], BigNumberish[], BigNumberish, string]
  ): string;
  encodeFunctionData(functionFragment: "redeemProportionately", values: [BigNumberish, BigNumberish[], string]): string;
  encodeFunctionData(functionFragment: "setCacheSize", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "setFees", values: [BigNumberish, BigNumberish, BigNumberish]): string;
  encodeFunctionData(functionFragment: "setWeightLimits", values: [BigNumberish, BigNumberish]): string;
  encodeFunctionData(functionFragment: "startRampA", values: [BigNumberish, BigNumberish]): string;
  encodeFunctionData(functionFragment: "stopRampA", values?: undefined): string;
  encodeFunctionData(functionFragment: "swap", values: [string, string, BigNumberish, BigNumberish, string]): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
  encodeFunctionData(functionFragment: "transfer", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "transferFrom", values: [string, string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "collectPendingFees", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "collectPlatformInterest", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "data", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "decreaseAllowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getBasset", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getBassets", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getConfig", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getMintMultiOutput", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getMintOutput", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getPrice", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getRedeemExactBassetsOutput", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getRedeemOutput", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getSwapOutput", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "increaseAllowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mAsset", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "migrateBassets", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mintMulti", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "nexus", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeem", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeemExactBassets", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeemProportionately", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setCacheSize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setFees", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setWeightLimits", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "startRampA", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stopRampA", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "swap", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
  events: {
    "Approval(address,address,uint256)": EventFragment;
    "BassetsMigrated(address[],address)": EventFragment;
    "CacheSizeChanged(uint256)": EventFragment;
    "FeesChanged(uint256,uint256,uint256)": EventFragment;
    "Minted(address,address,uint256,address,uint256)": EventFragment;
    "MintedMulti(address,address,uint256,address[],uint256[])": EventFragment;
    "Paused(address)": EventFragment;
    "Redeemed(address,address,uint256,address,uint256,uint256)": EventFragment;
    "RedeemedMulti(address,address,uint256,address[],uint256[],uint256)": EventFragment;
    "StartRampA(uint256,uint256,uint256,uint256)": EventFragment;
    "StopRampA(uint256,uint256)": EventFragment;
    "Swapped(address,address,address,uint256,uint256,address)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
    "Unpaused(address)": EventFragment;
    "WeightLimitsChanged(uint128,uint128)": EventFragment;
  };
  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "BassetsMigrated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CacheSizeChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FeesChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Minted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MintedMulti"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Redeemed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RedeemedMulti"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StartRampA"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StopRampA"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Swapped"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpaused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WeightLimitsChanged"): EventFragment;
}
export declare type ApprovalEvent = TypedEvent<
  [string, string, BigNumber],
  {
    owner: string;
    spender: string;
    value: BigNumber;
  }
>;
export declare type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;
export declare type BassetsMigratedEvent = TypedEvent<
  [string[], string],
  {
    bAssets: string[];
    newIntegrator: string;
  }
>;
export declare type BassetsMigratedEventFilter = TypedEventFilter<BassetsMigratedEvent>;
export declare type CacheSizeChangedEvent = TypedEvent<
  [BigNumber],
  {
    cacheSize: BigNumber;
  }
>;
export declare type CacheSizeChangedEventFilter = TypedEventFilter<CacheSizeChangedEvent>;
export declare type FeesChangedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber],
  {
    swapFee: BigNumber;
    redemptionFee: BigNumber;
    govFee: BigNumber;
  }
>;
export declare type FeesChangedEventFilter = TypedEventFilter<FeesChangedEvent>;
export declare type MintedEvent = TypedEvent<
  [string, string, BigNumber, string, BigNumber],
  {
    minter: string;
    recipient: string;
    output: BigNumber;
    input: string;
    inputQuantity: BigNumber;
  }
>;
export declare type MintedEventFilter = TypedEventFilter<MintedEvent>;
export declare type MintedMultiEvent = TypedEvent<
  [string, string, BigNumber, string[], BigNumber[]],
  {
    minter: string;
    recipient: string;
    output: BigNumber;
    inputs: string[];
    inputQuantities: BigNumber[];
  }
>;
export declare type MintedMultiEventFilter = TypedEventFilter<MintedMultiEvent>;
export declare type PausedEvent = TypedEvent<
  [string],
  {
    account: string;
  }
>;
export declare type PausedEventFilter = TypedEventFilter<PausedEvent>;
export declare type RedeemedEvent = TypedEvent<
  [string, string, BigNumber, string, BigNumber, BigNumber],
  {
    redeemer: string;
    recipient: string;
    mAssetQuantity: BigNumber;
    output: string;
    outputQuantity: BigNumber;
    scaledFee: BigNumber;
  }
>;
export declare type RedeemedEventFilter = TypedEventFilter<RedeemedEvent>;
export declare type RedeemedMultiEvent = TypedEvent<
  [string, string, BigNumber, string[], BigNumber[], BigNumber],
  {
    redeemer: string;
    recipient: string;
    mAssetQuantity: BigNumber;
    outputs: string[];
    outputQuantity: BigNumber[];
    scaledFee: BigNumber;
  }
>;
export declare type RedeemedMultiEventFilter = TypedEventFilter<RedeemedMultiEvent>;
export declare type StartRampAEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, BigNumber],
  {
    currentA: BigNumber;
    targetA: BigNumber;
    startTime: BigNumber;
    rampEndTime: BigNumber;
  }
>;
export declare type StartRampAEventFilter = TypedEventFilter<StartRampAEvent>;
export declare type StopRampAEvent = TypedEvent<
  [BigNumber, BigNumber],
  {
    currentA: BigNumber;
    time: BigNumber;
  }
>;
export declare type StopRampAEventFilter = TypedEventFilter<StopRampAEvent>;
export declare type SwappedEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber, string],
  {
    swapper: string;
    input: string;
    output: string;
    outputAmount: BigNumber;
    fee: BigNumber;
    recipient: string;
  }
>;
export declare type SwappedEventFilter = TypedEventFilter<SwappedEvent>;
export declare type TransferEvent = TypedEvent<
  [string, string, BigNumber],
  {
    from: string;
    to: string;
    value: BigNumber;
  }
>;
export declare type TransferEventFilter = TypedEventFilter<TransferEvent>;
export declare type UnpausedEvent = TypedEvent<
  [string],
  {
    account: string;
  }
>;
export declare type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;
export declare type WeightLimitsChangedEvent = TypedEvent<
  [BigNumber, BigNumber],
  {
    min: BigNumber;
    max: BigNumber;
  }
>;
export declare type WeightLimitsChangedEventFilter = TypedEventFilter<WeightLimitsChangedEvent>;
export interface Mhbtc extends BaseContract {
  contractName: "Mhbtc";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: MhbtcInterface;
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
    allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    balanceOf(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    collectPendingFees(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    collectPlatformInterest(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    data(overrides?: CallOverrides): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, AmpDataStructOutput, WeightLimitsStructOutput] & {
        swapFee: BigNumber;
        redemptionFee: BigNumber;
        govFee: BigNumber;
        pendingFees: BigNumber;
        cacheSize: BigNumber;
        ampData: AmpDataStructOutput;
        weightLimits: WeightLimitsStructOutput;
      }
    >;
    decimals(overrides?: CallOverrides): Promise<[number]>;
    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    getBasset(
      _bAsset: string,
      overrides?: CallOverrides
    ): Promise<
      [BassetPersonalStructOutput, BassetDataStructOutput] & {
        personal: BassetPersonalStructOutput;
        vaultData: BassetDataStructOutput;
      }
    >;
    getBassets(overrides?: CallOverrides): Promise<
      [BassetPersonalStructOutput[], BassetDataStructOutput[]] & {
        vaultData: BassetDataStructOutput[];
      }
    >;
    getConfig(overrides?: CallOverrides): Promise<
      [FeederConfigStructOutput] & {
        config: FeederConfigStructOutput;
      }
    >;
    getMintMultiOutput(
      _inputs: string[],
      _inputQuantities: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<
      [BigNumber] & {
        mintOutput: BigNumber;
      }
    >;
    getMintOutput(
      _input: string,
      _inputQuantity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber] & {
        mintOutput: BigNumber;
      }
    >;
    getPrice(overrides?: CallOverrides): Promise<
      [BigNumber, BigNumber] & {
        price: BigNumber;
        k: BigNumber;
      }
    >;
    getRedeemExactBassetsOutput(
      _outputs: string[],
      _outputQuantities: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<
      [BigNumber] & {
        fpTokenQuantity: BigNumber;
      }
    >;
    getRedeemOutput(
      _output: string,
      _fpTokenQuantity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber] & {
        bAssetOutput: BigNumber;
      }
    >;
    getSwapOutput(
      _input: string,
      _output: string,
      _inputQuantity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber] & {
        swapOutput: BigNumber;
      }
    >;
    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    initialize(
      _nameArg: string,
      _symbolArg: string,
      _mAsset: BassetPersonalStruct,
      _fAsset: BassetPersonalStruct,
      _mpAssets: string[],
      _config: InvariantConfigStruct,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    mAsset(overrides?: CallOverrides): Promise<[string]>;
    migrateBassets(
      _bAssets: string[],
      _newIntegration: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    mint(
      _input: string,
      _inputQuantity: BigNumberish,
      _minOutputQuantity: BigNumberish,
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    mintMulti(
      _inputs: string[],
      _inputQuantities: BigNumberish[],
      _minOutputQuantity: BigNumberish,
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    name(overrides?: CallOverrides): Promise<[string]>;
    nexus(overrides?: CallOverrides): Promise<[string]>;
    pause(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    paused(overrides?: CallOverrides): Promise<[boolean]>;
    redeem(
      _output: string,
      _fpTokenQuantity: BigNumberish,
      _minOutputQuantity: BigNumberish,
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    redeemExactBassets(
      _outputs: string[],
      _outputQuantities: BigNumberish[],
      _maxInputQuantity: BigNumberish,
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    redeemProportionately(
      _inputQuantity: BigNumberish,
      _minOutputQuantities: BigNumberish[],
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    setCacheSize(
      _cacheSize: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    setFees(
      _swapFee: BigNumberish,
      _redemptionFee: BigNumberish,
      _govFee: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    setWeightLimits(
      _min: BigNumberish,
      _max: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    startRampA(
      _targetA: BigNumberish,
      _rampEndTime: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    stopRampA(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    swap(
      _input: string,
      _output: string,
      _inputQuantity: BigNumberish,
      _minOutputQuantity: BigNumberish,
      _recipient: string,
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
  allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<BigNumber>;
  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;
  collectPendingFees(
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  collectPlatformInterest(
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  data(overrides?: CallOverrides): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, AmpDataStructOutput, WeightLimitsStructOutput] & {
      swapFee: BigNumber;
      redemptionFee: BigNumber;
      govFee: BigNumber;
      pendingFees: BigNumber;
      cacheSize: BigNumber;
      ampData: AmpDataStructOutput;
      weightLimits: WeightLimitsStructOutput;
    }
  >;
  decimals(overrides?: CallOverrides): Promise<number>;
  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  getBasset(
    _bAsset: string,
    overrides?: CallOverrides
  ): Promise<
    [BassetPersonalStructOutput, BassetDataStructOutput] & {
      personal: BassetPersonalStructOutput;
      vaultData: BassetDataStructOutput;
    }
  >;
  getBassets(overrides?: CallOverrides): Promise<
    [BassetPersonalStructOutput[], BassetDataStructOutput[]] & {
      vaultData: BassetDataStructOutput[];
    }
  >;
  getConfig(overrides?: CallOverrides): Promise<FeederConfigStructOutput>;
  getMintMultiOutput(
    _inputs: string[],
    _inputQuantities: BigNumberish[],
    overrides?: CallOverrides
  ): Promise<BigNumber>;
  getMintOutput(_input: string, _inputQuantity: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
  getPrice(overrides?: CallOverrides): Promise<
    [BigNumber, BigNumber] & {
      price: BigNumber;
      k: BigNumber;
    }
  >;
  getRedeemExactBassetsOutput(
    _outputs: string[],
    _outputQuantities: BigNumberish[],
    overrides?: CallOverrides
  ): Promise<BigNumber>;
  getRedeemOutput(_output: string, _fpTokenQuantity: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
  getSwapOutput(
    _input: string,
    _output: string,
    _inputQuantity: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;
  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  initialize(
    _nameArg: string,
    _symbolArg: string,
    _mAsset: BassetPersonalStruct,
    _fAsset: BassetPersonalStruct,
    _mpAssets: string[],
    _config: InvariantConfigStruct,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  mAsset(overrides?: CallOverrides): Promise<string>;
  migrateBassets(
    _bAssets: string[],
    _newIntegration: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  mint(
    _input: string,
    _inputQuantity: BigNumberish,
    _minOutputQuantity: BigNumberish,
    _recipient: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  mintMulti(
    _inputs: string[],
    _inputQuantities: BigNumberish[],
    _minOutputQuantity: BigNumberish,
    _recipient: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  name(overrides?: CallOverrides): Promise<string>;
  nexus(overrides?: CallOverrides): Promise<string>;
  pause(
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  paused(overrides?: CallOverrides): Promise<boolean>;
  redeem(
    _output: string,
    _fpTokenQuantity: BigNumberish,
    _minOutputQuantity: BigNumberish,
    _recipient: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  redeemExactBassets(
    _outputs: string[],
    _outputQuantities: BigNumberish[],
    _maxInputQuantity: BigNumberish,
    _recipient: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  redeemProportionately(
    _inputQuantity: BigNumberish,
    _minOutputQuantities: BigNumberish[],
    _recipient: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  setCacheSize(
    _cacheSize: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  setFees(
    _swapFee: BigNumberish,
    _redemptionFee: BigNumberish,
    _govFee: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  setWeightLimits(
    _min: BigNumberish,
    _max: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  startRampA(
    _targetA: BigNumberish,
    _rampEndTime: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  stopRampA(
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  swap(
    _input: string,
    _output: string,
    _inputQuantity: BigNumberish,
    _minOutputQuantity: BigNumberish,
    _recipient: string,
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
    allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<BigNumber>;
    approve(spender: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;
    collectPendingFees(overrides?: CallOverrides): Promise<void>;
    collectPlatformInterest(overrides?: CallOverrides): Promise<
      [BigNumber, BigNumber] & {
        mintAmount: BigNumber;
        newSupply: BigNumber;
      }
    >;
    data(overrides?: CallOverrides): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, AmpDataStructOutput, WeightLimitsStructOutput] & {
        swapFee: BigNumber;
        redemptionFee: BigNumber;
        govFee: BigNumber;
        pendingFees: BigNumber;
        cacheSize: BigNumber;
        ampData: AmpDataStructOutput;
        weightLimits: WeightLimitsStructOutput;
      }
    >;
    decimals(overrides?: CallOverrides): Promise<number>;
    decreaseAllowance(spender: string, subtractedValue: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
    getBasset(
      _bAsset: string,
      overrides?: CallOverrides
    ): Promise<
      [BassetPersonalStructOutput, BassetDataStructOutput] & {
        personal: BassetPersonalStructOutput;
        vaultData: BassetDataStructOutput;
      }
    >;
    getBassets(overrides?: CallOverrides): Promise<
      [BassetPersonalStructOutput[], BassetDataStructOutput[]] & {
        vaultData: BassetDataStructOutput[];
      }
    >;
    getConfig(overrides?: CallOverrides): Promise<FeederConfigStructOutput>;
    getMintMultiOutput(
      _inputs: string[],
      _inputQuantities: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    getMintOutput(_input: string, _inputQuantity: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    getPrice(overrides?: CallOverrides): Promise<
      [BigNumber, BigNumber] & {
        price: BigNumber;
        k: BigNumber;
      }
    >;
    getRedeemExactBassetsOutput(
      _outputs: string[],
      _outputQuantities: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    getRedeemOutput(_output: string, _fpTokenQuantity: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    getSwapOutput(
      _input: string,
      _output: string,
      _inputQuantity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    increaseAllowance(spender: string, addedValue: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
    initialize(
      _nameArg: string,
      _symbolArg: string,
      _mAsset: BassetPersonalStruct,
      _fAsset: BassetPersonalStruct,
      _mpAssets: string[],
      _config: InvariantConfigStruct,
      overrides?: CallOverrides
    ): Promise<void>;
    mAsset(overrides?: CallOverrides): Promise<string>;
    migrateBassets(_bAssets: string[], _newIntegration: string, overrides?: CallOverrides): Promise<void>;
    mint(
      _input: string,
      _inputQuantity: BigNumberish,
      _minOutputQuantity: BigNumberish,
      _recipient: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    mintMulti(
      _inputs: string[],
      _inputQuantities: BigNumberish[],
      _minOutputQuantity: BigNumberish,
      _recipient: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    name(overrides?: CallOverrides): Promise<string>;
    nexus(overrides?: CallOverrides): Promise<string>;
    pause(overrides?: CallOverrides): Promise<void>;
    paused(overrides?: CallOverrides): Promise<boolean>;
    redeem(
      _output: string,
      _fpTokenQuantity: BigNumberish,
      _minOutputQuantity: BigNumberish,
      _recipient: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    redeemExactBassets(
      _outputs: string[],
      _outputQuantities: BigNumberish[],
      _maxInputQuantity: BigNumberish,
      _recipient: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    redeemProportionately(
      _inputQuantity: BigNumberish,
      _minOutputQuantities: BigNumberish[],
      _recipient: string,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;
    setCacheSize(_cacheSize: BigNumberish, overrides?: CallOverrides): Promise<void>;
    setFees(
      _swapFee: BigNumberish,
      _redemptionFee: BigNumberish,
      _govFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
    setWeightLimits(_min: BigNumberish, _max: BigNumberish, overrides?: CallOverrides): Promise<void>;
    startRampA(_targetA: BigNumberish, _rampEndTime: BigNumberish, overrides?: CallOverrides): Promise<void>;
    stopRampA(overrides?: CallOverrides): Promise<void>;
    swap(
      _input: string,
      _output: string,
      _inputQuantity: BigNumberish,
      _minOutputQuantity: BigNumberish,
      _recipient: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    symbol(overrides?: CallOverrides): Promise<string>;
    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
    transfer(recipient: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
    transferFrom(sender: string, recipient: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
    unpause(overrides?: CallOverrides): Promise<void>;
  };
  filters: {
    "Approval(address,address,uint256)"(
      owner?: string | null,
      spender?: string | null,
      value?: null
    ): ApprovalEventFilter;
    Approval(owner?: string | null, spender?: string | null, value?: null): ApprovalEventFilter;
    "BassetsMigrated(address[],address)"(bAssets?: null, newIntegrator?: null): BassetsMigratedEventFilter;
    BassetsMigrated(bAssets?: null, newIntegrator?: null): BassetsMigratedEventFilter;
    "CacheSizeChanged(uint256)"(cacheSize?: null): CacheSizeChangedEventFilter;
    CacheSizeChanged(cacheSize?: null): CacheSizeChangedEventFilter;
    "FeesChanged(uint256,uint256,uint256)"(swapFee?: null, redemptionFee?: null, govFee?: null): FeesChangedEventFilter;
    FeesChanged(swapFee?: null, redemptionFee?: null, govFee?: null): FeesChangedEventFilter;
    "Minted(address,address,uint256,address,uint256)"(
      minter?: string | null,
      recipient?: null,
      output?: null,
      input?: null,
      inputQuantity?: null
    ): MintedEventFilter;
    Minted(
      minter?: string | null,
      recipient?: null,
      output?: null,
      input?: null,
      inputQuantity?: null
    ): MintedEventFilter;
    "MintedMulti(address,address,uint256,address[],uint256[])"(
      minter?: string | null,
      recipient?: null,
      output?: null,
      inputs?: null,
      inputQuantities?: null
    ): MintedMultiEventFilter;
    MintedMulti(
      minter?: string | null,
      recipient?: null,
      output?: null,
      inputs?: null,
      inputQuantities?: null
    ): MintedMultiEventFilter;
    "Paused(address)"(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;
    "Redeemed(address,address,uint256,address,uint256,uint256)"(
      redeemer?: string | null,
      recipient?: null,
      mAssetQuantity?: null,
      output?: null,
      outputQuantity?: null,
      scaledFee?: null
    ): RedeemedEventFilter;
    Redeemed(
      redeemer?: string | null,
      recipient?: null,
      mAssetQuantity?: null,
      output?: null,
      outputQuantity?: null,
      scaledFee?: null
    ): RedeemedEventFilter;
    "RedeemedMulti(address,address,uint256,address[],uint256[],uint256)"(
      redeemer?: string | null,
      recipient?: null,
      mAssetQuantity?: null,
      outputs?: null,
      outputQuantity?: null,
      scaledFee?: null
    ): RedeemedMultiEventFilter;
    RedeemedMulti(
      redeemer?: string | null,
      recipient?: null,
      mAssetQuantity?: null,
      outputs?: null,
      outputQuantity?: null,
      scaledFee?: null
    ): RedeemedMultiEventFilter;
    "StartRampA(uint256,uint256,uint256,uint256)"(
      currentA?: null,
      targetA?: null,
      startTime?: null,
      rampEndTime?: null
    ): StartRampAEventFilter;
    StartRampA(currentA?: null, targetA?: null, startTime?: null, rampEndTime?: null): StartRampAEventFilter;
    "StopRampA(uint256,uint256)"(currentA?: null, time?: null): StopRampAEventFilter;
    StopRampA(currentA?: null, time?: null): StopRampAEventFilter;
    "Swapped(address,address,address,uint256,uint256,address)"(
      swapper?: string | null,
      input?: null,
      output?: null,
      outputAmount?: null,
      fee?: null,
      recipient?: null
    ): SwappedEventFilter;
    Swapped(
      swapper?: string | null,
      input?: null,
      output?: null,
      outputAmount?: null,
      fee?: null,
      recipient?: null
    ): SwappedEventFilter;
    "Transfer(address,address,uint256)"(from?: string | null, to?: string | null, value?: null): TransferEventFilter;
    Transfer(from?: string | null, to?: string | null, value?: null): TransferEventFilter;
    "Unpaused(address)"(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;
    "WeightLimitsChanged(uint128,uint128)"(min?: null, max?: null): WeightLimitsChangedEventFilter;
    WeightLimitsChanged(min?: null, max?: null): WeightLimitsChangedEventFilter;
  };
  estimateGas: {
    allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<BigNumber>;
    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;
    collectPendingFees(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    collectPlatformInterest(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    data(overrides?: CallOverrides): Promise<BigNumber>;
    decimals(overrides?: CallOverrides): Promise<BigNumber>;
    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    getBasset(_bAsset: string, overrides?: CallOverrides): Promise<BigNumber>;
    getBassets(overrides?: CallOverrides): Promise<BigNumber>;
    getConfig(overrides?: CallOverrides): Promise<BigNumber>;
    getMintMultiOutput(
      _inputs: string[],
      _inputQuantities: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    getMintOutput(_input: string, _inputQuantity: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    getPrice(overrides?: CallOverrides): Promise<BigNumber>;
    getRedeemExactBassetsOutput(
      _outputs: string[],
      _outputQuantities: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    getRedeemOutput(_output: string, _fpTokenQuantity: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    getSwapOutput(
      _input: string,
      _output: string,
      _inputQuantity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    initialize(
      _nameArg: string,
      _symbolArg: string,
      _mAsset: BassetPersonalStruct,
      _fAsset: BassetPersonalStruct,
      _mpAssets: string[],
      _config: InvariantConfigStruct,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    mAsset(overrides?: CallOverrides): Promise<BigNumber>;
    migrateBassets(
      _bAssets: string[],
      _newIntegration: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    mint(
      _input: string,
      _inputQuantity: BigNumberish,
      _minOutputQuantity: BigNumberish,
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    mintMulti(
      _inputs: string[],
      _inputQuantities: BigNumberish[],
      _minOutputQuantity: BigNumberish,
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    name(overrides?: CallOverrides): Promise<BigNumber>;
    nexus(overrides?: CallOverrides): Promise<BigNumber>;
    pause(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    paused(overrides?: CallOverrides): Promise<BigNumber>;
    redeem(
      _output: string,
      _fpTokenQuantity: BigNumberish,
      _minOutputQuantity: BigNumberish,
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    redeemExactBassets(
      _outputs: string[],
      _outputQuantities: BigNumberish[],
      _maxInputQuantity: BigNumberish,
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    redeemProportionately(
      _inputQuantity: BigNumberish,
      _minOutputQuantities: BigNumberish[],
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    setCacheSize(
      _cacheSize: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    setFees(
      _swapFee: BigNumberish,
      _redemptionFee: BigNumberish,
      _govFee: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    setWeightLimits(
      _min: BigNumberish,
      _max: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    startRampA(
      _targetA: BigNumberish,
      _rampEndTime: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    stopRampA(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    swap(
      _input: string,
      _output: string,
      _inputQuantity: BigNumberish,
      _minOutputQuantity: BigNumberish,
      _recipient: string,
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
    allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    balanceOf(account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    collectPendingFees(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    collectPlatformInterest(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    data(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    getBasset(_bAsset: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getBassets(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getMintMultiOutput(
      _inputs: string[],
      _inputQuantities: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    getMintOutput(
      _input: string,
      _inputQuantity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    getPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getRedeemExactBassetsOutput(
      _outputs: string[],
      _outputQuantities: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    getRedeemOutput(
      _output: string,
      _fpTokenQuantity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    getSwapOutput(
      _input: string,
      _output: string,
      _inputQuantity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    initialize(
      _nameArg: string,
      _symbolArg: string,
      _mAsset: BassetPersonalStruct,
      _fAsset: BassetPersonalStruct,
      _mpAssets: string[],
      _config: InvariantConfigStruct,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    mAsset(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    migrateBassets(
      _bAssets: string[],
      _newIntegration: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    mint(
      _input: string,
      _inputQuantity: BigNumberish,
      _minOutputQuantity: BigNumberish,
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    mintMulti(
      _inputs: string[],
      _inputQuantities: BigNumberish[],
      _minOutputQuantity: BigNumberish,
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    nexus(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    pause(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    redeem(
      _output: string,
      _fpTokenQuantity: BigNumberish,
      _minOutputQuantity: BigNumberish,
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    redeemExactBassets(
      _outputs: string[],
      _outputQuantities: BigNumberish[],
      _maxInputQuantity: BigNumberish,
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    redeemProportionately(
      _inputQuantity: BigNumberish,
      _minOutputQuantities: BigNumberish[],
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    setCacheSize(
      _cacheSize: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    setFees(
      _swapFee: BigNumberish,
      _redemptionFee: BigNumberish,
      _govFee: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    setWeightLimits(
      _min: BigNumberish,
      _max: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    startRampA(
      _targetA: BigNumberish,
      _rampEndTime: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    stopRampA(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    swap(
      _input: string,
      _output: string,
      _inputQuantity: BigNumberish,
      _minOutputQuantity: BigNumberish,
      _recipient: string,
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
