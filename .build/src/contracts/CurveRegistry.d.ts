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
export interface CurveRegistryInterface extends utils.Interface {
  contractName: "CurveRegistry";
  functions: {
    "find_pool_for_coins(address,address)": FunctionFragment;
    "get_n_coins(address)": FunctionFragment;
    "get_coins(address)": FunctionFragment;
    "get_underlying_coins(address)": FunctionFragment;
    "get_decimals(address)": FunctionFragment;
    "get_underlying_decimals(address)": FunctionFragment;
    "get_rates(address)": FunctionFragment;
    "get_gauges(address)": FunctionFragment;
    "get_balances(address)": FunctionFragment;
    "get_underlying_balances(address)": FunctionFragment;
    "get_virtual_price_from_lp_token(address)": FunctionFragment;
    "get_A(address)": FunctionFragment;
    "get_parameters(address)": FunctionFragment;
    "get_fees(address)": FunctionFragment;
    "get_admin_balances(address)": FunctionFragment;
    "get_coin_indices(address,address,address)": FunctionFragment;
    "estimate_gas_used(address,address,address)": FunctionFragment;
    "is_meta(address)": FunctionFragment;
    "get_pool_name(address)": FunctionFragment;
    "get_coin_swap_count(address)": FunctionFragment;
    "get_coin_swap_complement(address,uint256)": FunctionFragment;
    "get_pool_asset_type(address)": FunctionFragment;
    "add_pool(address,uint256,address,bytes32,uint256,uint256,bool,bool,string)": FunctionFragment;
    "add_pool_without_underlying(address,uint256,address,bytes32,uint256,uint256,bool,bool,string)": FunctionFragment;
    "add_metapool(address,uint256,address,uint256,string)": FunctionFragment;
    "remove_pool(address)": FunctionFragment;
    "set_pool_gas_estimates(address[5],uint256[2][5])": FunctionFragment;
    "set_coin_gas_estimates(address[10],uint256[10])": FunctionFragment;
    "set_gas_estimate_contract(address,address)": FunctionFragment;
    "set_liquidity_gauges(address,address[10])": FunctionFragment;
    "set_pool_asset_type(address,uint256)": FunctionFragment;
    "batch_set_pool_asset_type(address[32],uint256[32])": FunctionFragment;
    "address_provider()": FunctionFragment;
    "gauge_controller()": FunctionFragment;
    "pool_list(uint256)": FunctionFragment;
    "pool_count()": FunctionFragment;
    "coin_count()": FunctionFragment;
    "get_coin(uint256)": FunctionFragment;
    "get_pool_from_lp_token(address)": FunctionFragment;
    "get_lp_token(address)": FunctionFragment;
    "last_updated()": FunctionFragment;
  };
  encodeFunctionData(functionFragment: "find_pool_for_coins", values: [string, string]): string;
  encodeFunctionData(functionFragment: "get_n_coins", values: [string]): string;
  encodeFunctionData(functionFragment: "get_coins", values: [string]): string;
  encodeFunctionData(functionFragment: "get_underlying_coins", values: [string]): string;
  encodeFunctionData(functionFragment: "get_decimals", values: [string]): string;
  encodeFunctionData(functionFragment: "get_underlying_decimals", values: [string]): string;
  encodeFunctionData(functionFragment: "get_rates", values: [string]): string;
  encodeFunctionData(functionFragment: "get_gauges", values: [string]): string;
  encodeFunctionData(functionFragment: "get_balances", values: [string]): string;
  encodeFunctionData(functionFragment: "get_underlying_balances", values: [string]): string;
  encodeFunctionData(functionFragment: "get_virtual_price_from_lp_token", values: [string]): string;
  encodeFunctionData(functionFragment: "get_A", values: [string]): string;
  encodeFunctionData(functionFragment: "get_parameters", values: [string]): string;
  encodeFunctionData(functionFragment: "get_fees", values: [string]): string;
  encodeFunctionData(functionFragment: "get_admin_balances", values: [string]): string;
  encodeFunctionData(functionFragment: "get_coin_indices", values: [string, string, string]): string;
  encodeFunctionData(functionFragment: "estimate_gas_used", values: [string, string, string]): string;
  encodeFunctionData(functionFragment: "is_meta", values: [string]): string;
  encodeFunctionData(functionFragment: "get_pool_name", values: [string]): string;
  encodeFunctionData(functionFragment: "get_coin_swap_count", values: [string]): string;
  encodeFunctionData(functionFragment: "get_coin_swap_complement", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "get_pool_asset_type", values: [string]): string;
  encodeFunctionData(
    functionFragment: "add_pool",
    values: [string, BigNumberish, string, BytesLike, BigNumberish, BigNumberish, boolean, boolean, string]
  ): string;
  encodeFunctionData(
    functionFragment: "add_pool_without_underlying",
    values: [string, BigNumberish, string, BytesLike, BigNumberish, BigNumberish, boolean, boolean, string]
  ): string;
  encodeFunctionData(
    functionFragment: "add_metapool",
    values: [string, BigNumberish, string, BigNumberish, string]
  ): string;
  encodeFunctionData(functionFragment: "remove_pool", values: [string]): string;
  encodeFunctionData(
    functionFragment: "set_pool_gas_estimates",
    values: [
      [string, string, string, string, string],
      [
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish]
      ]
    ]
  ): string;
  encodeFunctionData(functionFragment: "set_coin_gas_estimates", values: [string[], BigNumberish[]]): string;
  encodeFunctionData(functionFragment: "set_gas_estimate_contract", values: [string, string]): string;
  encodeFunctionData(functionFragment: "set_liquidity_gauges", values: [string, string[]]): string;
  encodeFunctionData(functionFragment: "set_pool_asset_type", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "batch_set_pool_asset_type", values: [string[], BigNumberish[]]): string;
  encodeFunctionData(functionFragment: "address_provider", values?: undefined): string;
  encodeFunctionData(functionFragment: "gauge_controller", values?: undefined): string;
  encodeFunctionData(functionFragment: "pool_list", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "pool_count", values?: undefined): string;
  encodeFunctionData(functionFragment: "coin_count", values?: undefined): string;
  encodeFunctionData(functionFragment: "get_coin", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "get_pool_from_lp_token", values: [string]): string;
  encodeFunctionData(functionFragment: "get_lp_token", values: [string]): string;
  encodeFunctionData(functionFragment: "last_updated", values?: undefined): string;
  decodeFunctionResult(functionFragment: "find_pool_for_coins", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_n_coins", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_coins", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_underlying_coins", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_decimals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_underlying_decimals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_rates", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_gauges", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_balances", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_underlying_balances", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_virtual_price_from_lp_token", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_A", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_parameters", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_fees", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_admin_balances", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_coin_indices", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "estimate_gas_used", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "is_meta", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_pool_name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_coin_swap_count", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_coin_swap_complement", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_pool_asset_type", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "add_pool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "add_pool_without_underlying", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "add_metapool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "remove_pool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "set_pool_gas_estimates", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "set_coin_gas_estimates", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "set_gas_estimate_contract", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "set_liquidity_gauges", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "set_pool_asset_type", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "batch_set_pool_asset_type", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "address_provider", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "gauge_controller", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pool_list", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pool_count", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "coin_count", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_coin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_pool_from_lp_token", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_lp_token", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "last_updated", data: BytesLike): Result;
  events: {
    "PoolAdded(address,bytes)": EventFragment;
    "PoolRemoved(address)": EventFragment;
  };
  getEvent(nameOrSignatureOrTopic: "PoolAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PoolRemoved"): EventFragment;
}
export declare type PoolAddedEvent = TypedEvent<
  [string, string],
  {
    pool: string;
    rate_method_id: string;
  }
>;
export declare type PoolAddedEventFilter = TypedEventFilter<PoolAddedEvent>;
export declare type PoolRemovedEvent = TypedEvent<
  [string],
  {
    pool: string;
  }
>;
export declare type PoolRemovedEventFilter = TypedEventFilter<PoolRemovedEvent>;
export interface CurveRegistry extends BaseContract {
  contractName: "CurveRegistry";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: CurveRegistryInterface;
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
    "find_pool_for_coins(address,address)"(_from: string, _to: string, overrides?: CallOverrides): Promise<[string]>;
    "find_pool_for_coins(address,address,uint256)"(
      _from: string,
      _to: string,
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;
    get_n_coins(_pool: string, overrides?: CallOverrides): Promise<[[BigNumber, BigNumber]]>;
    get_coins(_pool: string, overrides?: CallOverrides): Promise<[string[]]>;
    get_underlying_coins(_pool: string, overrides?: CallOverrides): Promise<[string[]]>;
    get_decimals(_pool: string, overrides?: CallOverrides): Promise<[BigNumber[]]>;
    get_underlying_decimals(_pool: string, overrides?: CallOverrides): Promise<[BigNumber[]]>;
    get_rates(_pool: string, overrides?: CallOverrides): Promise<[BigNumber[]]>;
    get_gauges(_pool: string, overrides?: CallOverrides): Promise<[string[], BigNumber[]]>;
    get_balances(_pool: string, overrides?: CallOverrides): Promise<[BigNumber[]]>;
    get_underlying_balances(_pool: string, overrides?: CallOverrides): Promise<[BigNumber[]]>;
    get_virtual_price_from_lp_token(_token: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    get_A(_pool: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    get_parameters(
      _pool: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, string, BigNumber, BigNumber, BigNumber] & {
        A: BigNumber;
        future_A: BigNumber;
        fee: BigNumber;
        admin_fee: BigNumber;
        future_fee: BigNumber;
        future_admin_fee: BigNumber;
        future_owner: string;
        initial_A: BigNumber;
        initial_A_time: BigNumber;
        future_A_time: BigNumber;
      }
    >;
    get_fees(_pool: string, overrides?: CallOverrides): Promise<[[BigNumber, BigNumber]]>;
    get_admin_balances(_pool: string, overrides?: CallOverrides): Promise<[BigNumber[]]>;
    get_coin_indices(
      _pool: string,
      _from: string,
      _to: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber, boolean]>;
    estimate_gas_used(_pool: string, _from: string, _to: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    is_meta(_pool: string, overrides?: CallOverrides): Promise<[boolean]>;
    get_pool_name(_pool: string, overrides?: CallOverrides): Promise<[string]>;
    get_coin_swap_count(_coin: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    get_coin_swap_complement(_coin: string, _index: BigNumberish, overrides?: CallOverrides): Promise<[string]>;
    get_pool_asset_type(_pool: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    add_pool(
      _pool: string,
      _n_coins: BigNumberish,
      _lp_token: string,
      _rate_info: BytesLike,
      _decimals: BigNumberish,
      _underlying_decimals: BigNumberish,
      _has_initial_A: boolean,
      _is_v1: boolean,
      _name: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    add_pool_without_underlying(
      _pool: string,
      _n_coins: BigNumberish,
      _lp_token: string,
      _rate_info: BytesLike,
      _decimals: BigNumberish,
      _use_rates: BigNumberish,
      _has_initial_A: boolean,
      _is_v1: boolean,
      _name: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    "add_metapool(address,uint256,address,uint256,string)"(
      _pool: string,
      _n_coins: BigNumberish,
      _lp_token: string,
      _decimals: BigNumberish,
      _name: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    "add_metapool(address,uint256,address,uint256,string,address)"(
      _pool: string,
      _n_coins: BigNumberish,
      _lp_token: string,
      _decimals: BigNumberish,
      _name: string,
      _base_pool: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    remove_pool(
      _pool: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    set_pool_gas_estimates(
      _addr: [string, string, string, string, string],
      _amount: [
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish]
      ],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    set_coin_gas_estimates(
      _addr: string[],
      _amount: BigNumberish[],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    set_gas_estimate_contract(
      _pool: string,
      _estimator: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    set_liquidity_gauges(
      _pool: string,
      _liquidity_gauges: string[],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    set_pool_asset_type(
      _pool: string,
      _asset_type: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    batch_set_pool_asset_type(
      _pools: string[],
      _asset_types: BigNumberish[],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    address_provider(overrides?: CallOverrides): Promise<[string]>;
    gauge_controller(overrides?: CallOverrides): Promise<[string]>;
    pool_list(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;
    pool_count(overrides?: CallOverrides): Promise<[BigNumber]>;
    coin_count(overrides?: CallOverrides): Promise<[BigNumber]>;
    get_coin(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;
    get_pool_from_lp_token(arg0: string, overrides?: CallOverrides): Promise<[string]>;
    get_lp_token(arg0: string, overrides?: CallOverrides): Promise<[string]>;
    last_updated(overrides?: CallOverrides): Promise<[BigNumber]>;
  };
  "find_pool_for_coins(address,address)"(_from: string, _to: string, overrides?: CallOverrides): Promise<string>;
  "find_pool_for_coins(address,address,uint256)"(
    _from: string,
    _to: string,
    i: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;
  get_n_coins(_pool: string, overrides?: CallOverrides): Promise<[BigNumber, BigNumber]>;
  get_coins(_pool: string, overrides?: CallOverrides): Promise<string[]>;
  get_underlying_coins(_pool: string, overrides?: CallOverrides): Promise<string[]>;
  get_decimals(_pool: string, overrides?: CallOverrides): Promise<BigNumber[]>;
  get_underlying_decimals(_pool: string, overrides?: CallOverrides): Promise<BigNumber[]>;
  get_rates(_pool: string, overrides?: CallOverrides): Promise<BigNumber[]>;
  get_gauges(_pool: string, overrides?: CallOverrides): Promise<[string[], BigNumber[]]>;
  get_balances(_pool: string, overrides?: CallOverrides): Promise<BigNumber[]>;
  get_underlying_balances(_pool: string, overrides?: CallOverrides): Promise<BigNumber[]>;
  get_virtual_price_from_lp_token(_token: string, overrides?: CallOverrides): Promise<BigNumber>;
  get_A(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
  get_parameters(
    _pool: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, string, BigNumber, BigNumber, BigNumber] & {
      A: BigNumber;
      future_A: BigNumber;
      fee: BigNumber;
      admin_fee: BigNumber;
      future_fee: BigNumber;
      future_admin_fee: BigNumber;
      future_owner: string;
      initial_A: BigNumber;
      initial_A_time: BigNumber;
      future_A_time: BigNumber;
    }
  >;
  get_fees(_pool: string, overrides?: CallOverrides): Promise<[BigNumber, BigNumber]>;
  get_admin_balances(_pool: string, overrides?: CallOverrides): Promise<BigNumber[]>;
  get_coin_indices(
    _pool: string,
    _from: string,
    _to: string,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber, boolean]>;
  estimate_gas_used(_pool: string, _from: string, _to: string, overrides?: CallOverrides): Promise<BigNumber>;
  is_meta(_pool: string, overrides?: CallOverrides): Promise<boolean>;
  get_pool_name(_pool: string, overrides?: CallOverrides): Promise<string>;
  get_coin_swap_count(_coin: string, overrides?: CallOverrides): Promise<BigNumber>;
  get_coin_swap_complement(_coin: string, _index: BigNumberish, overrides?: CallOverrides): Promise<string>;
  get_pool_asset_type(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
  add_pool(
    _pool: string,
    _n_coins: BigNumberish,
    _lp_token: string,
    _rate_info: BytesLike,
    _decimals: BigNumberish,
    _underlying_decimals: BigNumberish,
    _has_initial_A: boolean,
    _is_v1: boolean,
    _name: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  add_pool_without_underlying(
    _pool: string,
    _n_coins: BigNumberish,
    _lp_token: string,
    _rate_info: BytesLike,
    _decimals: BigNumberish,
    _use_rates: BigNumberish,
    _has_initial_A: boolean,
    _is_v1: boolean,
    _name: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  "add_metapool(address,uint256,address,uint256,string)"(
    _pool: string,
    _n_coins: BigNumberish,
    _lp_token: string,
    _decimals: BigNumberish,
    _name: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  "add_metapool(address,uint256,address,uint256,string,address)"(
    _pool: string,
    _n_coins: BigNumberish,
    _lp_token: string,
    _decimals: BigNumberish,
    _name: string,
    _base_pool: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  remove_pool(
    _pool: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  set_pool_gas_estimates(
    _addr: [string, string, string, string, string],
    _amount: [
      [BigNumberish, BigNumberish],
      [BigNumberish, BigNumberish],
      [BigNumberish, BigNumberish],
      [BigNumberish, BigNumberish],
      [BigNumberish, BigNumberish]
    ],
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  set_coin_gas_estimates(
    _addr: string[],
    _amount: BigNumberish[],
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  set_gas_estimate_contract(
    _pool: string,
    _estimator: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  set_liquidity_gauges(
    _pool: string,
    _liquidity_gauges: string[],
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  set_pool_asset_type(
    _pool: string,
    _asset_type: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  batch_set_pool_asset_type(
    _pools: string[],
    _asset_types: BigNumberish[],
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  address_provider(overrides?: CallOverrides): Promise<string>;
  gauge_controller(overrides?: CallOverrides): Promise<string>;
  pool_list(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;
  pool_count(overrides?: CallOverrides): Promise<BigNumber>;
  coin_count(overrides?: CallOverrides): Promise<BigNumber>;
  get_coin(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;
  get_pool_from_lp_token(arg0: string, overrides?: CallOverrides): Promise<string>;
  get_lp_token(arg0: string, overrides?: CallOverrides): Promise<string>;
  last_updated(overrides?: CallOverrides): Promise<BigNumber>;
  callStatic: {
    "find_pool_for_coins(address,address)"(_from: string, _to: string, overrides?: CallOverrides): Promise<string>;
    "find_pool_for_coins(address,address,uint256)"(
      _from: string,
      _to: string,
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;
    get_n_coins(_pool: string, overrides?: CallOverrides): Promise<[BigNumber, BigNumber]>;
    get_coins(_pool: string, overrides?: CallOverrides): Promise<string[]>;
    get_underlying_coins(_pool: string, overrides?: CallOverrides): Promise<string[]>;
    get_decimals(_pool: string, overrides?: CallOverrides): Promise<BigNumber[]>;
    get_underlying_decimals(_pool: string, overrides?: CallOverrides): Promise<BigNumber[]>;
    get_rates(_pool: string, overrides?: CallOverrides): Promise<BigNumber[]>;
    get_gauges(_pool: string, overrides?: CallOverrides): Promise<[string[], BigNumber[]]>;
    get_balances(_pool: string, overrides?: CallOverrides): Promise<BigNumber[]>;
    get_underlying_balances(_pool: string, overrides?: CallOverrides): Promise<BigNumber[]>;
    get_virtual_price_from_lp_token(_token: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_A(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_parameters(
      _pool: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, string, BigNumber, BigNumber, BigNumber] & {
        A: BigNumber;
        future_A: BigNumber;
        fee: BigNumber;
        admin_fee: BigNumber;
        future_fee: BigNumber;
        future_admin_fee: BigNumber;
        future_owner: string;
        initial_A: BigNumber;
        initial_A_time: BigNumber;
        future_A_time: BigNumber;
      }
    >;
    get_fees(_pool: string, overrides?: CallOverrides): Promise<[BigNumber, BigNumber]>;
    get_admin_balances(_pool: string, overrides?: CallOverrides): Promise<BigNumber[]>;
    get_coin_indices(
      _pool: string,
      _from: string,
      _to: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber, boolean]>;
    estimate_gas_used(_pool: string, _from: string, _to: string, overrides?: CallOverrides): Promise<BigNumber>;
    is_meta(_pool: string, overrides?: CallOverrides): Promise<boolean>;
    get_pool_name(_pool: string, overrides?: CallOverrides): Promise<string>;
    get_coin_swap_count(_coin: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_coin_swap_complement(_coin: string, _index: BigNumberish, overrides?: CallOverrides): Promise<string>;
    get_pool_asset_type(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
    add_pool(
      _pool: string,
      _n_coins: BigNumberish,
      _lp_token: string,
      _rate_info: BytesLike,
      _decimals: BigNumberish,
      _underlying_decimals: BigNumberish,
      _has_initial_A: boolean,
      _is_v1: boolean,
      _name: string,
      overrides?: CallOverrides
    ): Promise<void>;
    add_pool_without_underlying(
      _pool: string,
      _n_coins: BigNumberish,
      _lp_token: string,
      _rate_info: BytesLike,
      _decimals: BigNumberish,
      _use_rates: BigNumberish,
      _has_initial_A: boolean,
      _is_v1: boolean,
      _name: string,
      overrides?: CallOverrides
    ): Promise<void>;
    "add_metapool(address,uint256,address,uint256,string)"(
      _pool: string,
      _n_coins: BigNumberish,
      _lp_token: string,
      _decimals: BigNumberish,
      _name: string,
      overrides?: CallOverrides
    ): Promise<void>;
    "add_metapool(address,uint256,address,uint256,string,address)"(
      _pool: string,
      _n_coins: BigNumberish,
      _lp_token: string,
      _decimals: BigNumberish,
      _name: string,
      _base_pool: string,
      overrides?: CallOverrides
    ): Promise<void>;
    remove_pool(_pool: string, overrides?: CallOverrides): Promise<void>;
    set_pool_gas_estimates(
      _addr: [string, string, string, string, string],
      _amount: [
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish]
      ],
      overrides?: CallOverrides
    ): Promise<void>;
    set_coin_gas_estimates(_addr: string[], _amount: BigNumberish[], overrides?: CallOverrides): Promise<void>;
    set_gas_estimate_contract(_pool: string, _estimator: string, overrides?: CallOverrides): Promise<void>;
    set_liquidity_gauges(_pool: string, _liquidity_gauges: string[], overrides?: CallOverrides): Promise<void>;
    set_pool_asset_type(_pool: string, _asset_type: BigNumberish, overrides?: CallOverrides): Promise<void>;
    batch_set_pool_asset_type(_pools: string[], _asset_types: BigNumberish[], overrides?: CallOverrides): Promise<void>;
    address_provider(overrides?: CallOverrides): Promise<string>;
    gauge_controller(overrides?: CallOverrides): Promise<string>;
    pool_list(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;
    pool_count(overrides?: CallOverrides): Promise<BigNumber>;
    coin_count(overrides?: CallOverrides): Promise<BigNumber>;
    get_coin(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;
    get_pool_from_lp_token(arg0: string, overrides?: CallOverrides): Promise<string>;
    get_lp_token(arg0: string, overrides?: CallOverrides): Promise<string>;
    last_updated(overrides?: CallOverrides): Promise<BigNumber>;
  };
  filters: {
    "PoolAdded(address,bytes)"(pool?: string | null, rate_method_id?: null): PoolAddedEventFilter;
    PoolAdded(pool?: string | null, rate_method_id?: null): PoolAddedEventFilter;
    "PoolRemoved(address)"(pool?: string | null): PoolRemovedEventFilter;
    PoolRemoved(pool?: string | null): PoolRemovedEventFilter;
  };
  estimateGas: {
    "find_pool_for_coins(address,address)"(_from: string, _to: string, overrides?: CallOverrides): Promise<BigNumber>;
    "find_pool_for_coins(address,address,uint256)"(
      _from: string,
      _to: string,
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    get_n_coins(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_coins(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_underlying_coins(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_decimals(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_underlying_decimals(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_rates(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_gauges(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_balances(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_underlying_balances(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_virtual_price_from_lp_token(_token: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_A(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_parameters(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_fees(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_admin_balances(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_coin_indices(_pool: string, _from: string, _to: string, overrides?: CallOverrides): Promise<BigNumber>;
    estimate_gas_used(_pool: string, _from: string, _to: string, overrides?: CallOverrides): Promise<BigNumber>;
    is_meta(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_pool_name(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_coin_swap_count(_coin: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_coin_swap_complement(_coin: string, _index: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    get_pool_asset_type(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;
    add_pool(
      _pool: string,
      _n_coins: BigNumberish,
      _lp_token: string,
      _rate_info: BytesLike,
      _decimals: BigNumberish,
      _underlying_decimals: BigNumberish,
      _has_initial_A: boolean,
      _is_v1: boolean,
      _name: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    add_pool_without_underlying(
      _pool: string,
      _n_coins: BigNumberish,
      _lp_token: string,
      _rate_info: BytesLike,
      _decimals: BigNumberish,
      _use_rates: BigNumberish,
      _has_initial_A: boolean,
      _is_v1: boolean,
      _name: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    "add_metapool(address,uint256,address,uint256,string)"(
      _pool: string,
      _n_coins: BigNumberish,
      _lp_token: string,
      _decimals: BigNumberish,
      _name: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    "add_metapool(address,uint256,address,uint256,string,address)"(
      _pool: string,
      _n_coins: BigNumberish,
      _lp_token: string,
      _decimals: BigNumberish,
      _name: string,
      _base_pool: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    remove_pool(
      _pool: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    set_pool_gas_estimates(
      _addr: [string, string, string, string, string],
      _amount: [
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish]
      ],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    set_coin_gas_estimates(
      _addr: string[],
      _amount: BigNumberish[],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    set_gas_estimate_contract(
      _pool: string,
      _estimator: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    set_liquidity_gauges(
      _pool: string,
      _liquidity_gauges: string[],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    set_pool_asset_type(
      _pool: string,
      _asset_type: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    batch_set_pool_asset_type(
      _pools: string[],
      _asset_types: BigNumberish[],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    address_provider(overrides?: CallOverrides): Promise<BigNumber>;
    gauge_controller(overrides?: CallOverrides): Promise<BigNumber>;
    pool_list(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    pool_count(overrides?: CallOverrides): Promise<BigNumber>;
    coin_count(overrides?: CallOverrides): Promise<BigNumber>;
    get_coin(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    get_pool_from_lp_token(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    get_lp_token(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    last_updated(overrides?: CallOverrides): Promise<BigNumber>;
  };
  populateTransaction: {
    "find_pool_for_coins(address,address)"(
      _from: string,
      _to: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    "find_pool_for_coins(address,address,uint256)"(
      _from: string,
      _to: string,
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    get_n_coins(_pool: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_coins(_pool: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_underlying_coins(_pool: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_decimals(_pool: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_underlying_decimals(_pool: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_rates(_pool: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_gauges(_pool: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_balances(_pool: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_underlying_balances(_pool: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_virtual_price_from_lp_token(_token: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_A(_pool: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_parameters(_pool: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_fees(_pool: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_admin_balances(_pool: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_coin_indices(
      _pool: string,
      _from: string,
      _to: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    estimate_gas_used(
      _pool: string,
      _from: string,
      _to: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    is_meta(_pool: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_pool_name(_pool: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_coin_swap_count(_coin: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_coin_swap_complement(
      _coin: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    get_pool_asset_type(_pool: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    add_pool(
      _pool: string,
      _n_coins: BigNumberish,
      _lp_token: string,
      _rate_info: BytesLike,
      _decimals: BigNumberish,
      _underlying_decimals: BigNumberish,
      _has_initial_A: boolean,
      _is_v1: boolean,
      _name: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    add_pool_without_underlying(
      _pool: string,
      _n_coins: BigNumberish,
      _lp_token: string,
      _rate_info: BytesLike,
      _decimals: BigNumberish,
      _use_rates: BigNumberish,
      _has_initial_A: boolean,
      _is_v1: boolean,
      _name: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    "add_metapool(address,uint256,address,uint256,string)"(
      _pool: string,
      _n_coins: BigNumberish,
      _lp_token: string,
      _decimals: BigNumberish,
      _name: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    "add_metapool(address,uint256,address,uint256,string,address)"(
      _pool: string,
      _n_coins: BigNumberish,
      _lp_token: string,
      _decimals: BigNumberish,
      _name: string,
      _base_pool: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    remove_pool(
      _pool: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    set_pool_gas_estimates(
      _addr: [string, string, string, string, string],
      _amount: [
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish],
        [BigNumberish, BigNumberish]
      ],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    set_coin_gas_estimates(
      _addr: string[],
      _amount: BigNumberish[],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    set_gas_estimate_contract(
      _pool: string,
      _estimator: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    set_liquidity_gauges(
      _pool: string,
      _liquidity_gauges: string[],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    set_pool_asset_type(
      _pool: string,
      _asset_type: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    batch_set_pool_asset_type(
      _pools: string[],
      _asset_types: BigNumberish[],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    address_provider(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    gauge_controller(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    pool_list(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    pool_count(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    coin_count(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_coin(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_pool_from_lp_token(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_lp_token(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    last_updated(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
