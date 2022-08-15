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
export interface ImbtcInterface extends utils.Interface {
  contractName: "Imbtc";
  functions: {
    "allowance(address,address)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "automateInterestCollectionFlag(bool)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "balanceOfUnderlying(address)": FunctionFragment;
    "connector()": FunctionFragment;
    "creditBalances(address)": FunctionFragment;
    "creditsToUnderlying(uint256)": FunctionFragment;
    "decimals()": FunctionFragment;
    "decreaseAllowance(address,uint256)": FunctionFragment;
    "depositInterest(uint256)": FunctionFragment;
    "depositSavings(uint256,address)": FunctionFragment;
    "emergencyWithdraw(uint256)": FunctionFragment;
    "exchangeRate()": FunctionFragment;
    "fraction()": FunctionFragment;
    "increaseAllowance(address,uint256)": FunctionFragment;
    "initialize(address,string,string)": FunctionFragment;
    "lastBalance()": FunctionFragment;
    "lastPoke()": FunctionFragment;
    "name()": FunctionFragment;
    "nexus()": FunctionFragment;
    "poke()": FunctionFragment;
    "poker()": FunctionFragment;
    "preDeposit(uint256,address)": FunctionFragment;
    "redeem(uint256)": FunctionFragment;
    "redeemCredits(uint256)": FunctionFragment;
    "redeemUnderlying(uint256)": FunctionFragment;
    "setConnector(address)": FunctionFragment;
    "setFraction(uint256)": FunctionFragment;
    "setPoker(address)": FunctionFragment;
    "symbol()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transfer(address,uint256)": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "underlying()": FunctionFragment;
    "underlyingToCredits(uint256)": FunctionFragment;
  };
  encodeFunctionData(functionFragment: "allowance", values: [string, string]): string;
  encodeFunctionData(functionFragment: "approve", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "automateInterestCollectionFlag", values: [boolean]): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(functionFragment: "balanceOfUnderlying", values: [string]): string;
  encodeFunctionData(functionFragment: "connector", values?: undefined): string;
  encodeFunctionData(functionFragment: "creditBalances", values: [string]): string;
  encodeFunctionData(functionFragment: "creditsToUnderlying", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(functionFragment: "decreaseAllowance", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "depositInterest", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "depositSavings", values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: "emergencyWithdraw", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "exchangeRate", values?: undefined): string;
  encodeFunctionData(functionFragment: "fraction", values?: undefined): string;
  encodeFunctionData(functionFragment: "increaseAllowance", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "initialize", values: [string, string, string]): string;
  encodeFunctionData(functionFragment: "lastBalance", values?: undefined): string;
  encodeFunctionData(functionFragment: "lastPoke", values?: undefined): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(functionFragment: "nexus", values?: undefined): string;
  encodeFunctionData(functionFragment: "poke", values?: undefined): string;
  encodeFunctionData(functionFragment: "poker", values?: undefined): string;
  encodeFunctionData(functionFragment: "preDeposit", values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: "redeem", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "redeemCredits", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "redeemUnderlying", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "setConnector", values: [string]): string;
  encodeFunctionData(functionFragment: "setFraction", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "setPoker", values: [string]): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
  encodeFunctionData(functionFragment: "transfer", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "transferFrom", values: [string, string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "underlying", values?: undefined): string;
  encodeFunctionData(functionFragment: "underlyingToCredits", values: [BigNumberish]): string;
  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "automateInterestCollectionFlag", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOfUnderlying", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "connector", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "creditBalances", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "creditsToUnderlying", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "decreaseAllowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "depositInterest", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "depositSavings", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "emergencyWithdraw", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "exchangeRate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "fraction", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "increaseAllowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lastBalance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lastPoke", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "nexus", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "poke", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "poker", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "preDeposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeem", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeemCredits", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeemUnderlying", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setConnector", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setFraction", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setPoker", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "underlying", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "underlyingToCredits", data: BytesLike): Result;
  events: {
    "Approval(address,address,uint256)": EventFragment;
    "AutomaticInterestCollectionSwitched(bool)": EventFragment;
    "ConnectorUpdated(address)": EventFragment;
    "CreditsRedeemed(address,uint256,uint256)": EventFragment;
    "EmergencyUpdate()": EventFragment;
    "ExchangeRateUpdated(uint256,uint256)": EventFragment;
    "FractionUpdated(uint256)": EventFragment;
    "Poked(uint256,uint256,uint256)": EventFragment;
    "PokedRaw()": EventFragment;
    "PokerUpdated(address)": EventFragment;
    "SavingsDeposited(address,uint256,uint256)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
  };
  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AutomaticInterestCollectionSwitched"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ConnectorUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CreditsRedeemed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EmergencyUpdate"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ExchangeRateUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FractionUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Poked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PokedRaw"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PokerUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SavingsDeposited"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
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
export declare type AutomaticInterestCollectionSwitchedEvent = TypedEvent<
  [boolean],
  {
    automationEnabled: boolean;
  }
>;
export declare type AutomaticInterestCollectionSwitchedEventFilter =
  TypedEventFilter<AutomaticInterestCollectionSwitchedEvent>;
export declare type ConnectorUpdatedEvent = TypedEvent<
  [string],
  {
    connector: string;
  }
>;
export declare type ConnectorUpdatedEventFilter = TypedEventFilter<ConnectorUpdatedEvent>;
export declare type CreditsRedeemedEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  {
    redeemer: string;
    creditsRedeemed: BigNumber;
    savingsCredited: BigNumber;
  }
>;
export declare type CreditsRedeemedEventFilter = TypedEventFilter<CreditsRedeemedEvent>;
export declare type EmergencyUpdateEvent = TypedEvent<[], {}>;
export declare type EmergencyUpdateEventFilter = TypedEventFilter<EmergencyUpdateEvent>;
export declare type ExchangeRateUpdatedEvent = TypedEvent<
  [BigNumber, BigNumber],
  {
    newExchangeRate: BigNumber;
    interestCollected: BigNumber;
  }
>;
export declare type ExchangeRateUpdatedEventFilter = TypedEventFilter<ExchangeRateUpdatedEvent>;
export declare type FractionUpdatedEvent = TypedEvent<
  [BigNumber],
  {
    fraction: BigNumber;
  }
>;
export declare type FractionUpdatedEventFilter = TypedEventFilter<FractionUpdatedEvent>;
export declare type PokedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber],
  {
    oldBalance: BigNumber;
    newBalance: BigNumber;
    interestDetected: BigNumber;
  }
>;
export declare type PokedEventFilter = TypedEventFilter<PokedEvent>;
export declare type PokedRawEvent = TypedEvent<[], {}>;
export declare type PokedRawEventFilter = TypedEventFilter<PokedRawEvent>;
export declare type PokerUpdatedEvent = TypedEvent<
  [string],
  {
    poker: string;
  }
>;
export declare type PokerUpdatedEventFilter = TypedEventFilter<PokerUpdatedEvent>;
export declare type SavingsDepositedEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  {
    saver: string;
    savingsDeposited: BigNumber;
    creditsIssued: BigNumber;
  }
>;
export declare type SavingsDepositedEventFilter = TypedEventFilter<SavingsDepositedEvent>;
export declare type TransferEvent = TypedEvent<
  [string, string, BigNumber],
  {
    from: string;
    to: string;
    value: BigNumber;
  }
>;
export declare type TransferEventFilter = TypedEventFilter<TransferEvent>;
export interface Imbtc extends BaseContract {
  contractName: "Imbtc";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: ImbtcInterface;
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
    automateInterestCollectionFlag(
      _enabled: boolean,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    balanceOf(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    balanceOfUnderlying(
      _user: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber] & {
        balance: BigNumber;
      }
    >;
    connector(overrides?: CallOverrides): Promise<[string]>;
    creditBalances(_user: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    creditsToUnderlying(
      _credits: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber] & {
        amount: BigNumber;
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
    depositInterest(
      _amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    "depositSavings(uint256,address)"(
      _underlying: BigNumberish,
      _beneficiary: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    "depositSavings(uint256)"(
      _underlying: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    emergencyWithdraw(
      _withdrawAmount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    exchangeRate(overrides?: CallOverrides): Promise<[BigNumber]>;
    fraction(overrides?: CallOverrides): Promise<[BigNumber]>;
    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    initialize(
      _poker: string,
      _nameArg: string,
      _symbolArg: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    lastBalance(overrides?: CallOverrides): Promise<[BigNumber]>;
    lastPoke(overrides?: CallOverrides): Promise<[BigNumber]>;
    name(overrides?: CallOverrides): Promise<[string]>;
    nexus(overrides?: CallOverrides): Promise<[string]>;
    poke(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    poker(overrides?: CallOverrides): Promise<[string]>;
    preDeposit(
      _underlying: BigNumberish,
      _beneficiary: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    redeem(
      _credits: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    redeemCredits(
      _credits: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    redeemUnderlying(
      _underlying: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    setConnector(
      _newConnector: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    setFraction(
      _fraction: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    setPoker(
      _newPoker: string,
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
    underlying(overrides?: CallOverrides): Promise<[string]>;
    underlyingToCredits(
      _underlying: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber] & {
        credits: BigNumber;
      }
    >;
  };
  allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<BigNumber>;
  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  automateInterestCollectionFlag(
    _enabled: boolean,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;
  balanceOfUnderlying(_user: string, overrides?: CallOverrides): Promise<BigNumber>;
  connector(overrides?: CallOverrides): Promise<string>;
  creditBalances(_user: string, overrides?: CallOverrides): Promise<BigNumber>;
  creditsToUnderlying(_credits: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
  decimals(overrides?: CallOverrides): Promise<number>;
  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  depositInterest(
    _amount: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  "depositSavings(uint256,address)"(
    _underlying: BigNumberish,
    _beneficiary: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  "depositSavings(uint256)"(
    _underlying: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  emergencyWithdraw(
    _withdrawAmount: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  exchangeRate(overrides?: CallOverrides): Promise<BigNumber>;
  fraction(overrides?: CallOverrides): Promise<BigNumber>;
  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  initialize(
    _poker: string,
    _nameArg: string,
    _symbolArg: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  lastBalance(overrides?: CallOverrides): Promise<BigNumber>;
  lastPoke(overrides?: CallOverrides): Promise<BigNumber>;
  name(overrides?: CallOverrides): Promise<string>;
  nexus(overrides?: CallOverrides): Promise<string>;
  poke(
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  poker(overrides?: CallOverrides): Promise<string>;
  preDeposit(
    _underlying: BigNumberish,
    _beneficiary: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  redeem(
    _credits: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  redeemCredits(
    _credits: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  redeemUnderlying(
    _underlying: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  setConnector(
    _newConnector: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  setFraction(
    _fraction: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  setPoker(
    _newPoker: string,
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
  underlying(overrides?: CallOverrides): Promise<string>;
  underlyingToCredits(_underlying: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
  callStatic: {
    allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<BigNumber>;
    approve(spender: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
    automateInterestCollectionFlag(_enabled: boolean, overrides?: CallOverrides): Promise<void>;
    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;
    balanceOfUnderlying(_user: string, overrides?: CallOverrides): Promise<BigNumber>;
    connector(overrides?: CallOverrides): Promise<string>;
    creditBalances(_user: string, overrides?: CallOverrides): Promise<BigNumber>;
    creditsToUnderlying(_credits: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    decimals(overrides?: CallOverrides): Promise<number>;
    decreaseAllowance(spender: string, subtractedValue: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
    depositInterest(_amount: BigNumberish, overrides?: CallOverrides): Promise<void>;
    "depositSavings(uint256,address)"(
      _underlying: BigNumberish,
      _beneficiary: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    "depositSavings(uint256)"(_underlying: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    emergencyWithdraw(_withdrawAmount: BigNumberish, overrides?: CallOverrides): Promise<void>;
    exchangeRate(overrides?: CallOverrides): Promise<BigNumber>;
    fraction(overrides?: CallOverrides): Promise<BigNumber>;
    increaseAllowance(spender: string, addedValue: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
    initialize(_poker: string, _nameArg: string, _symbolArg: string, overrides?: CallOverrides): Promise<void>;
    lastBalance(overrides?: CallOverrides): Promise<BigNumber>;
    lastPoke(overrides?: CallOverrides): Promise<BigNumber>;
    name(overrides?: CallOverrides): Promise<string>;
    nexus(overrides?: CallOverrides): Promise<string>;
    poke(overrides?: CallOverrides): Promise<void>;
    poker(overrides?: CallOverrides): Promise<string>;
    preDeposit(_underlying: BigNumberish, _beneficiary: string, overrides?: CallOverrides): Promise<BigNumber>;
    redeem(_credits: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    redeemCredits(_credits: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    redeemUnderlying(_underlying: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    setConnector(_newConnector: string, overrides?: CallOverrides): Promise<void>;
    setFraction(_fraction: BigNumberish, overrides?: CallOverrides): Promise<void>;
    setPoker(_newPoker: string, overrides?: CallOverrides): Promise<void>;
    symbol(overrides?: CallOverrides): Promise<string>;
    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
    transfer(recipient: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
    transferFrom(sender: string, recipient: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
    underlying(overrides?: CallOverrides): Promise<string>;
    underlyingToCredits(_underlying: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
  };
  filters: {
    "Approval(address,address,uint256)"(
      owner?: string | null,
      spender?: string | null,
      value?: null
    ): ApprovalEventFilter;
    Approval(owner?: string | null, spender?: string | null, value?: null): ApprovalEventFilter;
    "AutomaticInterestCollectionSwitched(bool)"(
      automationEnabled?: null
    ): AutomaticInterestCollectionSwitchedEventFilter;
    AutomaticInterestCollectionSwitched(automationEnabled?: null): AutomaticInterestCollectionSwitchedEventFilter;
    "ConnectorUpdated(address)"(connector?: null): ConnectorUpdatedEventFilter;
    ConnectorUpdated(connector?: null): ConnectorUpdatedEventFilter;
    "CreditsRedeemed(address,uint256,uint256)"(
      redeemer?: string | null,
      creditsRedeemed?: null,
      savingsCredited?: null
    ): CreditsRedeemedEventFilter;
    CreditsRedeemed(
      redeemer?: string | null,
      creditsRedeemed?: null,
      savingsCredited?: null
    ): CreditsRedeemedEventFilter;
    "EmergencyUpdate()"(): EmergencyUpdateEventFilter;
    EmergencyUpdate(): EmergencyUpdateEventFilter;
    "ExchangeRateUpdated(uint256,uint256)"(
      newExchangeRate?: null,
      interestCollected?: null
    ): ExchangeRateUpdatedEventFilter;
    ExchangeRateUpdated(newExchangeRate?: null, interestCollected?: null): ExchangeRateUpdatedEventFilter;
    "FractionUpdated(uint256)"(fraction?: null): FractionUpdatedEventFilter;
    FractionUpdated(fraction?: null): FractionUpdatedEventFilter;
    "Poked(uint256,uint256,uint256)"(oldBalance?: null, newBalance?: null, interestDetected?: null): PokedEventFilter;
    Poked(oldBalance?: null, newBalance?: null, interestDetected?: null): PokedEventFilter;
    "PokedRaw()"(): PokedRawEventFilter;
    PokedRaw(): PokedRawEventFilter;
    "PokerUpdated(address)"(poker?: null): PokerUpdatedEventFilter;
    PokerUpdated(poker?: null): PokerUpdatedEventFilter;
    "SavingsDeposited(address,uint256,uint256)"(
      saver?: string | null,
      savingsDeposited?: null,
      creditsIssued?: null
    ): SavingsDepositedEventFilter;
    SavingsDeposited(saver?: string | null, savingsDeposited?: null, creditsIssued?: null): SavingsDepositedEventFilter;
    "Transfer(address,address,uint256)"(from?: string | null, to?: string | null, value?: null): TransferEventFilter;
    Transfer(from?: string | null, to?: string | null, value?: null): TransferEventFilter;
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
    automateInterestCollectionFlag(
      _enabled: boolean,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;
    balanceOfUnderlying(_user: string, overrides?: CallOverrides): Promise<BigNumber>;
    connector(overrides?: CallOverrides): Promise<BigNumber>;
    creditBalances(_user: string, overrides?: CallOverrides): Promise<BigNumber>;
    creditsToUnderlying(_credits: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    decimals(overrides?: CallOverrides): Promise<BigNumber>;
    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    depositInterest(
      _amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    "depositSavings(uint256,address)"(
      _underlying: BigNumberish,
      _beneficiary: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    "depositSavings(uint256)"(
      _underlying: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    emergencyWithdraw(
      _withdrawAmount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    exchangeRate(overrides?: CallOverrides): Promise<BigNumber>;
    fraction(overrides?: CallOverrides): Promise<BigNumber>;
    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    initialize(
      _poker: string,
      _nameArg: string,
      _symbolArg: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    lastBalance(overrides?: CallOverrides): Promise<BigNumber>;
    lastPoke(overrides?: CallOverrides): Promise<BigNumber>;
    name(overrides?: CallOverrides): Promise<BigNumber>;
    nexus(overrides?: CallOverrides): Promise<BigNumber>;
    poke(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    poker(overrides?: CallOverrides): Promise<BigNumber>;
    preDeposit(
      _underlying: BigNumberish,
      _beneficiary: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    redeem(
      _credits: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    redeemCredits(
      _credits: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    redeemUnderlying(
      _underlying: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    setConnector(
      _newConnector: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    setFraction(
      _fraction: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    setPoker(
      _newPoker: string,
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
    underlying(overrides?: CallOverrides): Promise<BigNumber>;
    underlyingToCredits(_underlying: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
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
    automateInterestCollectionFlag(
      _enabled: boolean,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    balanceOf(account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    balanceOfUnderlying(_user: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    connector(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    creditBalances(_user: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    creditsToUnderlying(_credits: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    depositInterest(
      _amount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    "depositSavings(uint256,address)"(
      _underlying: BigNumberish,
      _beneficiary: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    "depositSavings(uint256)"(
      _underlying: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    emergencyWithdraw(
      _withdrawAmount: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    exchangeRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    fraction(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    initialize(
      _poker: string,
      _nameArg: string,
      _symbolArg: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    lastBalance(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    lastPoke(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    nexus(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    poke(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    poker(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    preDeposit(
      _underlying: BigNumberish,
      _beneficiary: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    redeem(
      _credits: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    redeemCredits(
      _credits: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    redeemUnderlying(
      _underlying: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    setConnector(
      _newConnector: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    setFraction(
      _fraction: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    setPoker(
      _newPoker: string,
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
    underlying(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    underlyingToCredits(_underlying: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
