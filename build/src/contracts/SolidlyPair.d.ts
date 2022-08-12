import { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from 'ethers';
import { FunctionFragment, Result, EventFragment } from '@ethersproject/abi';
import { Listener, Provider } from '@ethersproject/providers';
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from './common';
export declare namespace BaseV1Pair {
    type ObservationStruct = {
        timestamp: BigNumberish;
        reserve0Cumulative: BigNumberish;
        reserve1Cumulative: BigNumberish;
    };
    type ObservationStructOutput = [BigNumber, BigNumber, BigNumber] & {
        timestamp: BigNumber;
        reserve0Cumulative: BigNumber;
        reserve1Cumulative: BigNumber;
    };
}
export interface SolidlyPairInterface extends utils.Interface {
    contractName: 'SolidlyPair';
    functions: {
        'allowance(address,address)': FunctionFragment;
        'approve(address,uint256)': FunctionFragment;
        'balanceOf(address)': FunctionFragment;
        'blockTimestampLast()': FunctionFragment;
        'burn(address)': FunctionFragment;
        'claimFees()': FunctionFragment;
        'claimable0(address)': FunctionFragment;
        'claimable1(address)': FunctionFragment;
        'current(address,uint256)': FunctionFragment;
        'currentCumulativePrices()': FunctionFragment;
        'decimals()': FunctionFragment;
        'fees()': FunctionFragment;
        'getAmountOut(uint256,address)': FunctionFragment;
        'getReserves()': FunctionFragment;
        'index0()': FunctionFragment;
        'index1()': FunctionFragment;
        'lastObservation()': FunctionFragment;
        'metadata()': FunctionFragment;
        'mint(address)': FunctionFragment;
        'name()': FunctionFragment;
        'nonces(address)': FunctionFragment;
        'observationLength()': FunctionFragment;
        'observations(uint256)': FunctionFragment;
        'permit(address,address,uint256,uint256,uint8,bytes32,bytes32)': FunctionFragment;
        'prices(address,uint256,uint256)': FunctionFragment;
        'quote(address,uint256,uint256)': FunctionFragment;
        'reserve0()': FunctionFragment;
        'reserve0CumulativeLast()': FunctionFragment;
        'reserve1()': FunctionFragment;
        'reserve1CumulativeLast()': FunctionFragment;
        'sample(address,uint256,uint256,uint256)': FunctionFragment;
        'skim(address)': FunctionFragment;
        'stable()': FunctionFragment;
        'supplyIndex0(address)': FunctionFragment;
        'supplyIndex1(address)': FunctionFragment;
        'swap(uint256,uint256,address,bytes)': FunctionFragment;
        'symbol()': FunctionFragment;
        'sync()': FunctionFragment;
        'token0()': FunctionFragment;
        'token1()': FunctionFragment;
        'tokens()': FunctionFragment;
        'totalSupply()': FunctionFragment;
        'transfer(address,uint256)': FunctionFragment;
        'transferFrom(address,address,uint256)': FunctionFragment;
    };
    encodeFunctionData(functionFragment: 'allowance', values: [string, string]): string;
    encodeFunctionData(functionFragment: 'approve', values: [string, BigNumberish]): string;
    encodeFunctionData(functionFragment: 'balanceOf', values: [string]): string;
    encodeFunctionData(functionFragment: 'blockTimestampLast', values?: undefined): string;
    encodeFunctionData(functionFragment: 'burn', values: [string]): string;
    encodeFunctionData(functionFragment: 'claimFees', values?: undefined): string;
    encodeFunctionData(functionFragment: 'claimable0', values: [string]): string;
    encodeFunctionData(functionFragment: 'claimable1', values: [string]): string;
    encodeFunctionData(functionFragment: 'current', values: [string, BigNumberish]): string;
    encodeFunctionData(functionFragment: 'currentCumulativePrices', values?: undefined): string;
    encodeFunctionData(functionFragment: 'decimals', values?: undefined): string;
    encodeFunctionData(functionFragment: 'fees', values?: undefined): string;
    encodeFunctionData(functionFragment: 'getAmountOut', values: [BigNumberish, string]): string;
    encodeFunctionData(functionFragment: 'getReserves', values?: undefined): string;
    encodeFunctionData(functionFragment: 'index0', values?: undefined): string;
    encodeFunctionData(functionFragment: 'index1', values?: undefined): string;
    encodeFunctionData(functionFragment: 'lastObservation', values?: undefined): string;
    encodeFunctionData(functionFragment: 'metadata', values?: undefined): string;
    encodeFunctionData(functionFragment: 'mint', values: [string]): string;
    encodeFunctionData(functionFragment: 'name', values?: undefined): string;
    encodeFunctionData(functionFragment: 'nonces', values: [string]): string;
    encodeFunctionData(functionFragment: 'observationLength', values?: undefined): string;
    encodeFunctionData(functionFragment: 'observations', values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: 'permit', values: [string, string, BigNumberish, BigNumberish, BigNumberish, BytesLike, BytesLike]): string;
    encodeFunctionData(functionFragment: 'prices', values: [string, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: 'quote', values: [string, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: 'reserve0', values?: undefined): string;
    encodeFunctionData(functionFragment: 'reserve0CumulativeLast', values?: undefined): string;
    encodeFunctionData(functionFragment: 'reserve1', values?: undefined): string;
    encodeFunctionData(functionFragment: 'reserve1CumulativeLast', values?: undefined): string;
    encodeFunctionData(functionFragment: 'sample', values: [string, BigNumberish, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: 'skim', values: [string]): string;
    encodeFunctionData(functionFragment: 'stable', values?: undefined): string;
    encodeFunctionData(functionFragment: 'supplyIndex0', values: [string]): string;
    encodeFunctionData(functionFragment: 'supplyIndex1', values: [string]): string;
    encodeFunctionData(functionFragment: 'swap', values: [BigNumberish, BigNumberish, string, BytesLike]): string;
    encodeFunctionData(functionFragment: 'symbol', values?: undefined): string;
    encodeFunctionData(functionFragment: 'sync', values?: undefined): string;
    encodeFunctionData(functionFragment: 'token0', values?: undefined): string;
    encodeFunctionData(functionFragment: 'token1', values?: undefined): string;
    encodeFunctionData(functionFragment: 'tokens', values?: undefined): string;
    encodeFunctionData(functionFragment: 'totalSupply', values?: undefined): string;
    encodeFunctionData(functionFragment: 'transfer', values: [string, BigNumberish]): string;
    encodeFunctionData(functionFragment: 'transferFrom', values: [string, string, BigNumberish]): string;
    decodeFunctionResult(functionFragment: 'allowance', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'approve', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'blockTimestampLast', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'burn', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'claimFees', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'claimable0', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'claimable1', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'current', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'currentCumulativePrices', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'decimals', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'fees', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'getAmountOut', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'getReserves', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'index0', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'index1', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'lastObservation', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'metadata', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'mint', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'name', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'nonces', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'observationLength', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'observations', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'permit', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'prices', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'quote', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'reserve0', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'reserve0CumulativeLast', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'reserve1', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'reserve1CumulativeLast', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'sample', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'skim', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'stable', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'supplyIndex0', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'supplyIndex1', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'swap', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'symbol', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'sync', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'token0', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'token1', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'tokens', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'totalSupply', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'transfer', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'transferFrom', data: BytesLike): Result;
    events: {
        'Approval(address,address,uint256)': EventFragment;
        'Burn(address,uint256,uint256,address)': EventFragment;
        'Claim(address,address,uint256,uint256)': EventFragment;
        'Fees(address,uint256,uint256)': EventFragment;
        'Mint(address,uint256,uint256)': EventFragment;
        'Swap(address,uint256,uint256,uint256,uint256,address)': EventFragment;
        'Sync(uint256,uint256)': EventFragment;
        'Transfer(address,address,uint256)': EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: 'Approval'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'Burn'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'Claim'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'Fees'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'Mint'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'Swap'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'Sync'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'Transfer'): EventFragment;
}
export declare type ApprovalEvent = TypedEvent<[
    string,
    string,
    BigNumber
], {
    owner: string;
    spender: string;
    amount: BigNumber;
}>;
export declare type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;
export declare type BurnEvent = TypedEvent<[
    string,
    BigNumber,
    BigNumber,
    string
], {
    sender: string;
    amount0: BigNumber;
    amount1: BigNumber;
    to: string;
}>;
export declare type BurnEventFilter = TypedEventFilter<BurnEvent>;
export declare type ClaimEvent = TypedEvent<[
    string,
    string,
    BigNumber,
    BigNumber
], {
    sender: string;
    recipient: string;
    amount0: BigNumber;
    amount1: BigNumber;
}>;
export declare type ClaimEventFilter = TypedEventFilter<ClaimEvent>;
export declare type FeesEvent = TypedEvent<[
    string,
    BigNumber,
    BigNumber
], {
    sender: string;
    amount0: BigNumber;
    amount1: BigNumber;
}>;
export declare type FeesEventFilter = TypedEventFilter<FeesEvent>;
export declare type MintEvent = TypedEvent<[
    string,
    BigNumber,
    BigNumber
], {
    sender: string;
    amount0: BigNumber;
    amount1: BigNumber;
}>;
export declare type MintEventFilter = TypedEventFilter<MintEvent>;
export declare type SwapEvent = TypedEvent<[
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    string
], {
    sender: string;
    amount0In: BigNumber;
    amount1In: BigNumber;
    amount0Out: BigNumber;
    amount1Out: BigNumber;
    to: string;
}>;
export declare type SwapEventFilter = TypedEventFilter<SwapEvent>;
export declare type SyncEvent = TypedEvent<[BigNumber, BigNumber], {
    reserve0: BigNumber;
    reserve1: BigNumber;
}>;
export declare type SyncEventFilter = TypedEventFilter<SyncEvent>;
export declare type TransferEvent = TypedEvent<[string, string, BigNumber], {
    from: string;
    to: string;
    amount: BigNumber;
}>;
export declare type TransferEventFilter = TypedEventFilter<TransferEvent>;
export interface SolidlyPair extends BaseContract {
    contractName: 'SolidlyPair';
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: SolidlyPairInterface;
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
        allowance(arg0: string, arg1: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        approve(spender: string, amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        balanceOf(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        blockTimestampLast(overrides?: CallOverrides): Promise<[BigNumber]>;
        burn(to: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        claimFees(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        claimable0(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        claimable1(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        current(tokenIn: string, amountIn: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber] & {
            amountOut: BigNumber;
        }>;
        currentCumulativePrices(overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            reserve0Cumulative: BigNumber;
            reserve1Cumulative: BigNumber;
            blockTimestamp: BigNumber;
        }>;
        decimals(overrides?: CallOverrides): Promise<[number]>;
        fees(overrides?: CallOverrides): Promise<[string]>;
        getAmountOut(amountIn: BigNumberish, tokenIn: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        getReserves(overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            _reserve0: BigNumber;
            _reserve1: BigNumber;
            _blockTimestampLast: BigNumber;
        }>;
        index0(overrides?: CallOverrides): Promise<[BigNumber]>;
        index1(overrides?: CallOverrides): Promise<[BigNumber]>;
        lastObservation(overrides?: CallOverrides): Promise<[BaseV1Pair.ObservationStructOutput]>;
        metadata(overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            boolean,
            string,
            string
        ] & {
            dec0: BigNumber;
            dec1: BigNumber;
            r0: BigNumber;
            r1: BigNumber;
            st: boolean;
            t0: string;
            t1: string;
        }>;
        mint(to: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        name(overrides?: CallOverrides): Promise<[string]>;
        nonces(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        observationLength(overrides?: CallOverrides): Promise<[BigNumber]>;
        observations(arg0: BigNumberish, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            timestamp: BigNumber;
            reserve0Cumulative: BigNumber;
            reserve1Cumulative: BigNumber;
        }>;
        permit(owner: string, spender: string, value: BigNumberish, deadline: BigNumberish, v: BigNumberish, r: BytesLike, s: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        prices(tokenIn: string, amountIn: BigNumberish, points: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber[]]>;
        quote(tokenIn: string, amountIn: BigNumberish, granularity: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber] & {
            amountOut: BigNumber;
        }>;
        reserve0(overrides?: CallOverrides): Promise<[BigNumber]>;
        reserve0CumulativeLast(overrides?: CallOverrides): Promise<[BigNumber]>;
        reserve1(overrides?: CallOverrides): Promise<[BigNumber]>;
        reserve1CumulativeLast(overrides?: CallOverrides): Promise<[BigNumber]>;
        sample(tokenIn: string, amountIn: BigNumberish, points: BigNumberish, window: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber[]]>;
        skim(to: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        stable(overrides?: CallOverrides): Promise<[boolean]>;
        supplyIndex0(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        supplyIndex1(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        swap(amount0Out: BigNumberish, amount1Out: BigNumberish, to: string, data: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        symbol(overrides?: CallOverrides): Promise<[string]>;
        sync(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        token0(overrides?: CallOverrides): Promise<[string]>;
        token1(overrides?: CallOverrides): Promise<[string]>;
        tokens(overrides?: CallOverrides): Promise<[string, string]>;
        totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;
        transfer(dst: string, amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        transferFrom(src: string, dst: string, amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
    };
    allowance(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;
    approve(spender: string, amount: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    balanceOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    blockTimestampLast(overrides?: CallOverrides): Promise<BigNumber>;
    burn(to: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    claimFees(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    claimable0(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    claimable1(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    current(tokenIn: string, amountIn: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    currentCumulativePrices(overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber,
        BigNumber
    ] & {
        reserve0Cumulative: BigNumber;
        reserve1Cumulative: BigNumber;
        blockTimestamp: BigNumber;
    }>;
    decimals(overrides?: CallOverrides): Promise<number>;
    fees(overrides?: CallOverrides): Promise<string>;
    getAmountOut(amountIn: BigNumberish, tokenIn: string, overrides?: CallOverrides): Promise<BigNumber>;
    getReserves(overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber,
        BigNumber
    ] & {
        _reserve0: BigNumber;
        _reserve1: BigNumber;
        _blockTimestampLast: BigNumber;
    }>;
    index0(overrides?: CallOverrides): Promise<BigNumber>;
    index1(overrides?: CallOverrides): Promise<BigNumber>;
    lastObservation(overrides?: CallOverrides): Promise<BaseV1Pair.ObservationStructOutput>;
    metadata(overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        boolean,
        string,
        string
    ] & {
        dec0: BigNumber;
        dec1: BigNumber;
        r0: BigNumber;
        r1: BigNumber;
        st: boolean;
        t0: string;
        t1: string;
    }>;
    mint(to: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    name(overrides?: CallOverrides): Promise<string>;
    nonces(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    observationLength(overrides?: CallOverrides): Promise<BigNumber>;
    observations(arg0: BigNumberish, overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber,
        BigNumber
    ] & {
        timestamp: BigNumber;
        reserve0Cumulative: BigNumber;
        reserve1Cumulative: BigNumber;
    }>;
    permit(owner: string, spender: string, value: BigNumberish, deadline: BigNumberish, v: BigNumberish, r: BytesLike, s: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    prices(tokenIn: string, amountIn: BigNumberish, points: BigNumberish, overrides?: CallOverrides): Promise<BigNumber[]>;
    quote(tokenIn: string, amountIn: BigNumberish, granularity: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    reserve0(overrides?: CallOverrides): Promise<BigNumber>;
    reserve0CumulativeLast(overrides?: CallOverrides): Promise<BigNumber>;
    reserve1(overrides?: CallOverrides): Promise<BigNumber>;
    reserve1CumulativeLast(overrides?: CallOverrides): Promise<BigNumber>;
    sample(tokenIn: string, amountIn: BigNumberish, points: BigNumberish, window: BigNumberish, overrides?: CallOverrides): Promise<BigNumber[]>;
    skim(to: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    stable(overrides?: CallOverrides): Promise<boolean>;
    supplyIndex0(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    supplyIndex1(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    swap(amount0Out: BigNumberish, amount1Out: BigNumberish, to: string, data: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    symbol(overrides?: CallOverrides): Promise<string>;
    sync(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    token0(overrides?: CallOverrides): Promise<string>;
    token1(overrides?: CallOverrides): Promise<string>;
    tokens(overrides?: CallOverrides): Promise<[string, string]>;
    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
    transfer(dst: string, amount: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    transferFrom(src: string, dst: string, amount: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        allowance(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;
        approve(spender: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
        balanceOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        blockTimestampLast(overrides?: CallOverrides): Promise<BigNumber>;
        burn(to: string, overrides?: CallOverrides): Promise<[BigNumber, BigNumber] & {
            amount0: BigNumber;
            amount1: BigNumber;
        }>;
        claimFees(overrides?: CallOverrides): Promise<[BigNumber, BigNumber] & {
            claimed0: BigNumber;
            claimed1: BigNumber;
        }>;
        claimable0(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        claimable1(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        current(tokenIn: string, amountIn: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        currentCumulativePrices(overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            reserve0Cumulative: BigNumber;
            reserve1Cumulative: BigNumber;
            blockTimestamp: BigNumber;
        }>;
        decimals(overrides?: CallOverrides): Promise<number>;
        fees(overrides?: CallOverrides): Promise<string>;
        getAmountOut(amountIn: BigNumberish, tokenIn: string, overrides?: CallOverrides): Promise<BigNumber>;
        getReserves(overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            _reserve0: BigNumber;
            _reserve1: BigNumber;
            _blockTimestampLast: BigNumber;
        }>;
        index0(overrides?: CallOverrides): Promise<BigNumber>;
        index1(overrides?: CallOverrides): Promise<BigNumber>;
        lastObservation(overrides?: CallOverrides): Promise<BaseV1Pair.ObservationStructOutput>;
        metadata(overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            boolean,
            string,
            string
        ] & {
            dec0: BigNumber;
            dec1: BigNumber;
            r0: BigNumber;
            r1: BigNumber;
            st: boolean;
            t0: string;
            t1: string;
        }>;
        mint(to: string, overrides?: CallOverrides): Promise<BigNumber>;
        name(overrides?: CallOverrides): Promise<string>;
        nonces(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        observationLength(overrides?: CallOverrides): Promise<BigNumber>;
        observations(arg0: BigNumberish, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            timestamp: BigNumber;
            reserve0Cumulative: BigNumber;
            reserve1Cumulative: BigNumber;
        }>;
        permit(owner: string, spender: string, value: BigNumberish, deadline: BigNumberish, v: BigNumberish, r: BytesLike, s: BytesLike, overrides?: CallOverrides): Promise<void>;
        prices(tokenIn: string, amountIn: BigNumberish, points: BigNumberish, overrides?: CallOverrides): Promise<BigNumber[]>;
        quote(tokenIn: string, amountIn: BigNumberish, granularity: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        reserve0(overrides?: CallOverrides): Promise<BigNumber>;
        reserve0CumulativeLast(overrides?: CallOverrides): Promise<BigNumber>;
        reserve1(overrides?: CallOverrides): Promise<BigNumber>;
        reserve1CumulativeLast(overrides?: CallOverrides): Promise<BigNumber>;
        sample(tokenIn: string, amountIn: BigNumberish, points: BigNumberish, window: BigNumberish, overrides?: CallOverrides): Promise<BigNumber[]>;
        skim(to: string, overrides?: CallOverrides): Promise<void>;
        stable(overrides?: CallOverrides): Promise<boolean>;
        supplyIndex0(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        supplyIndex1(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        swap(amount0Out: BigNumberish, amount1Out: BigNumberish, to: string, data: BytesLike, overrides?: CallOverrides): Promise<void>;
        symbol(overrides?: CallOverrides): Promise<string>;
        sync(overrides?: CallOverrides): Promise<void>;
        token0(overrides?: CallOverrides): Promise<string>;
        token1(overrides?: CallOverrides): Promise<string>;
        tokens(overrides?: CallOverrides): Promise<[string, string]>;
        totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
        transfer(dst: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
        transferFrom(src: string, dst: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;
    };
    filters: {
        'Approval(address,address,uint256)'(owner?: string | null, spender?: string | null, amount?: null): ApprovalEventFilter;
        Approval(owner?: string | null, spender?: string | null, amount?: null): ApprovalEventFilter;
        'Burn(address,uint256,uint256,address)'(sender?: string | null, amount0?: null, amount1?: null, to?: string | null): BurnEventFilter;
        Burn(sender?: string | null, amount0?: null, amount1?: null, to?: string | null): BurnEventFilter;
        'Claim(address,address,uint256,uint256)'(sender?: string | null, recipient?: string | null, amount0?: null, amount1?: null): ClaimEventFilter;
        Claim(sender?: string | null, recipient?: string | null, amount0?: null, amount1?: null): ClaimEventFilter;
        'Fees(address,uint256,uint256)'(sender?: string | null, amount0?: null, amount1?: null): FeesEventFilter;
        Fees(sender?: string | null, amount0?: null, amount1?: null): FeesEventFilter;
        'Mint(address,uint256,uint256)'(sender?: string | null, amount0?: null, amount1?: null): MintEventFilter;
        Mint(sender?: string | null, amount0?: null, amount1?: null): MintEventFilter;
        'Swap(address,uint256,uint256,uint256,uint256,address)'(sender?: string | null, amount0In?: null, amount1In?: null, amount0Out?: null, amount1Out?: null, to?: string | null): SwapEventFilter;
        Swap(sender?: string | null, amount0In?: null, amount1In?: null, amount0Out?: null, amount1Out?: null, to?: string | null): SwapEventFilter;
        'Sync(uint256,uint256)'(reserve0?: null, reserve1?: null): SyncEventFilter;
        Sync(reserve0?: null, reserve1?: null): SyncEventFilter;
        'Transfer(address,address,uint256)'(from?: string | null, to?: string | null, amount?: null): TransferEventFilter;
        Transfer(from?: string | null, to?: string | null, amount?: null): TransferEventFilter;
    };
    estimateGas: {
        allowance(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;
        approve(spender: string, amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        balanceOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        blockTimestampLast(overrides?: CallOverrides): Promise<BigNumber>;
        burn(to: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        claimFees(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        claimable0(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        claimable1(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        current(tokenIn: string, amountIn: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        currentCumulativePrices(overrides?: CallOverrides): Promise<BigNumber>;
        decimals(overrides?: CallOverrides): Promise<BigNumber>;
        fees(overrides?: CallOverrides): Promise<BigNumber>;
        getAmountOut(amountIn: BigNumberish, tokenIn: string, overrides?: CallOverrides): Promise<BigNumber>;
        getReserves(overrides?: CallOverrides): Promise<BigNumber>;
        index0(overrides?: CallOverrides): Promise<BigNumber>;
        index1(overrides?: CallOverrides): Promise<BigNumber>;
        lastObservation(overrides?: CallOverrides): Promise<BigNumber>;
        metadata(overrides?: CallOverrides): Promise<BigNumber>;
        mint(to: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        name(overrides?: CallOverrides): Promise<BigNumber>;
        nonces(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        observationLength(overrides?: CallOverrides): Promise<BigNumber>;
        observations(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        permit(owner: string, spender: string, value: BigNumberish, deadline: BigNumberish, v: BigNumberish, r: BytesLike, s: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        prices(tokenIn: string, amountIn: BigNumberish, points: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        quote(tokenIn: string, amountIn: BigNumberish, granularity: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        reserve0(overrides?: CallOverrides): Promise<BigNumber>;
        reserve0CumulativeLast(overrides?: CallOverrides): Promise<BigNumber>;
        reserve1(overrides?: CallOverrides): Promise<BigNumber>;
        reserve1CumulativeLast(overrides?: CallOverrides): Promise<BigNumber>;
        sample(tokenIn: string, amountIn: BigNumberish, points: BigNumberish, window: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        skim(to: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        stable(overrides?: CallOverrides): Promise<BigNumber>;
        supplyIndex0(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        supplyIndex1(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        swap(amount0Out: BigNumberish, amount1Out: BigNumberish, to: string, data: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        symbol(overrides?: CallOverrides): Promise<BigNumber>;
        sync(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        token0(overrides?: CallOverrides): Promise<BigNumber>;
        token1(overrides?: CallOverrides): Promise<BigNumber>;
        tokens(overrides?: CallOverrides): Promise<BigNumber>;
        totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
        transfer(dst: string, amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        transferFrom(src: string, dst: string, amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        allowance(arg0: string, arg1: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        approve(spender: string, amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        balanceOf(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        blockTimestampLast(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        burn(to: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        claimFees(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        claimable0(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        claimable1(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        current(tokenIn: string, amountIn: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        currentCumulativePrices(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        fees(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getAmountOut(amountIn: BigNumberish, tokenIn: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getReserves(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        index0(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        index1(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        lastObservation(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        metadata(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        mint(to: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        name(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        nonces(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        observationLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        observations(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        permit(owner: string, spender: string, value: BigNumberish, deadline: BigNumberish, v: BigNumberish, r: BytesLike, s: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        prices(tokenIn: string, amountIn: BigNumberish, points: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        quote(tokenIn: string, amountIn: BigNumberish, granularity: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        reserve0(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        reserve0CumulativeLast(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        reserve1(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        reserve1CumulativeLast(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        sample(tokenIn: string, amountIn: BigNumberish, points: BigNumberish, window: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        skim(to: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        stable(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        supplyIndex0(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        supplyIndex1(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        swap(amount0Out: BigNumberish, amount1Out: BigNumberish, to: string, data: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        sync(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        token0(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        token1(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        tokens(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        transfer(dst: string, amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        transferFrom(src: string, dst: string, amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
    };
}
