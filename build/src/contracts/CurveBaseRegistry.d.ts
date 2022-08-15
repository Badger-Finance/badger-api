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
export interface CurveBaseRegistryInterface extends utils.Interface {
  contractName: "CurveBaseRegistry";
  functions: {
    "get_registry()": FunctionFragment;
    "max_id()": FunctionFragment;
    "get_address(uint256)": FunctionFragment;
    "add_new_id(address,string)": FunctionFragment;
    "set_address(uint256,address)": FunctionFragment;
    "unset_address(uint256)": FunctionFragment;
    "commit_transfer_ownership(address)": FunctionFragment;
    "apply_transfer_ownership()": FunctionFragment;
    "revert_transfer_ownership()": FunctionFragment;
    "admin()": FunctionFragment;
    "transfer_ownership_deadline()": FunctionFragment;
    "future_admin()": FunctionFragment;
    "get_id_info(uint256)": FunctionFragment;
  };
  encodeFunctionData(functionFragment: "get_registry", values?: undefined): string;
  encodeFunctionData(functionFragment: "max_id", values?: undefined): string;
  encodeFunctionData(functionFragment: "get_address", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "add_new_id", values: [string, string]): string;
  encodeFunctionData(functionFragment: "set_address", values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: "unset_address", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "commit_transfer_ownership", values: [string]): string;
  encodeFunctionData(functionFragment: "apply_transfer_ownership", values?: undefined): string;
  encodeFunctionData(functionFragment: "revert_transfer_ownership", values?: undefined): string;
  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(functionFragment: "transfer_ownership_deadline", values?: undefined): string;
  encodeFunctionData(functionFragment: "future_admin", values?: undefined): string;
  encodeFunctionData(functionFragment: "get_id_info", values: [BigNumberish]): string;
  decodeFunctionResult(functionFragment: "get_registry", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "max_id", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_address", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "add_new_id", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "set_address", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "unset_address", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "commit_transfer_ownership", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "apply_transfer_ownership", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "revert_transfer_ownership", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "transfer_ownership_deadline", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "future_admin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_id_info", data: BytesLike): Result;
  events: {
    "NewAddressIdentifier(uint256,address,string)": EventFragment;
    "AddressModified(uint256,address,uint256)": EventFragment;
    "CommitNewAdmin(uint256,address)": EventFragment;
    "NewAdmin(address)": EventFragment;
  };
  getEvent(nameOrSignatureOrTopic: "NewAddressIdentifier"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AddressModified"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CommitNewAdmin"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NewAdmin"): EventFragment;
}
export declare type NewAddressIdentifierEvent = TypedEvent<
  [BigNumber, string, string],
  {
    id: BigNumber;
    addr: string;
    description: string;
  }
>;
export declare type NewAddressIdentifierEventFilter = TypedEventFilter<NewAddressIdentifierEvent>;
export declare type AddressModifiedEvent = TypedEvent<
  [BigNumber, string, BigNumber],
  {
    id: BigNumber;
    new_address: string;
    version: BigNumber;
  }
>;
export declare type AddressModifiedEventFilter = TypedEventFilter<AddressModifiedEvent>;
export declare type CommitNewAdminEvent = TypedEvent<
  [BigNumber, string],
  {
    deadline: BigNumber;
    admin: string;
  }
>;
export declare type CommitNewAdminEventFilter = TypedEventFilter<CommitNewAdminEvent>;
export declare type NewAdminEvent = TypedEvent<
  [string],
  {
    admin: string;
  }
>;
export declare type NewAdminEventFilter = TypedEventFilter<NewAdminEvent>;
export interface CurveBaseRegistry extends BaseContract {
  contractName: "CurveBaseRegistry";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: CurveBaseRegistryInterface;
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
    get_registry(overrides?: CallOverrides): Promise<[string]>;
    max_id(overrides?: CallOverrides): Promise<[BigNumber]>;
    get_address(_id: BigNumberish, overrides?: CallOverrides): Promise<[string]>;
    add_new_id(
      _address: string,
      _description: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    set_address(
      _id: BigNumberish,
      _address: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    unset_address(
      _id: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    commit_transfer_ownership(
      _new_admin: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    apply_transfer_ownership(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    revert_transfer_ownership(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    admin(overrides?: CallOverrides): Promise<[string]>;
    transfer_ownership_deadline(overrides?: CallOverrides): Promise<[BigNumber]>;
    future_admin(overrides?: CallOverrides): Promise<[string]>;
    get_id_info(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, boolean, BigNumber, BigNumber, string] & {
        addr: string;
        is_active: boolean;
        version: BigNumber;
        last_modified: BigNumber;
        description: string;
      }
    >;
  };
  get_registry(overrides?: CallOverrides): Promise<string>;
  max_id(overrides?: CallOverrides): Promise<BigNumber>;
  get_address(_id: BigNumberish, overrides?: CallOverrides): Promise<string>;
  add_new_id(
    _address: string,
    _description: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  set_address(
    _id: BigNumberish,
    _address: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  unset_address(
    _id: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  commit_transfer_ownership(
    _new_admin: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  apply_transfer_ownership(
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  revert_transfer_ownership(
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  admin(overrides?: CallOverrides): Promise<string>;
  transfer_ownership_deadline(overrides?: CallOverrides): Promise<BigNumber>;
  future_admin(overrides?: CallOverrides): Promise<string>;
  get_id_info(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [string, boolean, BigNumber, BigNumber, string] & {
      addr: string;
      is_active: boolean;
      version: BigNumber;
      last_modified: BigNumber;
      description: string;
    }
  >;
  callStatic: {
    get_registry(overrides?: CallOverrides): Promise<string>;
    max_id(overrides?: CallOverrides): Promise<BigNumber>;
    get_address(_id: BigNumberish, overrides?: CallOverrides): Promise<string>;
    add_new_id(_address: string, _description: string, overrides?: CallOverrides): Promise<BigNumber>;
    set_address(_id: BigNumberish, _address: string, overrides?: CallOverrides): Promise<boolean>;
    unset_address(_id: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
    commit_transfer_ownership(_new_admin: string, overrides?: CallOverrides): Promise<boolean>;
    apply_transfer_ownership(overrides?: CallOverrides): Promise<boolean>;
    revert_transfer_ownership(overrides?: CallOverrides): Promise<boolean>;
    admin(overrides?: CallOverrides): Promise<string>;
    transfer_ownership_deadline(overrides?: CallOverrides): Promise<BigNumber>;
    future_admin(overrides?: CallOverrides): Promise<string>;
    get_id_info(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, boolean, BigNumber, BigNumber, string] & {
        addr: string;
        is_active: boolean;
        version: BigNumber;
        last_modified: BigNumber;
        description: string;
      }
    >;
  };
  filters: {
    "NewAddressIdentifier(uint256,address,string)"(
      id?: BigNumberish | null,
      addr?: null,
      description?: null
    ): NewAddressIdentifierEventFilter;
    NewAddressIdentifier(id?: BigNumberish | null, addr?: null, description?: null): NewAddressIdentifierEventFilter;
    "AddressModified(uint256,address,uint256)"(
      id?: BigNumberish | null,
      new_address?: null,
      version?: null
    ): AddressModifiedEventFilter;
    AddressModified(id?: BigNumberish | null, new_address?: null, version?: null): AddressModifiedEventFilter;
    "CommitNewAdmin(uint256,address)"(deadline?: BigNumberish | null, admin?: string | null): CommitNewAdminEventFilter;
    CommitNewAdmin(deadline?: BigNumberish | null, admin?: string | null): CommitNewAdminEventFilter;
    "NewAdmin(address)"(admin?: string | null): NewAdminEventFilter;
    NewAdmin(admin?: string | null): NewAdminEventFilter;
  };
  estimateGas: {
    get_registry(overrides?: CallOverrides): Promise<BigNumber>;
    max_id(overrides?: CallOverrides): Promise<BigNumber>;
    get_address(_id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    add_new_id(
      _address: string,
      _description: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    set_address(
      _id: BigNumberish,
      _address: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    unset_address(
      _id: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    commit_transfer_ownership(
      _new_admin: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    apply_transfer_ownership(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    revert_transfer_ownership(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    admin(overrides?: CallOverrides): Promise<BigNumber>;
    transfer_ownership_deadline(overrides?: CallOverrides): Promise<BigNumber>;
    future_admin(overrides?: CallOverrides): Promise<BigNumber>;
    get_id_info(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
  };
  populateTransaction: {
    get_registry(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    max_id(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_address(_id: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    add_new_id(
      _address: string,
      _description: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    set_address(
      _id: BigNumberish,
      _address: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    unset_address(
      _id: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    commit_transfer_ownership(
      _new_admin: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    apply_transfer_ownership(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    revert_transfer_ownership(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    transfer_ownership_deadline(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    future_admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    get_id_info(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
