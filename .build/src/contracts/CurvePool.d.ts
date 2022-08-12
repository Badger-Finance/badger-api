import { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from 'ethers';
import { FunctionFragment, Result } from '@ethersproject/abi';
import { Listener, Provider } from '@ethersproject/providers';
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from './common';
export interface CurvePoolInterface extends utils.Interface {
    contractName: 'CurvePool';
    functions: {
        'coins(int128)': FunctionFragment;
        'balances(int128)': FunctionFragment;
    };
    encodeFunctionData(functionFragment: 'coins', values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: 'balances', values: [BigNumberish]): string;
    decodeFunctionResult(functionFragment: 'coins', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'balances', data: BytesLike): Result;
    events: {};
}
export interface CurvePool extends BaseContract {
    contractName: 'CurvePool';
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: CurvePoolInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        coins(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;
        balances(arg0: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    coins(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;
    balances(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        coins(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;
        balances(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {};
    estimateGas: {
        coins(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        balances(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        coins(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        balances(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
