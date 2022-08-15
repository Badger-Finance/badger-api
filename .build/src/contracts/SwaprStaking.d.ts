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
export interface SwaprStakingInterface extends utils.Interface {
  contractName: "SwaprStaking";
  functions: {
    "cancel()": FunctionFragment;
    "canceled()": FunctionFragment;
    "claim(uint256[],address)": FunctionFragment;
    "claimAll(address)": FunctionFragment;
    "claimableRewards(address)": FunctionFragment;
    "earnedRewardsOf(address)": FunctionFragment;
    "endingTimestamp()": FunctionFragment;
    "exit(address)": FunctionFragment;
    "factory()": FunctionFragment;
    "getClaimedRewards(address)": FunctionFragment;
    "getRewardTokens()": FunctionFragment;
    "initialize(address[],address,uint256[],uint64,uint64,bool,uint256)": FunctionFragment;
    "initialized()": FunctionFragment;
    "lastConsolidationTimestamp()": FunctionFragment;
    "locked()": FunctionFragment;
    "owner()": FunctionFragment;
    "recoverUnassignedRewards()": FunctionFragment;
    "recoverableUnassignedReward(address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "rewardAmount(address)": FunctionFragment;
    "rewards(uint256)": FunctionFragment;
    "secondsDuration()": FunctionFragment;
    "stakableToken()": FunctionFragment;
    "stake(uint256)": FunctionFragment;
    "stakedTokensOf(address)": FunctionFragment;
    "stakers(address)": FunctionFragment;
    "stakingCap()": FunctionFragment;
    "startingTimestamp()": FunctionFragment;
    "totalStakedTokensAmount()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "withdraw(uint256)": FunctionFragment;
  };
  encodeFunctionData(functionFragment: "cancel", values?: undefined): string;
  encodeFunctionData(functionFragment: "canceled", values?: undefined): string;
  encodeFunctionData(functionFragment: "claim", values: [BigNumberish[], string]): string;
  encodeFunctionData(functionFragment: "claimAll", values: [string]): string;
  encodeFunctionData(functionFragment: "claimableRewards", values: [string]): string;
  encodeFunctionData(functionFragment: "earnedRewardsOf", values: [string]): string;
  encodeFunctionData(functionFragment: "endingTimestamp", values?: undefined): string;
  encodeFunctionData(functionFragment: "exit", values: [string]): string;
  encodeFunctionData(functionFragment: "factory", values?: undefined): string;
  encodeFunctionData(functionFragment: "getClaimedRewards", values: [string]): string;
  encodeFunctionData(functionFragment: "getRewardTokens", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string[], string, BigNumberish[], BigNumberish, BigNumberish, boolean, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "initialized", values?: undefined): string;
  encodeFunctionData(functionFragment: "lastConsolidationTimestamp", values?: undefined): string;
  encodeFunctionData(functionFragment: "locked", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "recoverUnassignedRewards", values?: undefined): string;
  encodeFunctionData(functionFragment: "recoverableUnassignedReward", values: [string]): string;
  encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
  encodeFunctionData(functionFragment: "rewardAmount", values: [string]): string;
  encodeFunctionData(functionFragment: "rewards", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "secondsDuration", values?: undefined): string;
  encodeFunctionData(functionFragment: "stakableToken", values?: undefined): string;
  encodeFunctionData(functionFragment: "stake", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "stakedTokensOf", values: [string]): string;
  encodeFunctionData(functionFragment: "stakers", values: [string]): string;
  encodeFunctionData(functionFragment: "stakingCap", values?: undefined): string;
  encodeFunctionData(functionFragment: "startingTimestamp", values?: undefined): string;
  encodeFunctionData(functionFragment: "totalStakedTokensAmount", values?: undefined): string;
  encodeFunctionData(functionFragment: "transferOwnership", values: [string]): string;
  encodeFunctionData(functionFragment: "withdraw", values: [BigNumberish]): string;
  decodeFunctionResult(functionFragment: "cancel", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "canceled", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claimAll", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claimableRewards", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "earnedRewardsOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "endingTimestamp", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "exit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getClaimedRewards", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getRewardTokens", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialized", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lastConsolidationTimestamp", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "locked", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "recoverUnassignedRewards", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "recoverableUnassignedReward", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rewardAmount", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rewards", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "secondsDuration", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stakableToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stakedTokensOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stakers", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stakingCap", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "startingTimestamp", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "totalStakedTokensAmount", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
  events: {
    "Canceled()": EventFragment;
    "Claimed(address,uint256[])": EventFragment;
    "Initialized(address[],address,uint256[],uint64,uint64,bool,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Recovered(uint256[])": EventFragment;
    "Staked(address,uint256)": EventFragment;
    "Withdrawn(address,uint256)": EventFragment;
  };
  getEvent(nameOrSignatureOrTopic: "Canceled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Claimed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Recovered"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Staked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdrawn"): EventFragment;
}
export declare type CanceledEvent = TypedEvent<[], {}>;
export declare type CanceledEventFilter = TypedEventFilter<CanceledEvent>;
export declare type ClaimedEvent = TypedEvent<
  [string, BigNumber[]],
  {
    claimer: string;
    amounts: BigNumber[];
  }
>;
export declare type ClaimedEventFilter = TypedEventFilter<ClaimedEvent>;
export declare type InitializedEvent = TypedEvent<
  [string[], string, BigNumber[], BigNumber, BigNumber, boolean, BigNumber],
  {
    rewardsTokenAddresses: string[];
    stakableTokenAddress: string;
    rewardsAmounts: BigNumber[];
    startingTimestamp: BigNumber;
    endingTimestamp: BigNumber;
    locked: boolean;
    stakingCap: BigNumber;
  }
>;
export declare type InitializedEventFilter = TypedEventFilter<InitializedEvent>;
export declare type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  {
    previousOwner: string;
    newOwner: string;
  }
>;
export declare type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export declare type RecoveredEvent = TypedEvent<
  [BigNumber[]],
  {
    amounts: BigNumber[];
  }
>;
export declare type RecoveredEventFilter = TypedEventFilter<RecoveredEvent>;
export declare type StakedEvent = TypedEvent<
  [string, BigNumber],
  {
    staker: string;
    amount: BigNumber;
  }
>;
export declare type StakedEventFilter = TypedEventFilter<StakedEvent>;
export declare type WithdrawnEvent = TypedEvent<
  [string, BigNumber],
  {
    withdrawer: string;
    amount: BigNumber;
  }
>;
export declare type WithdrawnEventFilter = TypedEventFilter<WithdrawnEvent>;
export interface SwaprStaking extends BaseContract {
  contractName: "SwaprStaking";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: SwaprStakingInterface;
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
    cancel(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    canceled(overrides?: CallOverrides): Promise<[boolean]>;
    claim(
      _amounts: BigNumberish[],
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    claimAll(
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    claimableRewards(_account: string, overrides?: CallOverrides): Promise<[BigNumber[]]>;
    earnedRewardsOf(_staker: string, overrides?: CallOverrides): Promise<[BigNumber[]]>;
    endingTimestamp(overrides?: CallOverrides): Promise<[BigNumber]>;
    exit(
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    factory(overrides?: CallOverrides): Promise<[string]>;
    getClaimedRewards(_claimer: string, overrides?: CallOverrides): Promise<[BigNumber[]]>;
    getRewardTokens(overrides?: CallOverrides): Promise<[string[]]>;
    initialize(
      _rewardTokenAddresses: string[],
      _stakableTokenAddress: string,
      _rewardAmounts: BigNumberish[],
      _startingTimestamp: BigNumberish,
      _endingTimestamp: BigNumberish,
      _locked: boolean,
      _stakingCap: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    initialized(overrides?: CallOverrides): Promise<[boolean]>;
    lastConsolidationTimestamp(overrides?: CallOverrides): Promise<[BigNumber]>;
    locked(overrides?: CallOverrides): Promise<[boolean]>;
    owner(overrides?: CallOverrides): Promise<[string]>;
    recoverUnassignedRewards(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    recoverableUnassignedReward(_rewardToken: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    renounceOwnership(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    rewardAmount(_rewardToken: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    rewards(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber, BigNumber] & {
        token: string;
        amount: BigNumber;
        perStakedToken: BigNumber;
        recoverableSeconds: BigNumber;
        claimed: BigNumber;
      }
    >;
    secondsDuration(overrides?: CallOverrides): Promise<[BigNumber]>;
    stakableToken(overrides?: CallOverrides): Promise<[string]>;
    stake(
      _amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    stakedTokensOf(_staker: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    stakers(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber] & {
        stake: BigNumber;
      }
    >;
    stakingCap(overrides?: CallOverrides): Promise<[BigNumber]>;
    startingTimestamp(overrides?: CallOverrides): Promise<[BigNumber]>;
    totalStakedTokensAmount(overrides?: CallOverrides): Promise<[BigNumber]>;
    transferOwnership(
      _newOwner: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    withdraw(
      _amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
  };
  cancel(
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  canceled(overrides?: CallOverrides): Promise<boolean>;
  claim(
    _amounts: BigNumberish[],
    _recipient: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  claimAll(
    _recipient: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  claimableRewards(_account: string, overrides?: CallOverrides): Promise<BigNumber[]>;
  earnedRewardsOf(_staker: string, overrides?: CallOverrides): Promise<BigNumber[]>;
  endingTimestamp(overrides?: CallOverrides): Promise<BigNumber>;
  exit(
    _recipient: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  factory(overrides?: CallOverrides): Promise<string>;
  getClaimedRewards(_claimer: string, overrides?: CallOverrides): Promise<BigNumber[]>;
  getRewardTokens(overrides?: CallOverrides): Promise<string[]>;
  initialize(
    _rewardTokenAddresses: string[],
    _stakableTokenAddress: string,
    _rewardAmounts: BigNumberish[],
    _startingTimestamp: BigNumberish,
    _endingTimestamp: BigNumberish,
    _locked: boolean,
    _stakingCap: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  initialized(overrides?: CallOverrides): Promise<boolean>;
  lastConsolidationTimestamp(overrides?: CallOverrides): Promise<BigNumber>;
  locked(overrides?: CallOverrides): Promise<boolean>;
  owner(overrides?: CallOverrides): Promise<string>;
  recoverUnassignedRewards(
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  recoverableUnassignedReward(_rewardToken: string, overrides?: CallOverrides): Promise<BigNumber>;
  renounceOwnership(
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  rewardAmount(_rewardToken: string, overrides?: CallOverrides): Promise<BigNumber>;
  rewards(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [string, BigNumber, BigNumber, BigNumber, BigNumber] & {
      token: string;
      amount: BigNumber;
      perStakedToken: BigNumber;
      recoverableSeconds: BigNumber;
      claimed: BigNumber;
    }
  >;
  secondsDuration(overrides?: CallOverrides): Promise<BigNumber>;
  stakableToken(overrides?: CallOverrides): Promise<string>;
  stake(
    _amount: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  stakedTokensOf(_staker: string, overrides?: CallOverrides): Promise<BigNumber>;
  stakers(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
  stakingCap(overrides?: CallOverrides): Promise<BigNumber>;
  startingTimestamp(overrides?: CallOverrides): Promise<BigNumber>;
  totalStakedTokensAmount(overrides?: CallOverrides): Promise<BigNumber>;
  transferOwnership(
    _newOwner: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  withdraw(
    _amount: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  callStatic: {
    cancel(overrides?: CallOverrides): Promise<void>;
    canceled(overrides?: CallOverrides): Promise<boolean>;
    claim(_amounts: BigNumberish[], _recipient: string, overrides?: CallOverrides): Promise<void>;
    claimAll(_recipient: string, overrides?: CallOverrides): Promise<void>;
    claimableRewards(_account: string, overrides?: CallOverrides): Promise<BigNumber[]>;
    earnedRewardsOf(_staker: string, overrides?: CallOverrides): Promise<BigNumber[]>;
    endingTimestamp(overrides?: CallOverrides): Promise<BigNumber>;
    exit(_recipient: string, overrides?: CallOverrides): Promise<void>;
    factory(overrides?: CallOverrides): Promise<string>;
    getClaimedRewards(_claimer: string, overrides?: CallOverrides): Promise<BigNumber[]>;
    getRewardTokens(overrides?: CallOverrides): Promise<string[]>;
    initialize(
      _rewardTokenAddresses: string[],
      _stakableTokenAddress: string,
      _rewardAmounts: BigNumberish[],
      _startingTimestamp: BigNumberish,
      _endingTimestamp: BigNumberish,
      _locked: boolean,
      _stakingCap: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
    initialized(overrides?: CallOverrides): Promise<boolean>;
    lastConsolidationTimestamp(overrides?: CallOverrides): Promise<BigNumber>;
    locked(overrides?: CallOverrides): Promise<boolean>;
    owner(overrides?: CallOverrides): Promise<string>;
    recoverUnassignedRewards(overrides?: CallOverrides): Promise<void>;
    recoverableUnassignedReward(_rewardToken: string, overrides?: CallOverrides): Promise<BigNumber>;
    renounceOwnership(overrides?: CallOverrides): Promise<void>;
    rewardAmount(_rewardToken: string, overrides?: CallOverrides): Promise<BigNumber>;
    rewards(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber, BigNumber] & {
        token: string;
        amount: BigNumber;
        perStakedToken: BigNumber;
        recoverableSeconds: BigNumber;
        claimed: BigNumber;
      }
    >;
    secondsDuration(overrides?: CallOverrides): Promise<BigNumber>;
    stakableToken(overrides?: CallOverrides): Promise<string>;
    stake(_amount: BigNumberish, overrides?: CallOverrides): Promise<void>;
    stakedTokensOf(_staker: string, overrides?: CallOverrides): Promise<BigNumber>;
    stakers(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    stakingCap(overrides?: CallOverrides): Promise<BigNumber>;
    startingTimestamp(overrides?: CallOverrides): Promise<BigNumber>;
    totalStakedTokensAmount(overrides?: CallOverrides): Promise<BigNumber>;
    transferOwnership(_newOwner: string, overrides?: CallOverrides): Promise<void>;
    withdraw(_amount: BigNumberish, overrides?: CallOverrides): Promise<void>;
  };
  filters: {
    "Canceled()"(): CanceledEventFilter;
    Canceled(): CanceledEventFilter;
    "Claimed(address,uint256[])"(claimer?: string | null, amounts?: null): ClaimedEventFilter;
    Claimed(claimer?: string | null, amounts?: null): ClaimedEventFilter;
    "Initialized(address[],address,uint256[],uint64,uint64,bool,uint256)"(
      rewardsTokenAddresses?: null,
      stakableTokenAddress?: null,
      rewardsAmounts?: null,
      startingTimestamp?: null,
      endingTimestamp?: null,
      locked?: null,
      stakingCap?: null
    ): InitializedEventFilter;
    Initialized(
      rewardsTokenAddresses?: null,
      stakableTokenAddress?: null,
      rewardsAmounts?: null,
      startingTimestamp?: null,
      endingTimestamp?: null,
      locked?: null,
      stakingCap?: null
    ): InitializedEventFilter;
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): OwnershipTransferredEventFilter;
    "Recovered(uint256[])"(amounts?: null): RecoveredEventFilter;
    Recovered(amounts?: null): RecoveredEventFilter;
    "Staked(address,uint256)"(staker?: string | null, amount?: null): StakedEventFilter;
    Staked(staker?: string | null, amount?: null): StakedEventFilter;
    "Withdrawn(address,uint256)"(withdrawer?: string | null, amount?: null): WithdrawnEventFilter;
    Withdrawn(withdrawer?: string | null, amount?: null): WithdrawnEventFilter;
  };
  estimateGas: {
    cancel(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    canceled(overrides?: CallOverrides): Promise<BigNumber>;
    claim(
      _amounts: BigNumberish[],
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    claimAll(
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    claimableRewards(_account: string, overrides?: CallOverrides): Promise<BigNumber>;
    earnedRewardsOf(_staker: string, overrides?: CallOverrides): Promise<BigNumber>;
    endingTimestamp(overrides?: CallOverrides): Promise<BigNumber>;
    exit(
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    factory(overrides?: CallOverrides): Promise<BigNumber>;
    getClaimedRewards(_claimer: string, overrides?: CallOverrides): Promise<BigNumber>;
    getRewardTokens(overrides?: CallOverrides): Promise<BigNumber>;
    initialize(
      _rewardTokenAddresses: string[],
      _stakableTokenAddress: string,
      _rewardAmounts: BigNumberish[],
      _startingTimestamp: BigNumberish,
      _endingTimestamp: BigNumberish,
      _locked: boolean,
      _stakingCap: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    initialized(overrides?: CallOverrides): Promise<BigNumber>;
    lastConsolidationTimestamp(overrides?: CallOverrides): Promise<BigNumber>;
    locked(overrides?: CallOverrides): Promise<BigNumber>;
    owner(overrides?: CallOverrides): Promise<BigNumber>;
    recoverUnassignedRewards(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    recoverableUnassignedReward(_rewardToken: string, overrides?: CallOverrides): Promise<BigNumber>;
    renounceOwnership(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    rewardAmount(_rewardToken: string, overrides?: CallOverrides): Promise<BigNumber>;
    rewards(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    secondsDuration(overrides?: CallOverrides): Promise<BigNumber>;
    stakableToken(overrides?: CallOverrides): Promise<BigNumber>;
    stake(
      _amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    stakedTokensOf(_staker: string, overrides?: CallOverrides): Promise<BigNumber>;
    stakers(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    stakingCap(overrides?: CallOverrides): Promise<BigNumber>;
    startingTimestamp(overrides?: CallOverrides): Promise<BigNumber>;
    totalStakedTokensAmount(overrides?: CallOverrides): Promise<BigNumber>;
    transferOwnership(
      _newOwner: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    withdraw(
      _amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
  };
  populateTransaction: {
    cancel(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    canceled(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    claim(
      _amounts: BigNumberish[],
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    claimAll(
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    claimableRewards(_account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    earnedRewardsOf(_staker: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    endingTimestamp(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    exit(
      _recipient: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    factory(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getClaimedRewards(_claimer: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getRewardTokens(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    initialize(
      _rewardTokenAddresses: string[],
      _stakableTokenAddress: string,
      _rewardAmounts: BigNumberish[],
      _startingTimestamp: BigNumberish,
      _endingTimestamp: BigNumberish,
      _locked: boolean,
      _stakingCap: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    initialized(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    lastConsolidationTimestamp(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    locked(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    recoverUnassignedRewards(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    recoverableUnassignedReward(_rewardToken: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    renounceOwnership(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    rewardAmount(_rewardToken: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    rewards(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    secondsDuration(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    stakableToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    stake(
      _amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    stakedTokensOf(_staker: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    stakers(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    stakingCap(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    startingTimestamp(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    totalStakedTokensAmount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    transferOwnership(
      _newOwner: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    withdraw(
      _amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
  };
}
