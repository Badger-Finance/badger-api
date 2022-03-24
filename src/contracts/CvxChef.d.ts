/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  CallOverrides,
} from 'ethers';
import { BytesLike } from '@ethersproject/bytes';
import { Listener, Provider } from '@ethersproject/providers';
import { FunctionFragment, EventFragment, Result } from '@ethersproject/abi';
import type { TypedEventFilter, TypedEvent, TypedListener } from './common';

interface CvxChefInterface extends ethers.utils.Interface {
  functions: {
    'MASTER_CHEF()': FunctionFragment;
    'MASTER_PID()': FunctionFragment;
    'SUSHI()': FunctionFragment;
    'add(uint256,address,address)': FunctionFragment;
    'batch(bytes[],bool)': FunctionFragment;
    'claimOwnership()': FunctionFragment;
    'deposit(uint256,uint256,address)': FunctionFragment;
    'emergencyWithdraw(uint256,address)': FunctionFragment;
    'harvest(uint256,address)': FunctionFragment;
    'harvestFromMasterChef()': FunctionFragment;
    'init(address)': FunctionFragment;
    'lpToken(uint256)': FunctionFragment;
    'massUpdatePools(uint256[])': FunctionFragment;
    'migrate(uint256)': FunctionFragment;
    'migrator()': FunctionFragment;
    'owner()': FunctionFragment;
    'pendingOwner()': FunctionFragment;
    'pendingSushi(uint256,address)': FunctionFragment;
    'permitToken(address,address,address,uint256,uint256,uint8,bytes32,bytes32)': FunctionFragment;
    'poolInfo(uint256)': FunctionFragment;
    'poolLength()': FunctionFragment;
    'rewarder(uint256)': FunctionFragment;
    'set(uint256,uint256,address,bool)': FunctionFragment;
    'setMigrator(address)': FunctionFragment;
    'sushiPerBlock()': FunctionFragment;
    'totalAllocPoint()': FunctionFragment;
    'transferOwnership(address,bool,bool)': FunctionFragment;
    'updatePool(uint256)': FunctionFragment;
    'userInfo(uint256,address)': FunctionFragment;
    'withdraw(uint256,uint256,address)': FunctionFragment;
    'withdrawAndHarvest(uint256,uint256,address)': FunctionFragment;
  };

  encodeFunctionData(functionFragment: 'MASTER_CHEF', values?: undefined): string;
  encodeFunctionData(functionFragment: 'MASTER_PID', values?: undefined): string;
  encodeFunctionData(functionFragment: 'SUSHI', values?: undefined): string;
  encodeFunctionData(functionFragment: 'add', values: [BigNumberish, string, string]): string;
  encodeFunctionData(functionFragment: 'batch', values: [BytesLike[], boolean]): string;
  encodeFunctionData(functionFragment: 'claimOwnership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'deposit', values: [BigNumberish, BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'emergencyWithdraw', values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'harvest', values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'harvestFromMasterChef', values?: undefined): string;
  encodeFunctionData(functionFragment: 'init', values: [string]): string;
  encodeFunctionData(functionFragment: 'lpToken', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'massUpdatePools', values: [BigNumberish[]]): string;
  encodeFunctionData(functionFragment: 'migrate', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'migrator', values?: undefined): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pendingOwner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pendingSushi', values: [BigNumberish, string]): string;
  encodeFunctionData(
    functionFragment: 'permitToken',
    values: [string, string, string, BigNumberish, BigNumberish, BigNumberish, BytesLike, BytesLike],
  ): string;
  encodeFunctionData(functionFragment: 'poolInfo', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'poolLength', values?: undefined): string;
  encodeFunctionData(functionFragment: 'rewarder', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'set', values: [BigNumberish, BigNumberish, string, boolean]): string;
  encodeFunctionData(functionFragment: 'setMigrator', values: [string]): string;
  encodeFunctionData(functionFragment: 'sushiPerBlock', values?: undefined): string;
  encodeFunctionData(functionFragment: 'totalAllocPoint', values?: undefined): string;
  encodeFunctionData(functionFragment: 'transferOwnership', values: [string, boolean, boolean]): string;
  encodeFunctionData(functionFragment: 'updatePool', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'userInfo', values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'withdraw', values: [BigNumberish, BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'withdrawAndHarvest', values: [BigNumberish, BigNumberish, string]): string;

  decodeFunctionResult(functionFragment: 'MASTER_CHEF', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'MASTER_PID', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'SUSHI', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'add', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'batch', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claimOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deposit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'emergencyWithdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'harvest', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'harvestFromMasterChef', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'init', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'lpToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'massUpdatePools', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'migrate', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'migrator', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pendingOwner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pendingSushi', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'permitToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolInfo', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolLength', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewarder', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'set', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setMigrator', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'sushiPerBlock', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalAllocPoint', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'updatePool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'userInfo', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdrawAndHarvest', data: BytesLike): Result;

  events: {
    'Deposit(address,uint256,uint256,address)': EventFragment;
    'EmergencyWithdraw(address,uint256,uint256,address)': EventFragment;
    'Harvest(address,uint256,uint256)': EventFragment;
    'LogInit()': EventFragment;
    'LogPoolAddition(uint256,uint256,address,address)': EventFragment;
    'LogSetPool(uint256,uint256,address,bool)': EventFragment;
    'LogUpdatePool(uint256,uint64,uint256,uint256)': EventFragment;
    'OwnershipTransferred(address,address)': EventFragment;
    'Withdraw(address,uint256,uint256,address)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'Deposit'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'EmergencyWithdraw'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Harvest'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'LogInit'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'LogPoolAddition'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'LogSetPool'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'LogUpdatePool'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Withdraw'): EventFragment;
}

export type DepositEvent = TypedEvent<
  [string, BigNumber, BigNumber, string] & {
    user: string;
    pid: BigNumber;
    amount: BigNumber;
    to: string;
  }
>;

export type EmergencyWithdrawEvent = TypedEvent<
  [string, BigNumber, BigNumber, string] & {
    user: string;
    pid: BigNumber;
    amount: BigNumber;
    to: string;
  }
>;

export type HarvestEvent = TypedEvent<
  [string, BigNumber, BigNumber] & {
    user: string;
    pid: BigNumber;
    amount: BigNumber;
  }
>;

export type LogInitEvent = TypedEvent<[] & {}>;

export type LogPoolAdditionEvent = TypedEvent<
  [BigNumber, BigNumber, string, string] & {
    pid: BigNumber;
    allocPoint: BigNumber;
    lpToken: string;
    rewarder: string;
  }
>;

export type LogSetPoolEvent = TypedEvent<
  [BigNumber, BigNumber, string, boolean] & {
    pid: BigNumber;
    allocPoint: BigNumber;
    rewarder: string;
    overwrite: boolean;
  }
>;

export type LogUpdatePoolEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, BigNumber] & {
    pid: BigNumber;
    lastRewardBlock: BigNumber;
    lpSupply: BigNumber;
    accSushiPerShare: BigNumber;
  }
>;

export type OwnershipTransferredEvent = TypedEvent<[string, string] & { previousOwner: string; newOwner: string }>;

export type WithdrawEvent = TypedEvent<
  [string, BigNumber, BigNumber, string] & {
    user: string;
    pid: BigNumber;
    amount: BigNumber;
    to: string;
  }
>;

export class CvxChef extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>,
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: CvxChefInterface;

  functions: {
    MASTER_CHEF(overrides?: CallOverrides): Promise<[string]>;

    MASTER_PID(overrides?: CallOverrides): Promise<[BigNumber]>;

    SUSHI(overrides?: CallOverrides): Promise<[string]>;

    add(
      allocPoint: BigNumberish,
      _lpToken: string,
      _rewarder: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    batch(
      calls: BytesLike[],
      revertOnFail: boolean,
      overrides?: PayableOverrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    claimOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    deposit(
      pid: BigNumberish,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    emergencyWithdraw(
      pid: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    harvest(
      pid: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    harvestFromMasterChef(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    init(dummyToken: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    lpToken(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    massUpdatePools(
      pids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    migrate(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    migrator(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    pendingOwner(overrides?: CallOverrides): Promise<[string]>;

    pendingSushi(
      _pid: BigNumberish,
      _user: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { pending: BigNumber }>;

    permitToken(
      token: string,
      from: string,
      to: string,
      amount: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    poolInfo(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        accSushiPerShare: BigNumber;
        lastRewardBlock: BigNumber;
        allocPoint: BigNumber;
      }
    >;

    poolLength(overrides?: CallOverrides): Promise<[BigNumber] & { pools: BigNumber }>;

    rewarder(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _rewarder: string,
      overwrite: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    setMigrator(
      _migrator: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    sushiPerBlock(overrides?: CallOverrides): Promise<[BigNumber] & { amount: BigNumber }>;

    totalAllocPoint(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      direct: boolean,
      renounce: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    updatePool(
      pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    userInfo(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }>;

    withdraw(
      pid: BigNumberish,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    withdrawAndHarvest(
      pid: BigNumberish,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;
  };

  MASTER_CHEF(overrides?: CallOverrides): Promise<string>;

  MASTER_PID(overrides?: CallOverrides): Promise<BigNumber>;

  SUSHI(overrides?: CallOverrides): Promise<string>;

  add(
    allocPoint: BigNumberish,
    _lpToken: string,
    _rewarder: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  batch(
    calls: BytesLike[],
    revertOnFail: boolean,
    overrides?: PayableOverrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  claimOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  deposit(
    pid: BigNumberish,
    amount: BigNumberish,
    to: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  emergencyWithdraw(
    pid: BigNumberish,
    to: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  harvest(
    pid: BigNumberish,
    to: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  harvestFromMasterChef(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  init(dummyToken: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  lpToken(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  massUpdatePools(
    pids: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  migrate(
    _pid: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  migrator(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  pendingOwner(overrides?: CallOverrides): Promise<string>;

  pendingSushi(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<BigNumber>;

  permitToken(
    token: string,
    from: string,
    to: string,
    amount: BigNumberish,
    deadline: BigNumberish,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  poolInfo(
    arg0: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      accSushiPerShare: BigNumber;
      lastRewardBlock: BigNumber;
      allocPoint: BigNumber;
    }
  >;

  poolLength(overrides?: CallOverrides): Promise<BigNumber>;

  rewarder(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  set(
    _pid: BigNumberish,
    _allocPoint: BigNumberish,
    _rewarder: string,
    overwrite: boolean,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  setMigrator(
    _migrator: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  sushiPerBlock(overrides?: CallOverrides): Promise<BigNumber>;

  totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    direct: boolean,
    renounce: boolean,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  updatePool(
    pid: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  userInfo(
    arg0: BigNumberish,
    arg1: string,
    overrides?: CallOverrides,
  ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }>;

  withdraw(
    pid: BigNumberish,
    amount: BigNumberish,
    to: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  withdrawAndHarvest(
    pid: BigNumberish,
    amount: BigNumberish,
    to: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    MASTER_CHEF(overrides?: CallOverrides): Promise<string>;

    MASTER_PID(overrides?: CallOverrides): Promise<BigNumber>;

    SUSHI(overrides?: CallOverrides): Promise<string>;

    add(allocPoint: BigNumberish, _lpToken: string, _rewarder: string, overrides?: CallOverrides): Promise<void>;

    batch(
      calls: BytesLike[],
      revertOnFail: boolean,
      overrides?: CallOverrides,
    ): Promise<[boolean[], string[]] & { successes: boolean[]; results: string[] }>;

    claimOwnership(overrides?: CallOverrides): Promise<void>;

    deposit(pid: BigNumberish, amount: BigNumberish, to: string, overrides?: CallOverrides): Promise<void>;

    emergencyWithdraw(pid: BigNumberish, to: string, overrides?: CallOverrides): Promise<void>;

    harvest(pid: BigNumberish, to: string, overrides?: CallOverrides): Promise<void>;

    harvestFromMasterChef(overrides?: CallOverrides): Promise<void>;

    init(dummyToken: string, overrides?: CallOverrides): Promise<void>;

    lpToken(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    massUpdatePools(pids: BigNumberish[], overrides?: CallOverrides): Promise<void>;

    migrate(_pid: BigNumberish, overrides?: CallOverrides): Promise<void>;

    migrator(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    pendingOwner(overrides?: CallOverrides): Promise<string>;

    pendingSushi(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<BigNumber>;

    permitToken(
      token: string,
      from: string,
      to: string,
      amount: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides,
    ): Promise<void>;

    poolInfo(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        accSushiPerShare: BigNumber;
        lastRewardBlock: BigNumber;
        allocPoint: BigNumber;
      }
    >;

    poolLength(overrides?: CallOverrides): Promise<BigNumber>;

    rewarder(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _rewarder: string,
      overwrite: boolean,
      overrides?: CallOverrides,
    ): Promise<void>;

    setMigrator(_migrator: string, overrides?: CallOverrides): Promise<void>;

    sushiPerBlock(overrides?: CallOverrides): Promise<BigNumber>;

    totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(newOwner: string, direct: boolean, renounce: boolean, overrides?: CallOverrides): Promise<void>;

    updatePool(
      pid: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        accSushiPerShare: BigNumber;
        lastRewardBlock: BigNumber;
        allocPoint: BigNumber;
      }
    >;

    userInfo(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }>;

    withdraw(pid: BigNumberish, amount: BigNumberish, to: string, overrides?: CallOverrides): Promise<void>;

    withdrawAndHarvest(pid: BigNumberish, amount: BigNumberish, to: string, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    'Deposit(address,uint256,uint256,address)'(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
      to?: string | null,
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, string],
      { user: string; pid: BigNumber; amount: BigNumber; to: string }
    >;

    Deposit(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
      to?: string | null,
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, string],
      { user: string; pid: BigNumber; amount: BigNumber; to: string }
    >;

    'EmergencyWithdraw(address,uint256,uint256,address)'(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
      to?: string | null,
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, string],
      { user: string; pid: BigNumber; amount: BigNumber; to: string }
    >;

    EmergencyWithdraw(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
      to?: string | null,
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, string],
      { user: string; pid: BigNumber; amount: BigNumber; to: string }
    >;

    'Harvest(address,uint256,uint256)'(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
    ): TypedEventFilter<[string, BigNumber, BigNumber], { user: string; pid: BigNumber; amount: BigNumber }>;

    Harvest(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
    ): TypedEventFilter<[string, BigNumber, BigNumber], { user: string; pid: BigNumber; amount: BigNumber }>;

    'LogInit()'(): TypedEventFilter<[], {}>;

    LogInit(): TypedEventFilter<[], {}>;

    'LogPoolAddition(uint256,uint256,address,address)'(
      pid?: BigNumberish | null,
      allocPoint?: null,
      lpToken?: string | null,
      rewarder?: string | null,
    ): TypedEventFilter<
      [BigNumber, BigNumber, string, string],
      {
        pid: BigNumber;
        allocPoint: BigNumber;
        lpToken: string;
        rewarder: string;
      }
    >;

    LogPoolAddition(
      pid?: BigNumberish | null,
      allocPoint?: null,
      lpToken?: string | null,
      rewarder?: string | null,
    ): TypedEventFilter<
      [BigNumber, BigNumber, string, string],
      {
        pid: BigNumber;
        allocPoint: BigNumber;
        lpToken: string;
        rewarder: string;
      }
    >;

    'LogSetPool(uint256,uint256,address,bool)'(
      pid?: BigNumberish | null,
      allocPoint?: null,
      rewarder?: string | null,
      overwrite?: null,
    ): TypedEventFilter<
      [BigNumber, BigNumber, string, boolean],
      {
        pid: BigNumber;
        allocPoint: BigNumber;
        rewarder: string;
        overwrite: boolean;
      }
    >;

    LogSetPool(
      pid?: BigNumberish | null,
      allocPoint?: null,
      rewarder?: string | null,
      overwrite?: null,
    ): TypedEventFilter<
      [BigNumber, BigNumber, string, boolean],
      {
        pid: BigNumber;
        allocPoint: BigNumber;
        rewarder: string;
        overwrite: boolean;
      }
    >;

    'LogUpdatePool(uint256,uint64,uint256,uint256)'(
      pid?: BigNumberish | null,
      lastRewardBlock?: null,
      lpSupply?: null,
      accSushiPerShare?: null,
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber, BigNumber],
      {
        pid: BigNumber;
        lastRewardBlock: BigNumber;
        lpSupply: BigNumber;
        accSushiPerShare: BigNumber;
      }
    >;

    LogUpdatePool(
      pid?: BigNumberish | null,
      lastRewardBlock?: null,
      lpSupply?: null,
      accSushiPerShare?: null,
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber, BigNumber],
      {
        pid: BigNumber;
        lastRewardBlock: BigNumber;
        lpSupply: BigNumber;
        accSushiPerShare: BigNumber;
      }
    >;

    'OwnershipTransferred(address,address)'(
      previousOwner?: string | null,
      newOwner?: string | null,
    ): TypedEventFilter<[string, string], { previousOwner: string; newOwner: string }>;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null,
    ): TypedEventFilter<[string, string], { previousOwner: string; newOwner: string }>;

    'Withdraw(address,uint256,uint256,address)'(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
      to?: string | null,
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, string],
      { user: string; pid: BigNumber; amount: BigNumber; to: string }
    >;

    Withdraw(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
      to?: string | null,
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, string],
      { user: string; pid: BigNumber; amount: BigNumber; to: string }
    >;
  };

  estimateGas: {
    MASTER_CHEF(overrides?: CallOverrides): Promise<BigNumber>;

    MASTER_PID(overrides?: CallOverrides): Promise<BigNumber>;

    SUSHI(overrides?: CallOverrides): Promise<BigNumber>;

    add(
      allocPoint: BigNumberish,
      _lpToken: string,
      _rewarder: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    batch(
      calls: BytesLike[],
      revertOnFail: boolean,
      overrides?: PayableOverrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    claimOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    deposit(
      pid: BigNumberish,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    emergencyWithdraw(
      pid: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    harvest(
      pid: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    harvestFromMasterChef(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    init(dummyToken: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    lpToken(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    massUpdatePools(
      pids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    migrate(_pid: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    migrator(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    pendingOwner(overrides?: CallOverrides): Promise<BigNumber>;

    pendingSushi(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<BigNumber>;

    permitToken(
      token: string,
      from: string,
      to: string,
      amount: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    poolInfo(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    poolLength(overrides?: CallOverrides): Promise<BigNumber>;

    rewarder(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _rewarder: string,
      overwrite: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    setMigrator(_migrator: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    sushiPerBlock(overrides?: CallOverrides): Promise<BigNumber>;

    totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      direct: boolean,
      renounce: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    updatePool(pid: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    userInfo(arg0: BigNumberish, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      pid: BigNumberish,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    withdrawAndHarvest(
      pid: BigNumberish,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    MASTER_CHEF(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    MASTER_PID(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    SUSHI(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    add(
      allocPoint: BigNumberish,
      _lpToken: string,
      _rewarder: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    batch(
      calls: BytesLike[],
      revertOnFail: boolean,
      overrides?: PayableOverrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    claimOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    deposit(
      pid: BigNumberish,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    emergencyWithdraw(
      pid: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    harvest(
      pid: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    harvestFromMasterChef(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    init(
      dummyToken: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    lpToken(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    massUpdatePools(
      pids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    migrate(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    migrator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingSushi(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    permitToken(
      token: string,
      from: string,
      to: string,
      amount: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    poolInfo(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewarder(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _rewarder: string,
      overwrite: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    setMigrator(
      _migrator: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    sushiPerBlock(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalAllocPoint(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      direct: boolean,
      renounce: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    updatePool(
      pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    userInfo(arg0: BigNumberish, arg1: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdraw(
      pid: BigNumberish,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    withdrawAndHarvest(
      pid: BigNumberish,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;
  };
}
