import { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from 'ethers';
import { FunctionFragment, Result, EventFragment } from '@ethersproject/abi';
import { Listener, Provider } from '@ethersproject/providers';
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from './common';
export interface MstableVaultInterface extends utils.Interface {
    contractName: 'MstableVault';
    functions: {
        'DURATION()': FunctionFragment;
        'LOCKUP()': FunctionFragment;
        'UNLOCK()': FunctionFragment;
        'balanceOf(address)': FunctionFragment;
        'boostCoeff()': FunctionFragment;
        'boostDirector()': FunctionFragment;
        'claimReward()': FunctionFragment;
        'claimRewards()': FunctionFragment;
        'decimals()': FunctionFragment;
        'earned(address)': FunctionFragment;
        'exit(uint256,uint256)': FunctionFragment;
        'getBoost(address)': FunctionFragment;
        'getRewardToken()': FunctionFragment;
        'initialize(address,string,string)': FunctionFragment;
        'lastTimeRewardApplicable()': FunctionFragment;
        'lastUpdateTime()': FunctionFragment;
        'name()': FunctionFragment;
        'nexus()': FunctionFragment;
        'notifyRewardAmount(uint256)': FunctionFragment;
        'periodFinish()': FunctionFragment;
        'pokeBoost(address)': FunctionFragment;
        'priceCoeff()': FunctionFragment;
        'rawBalanceOf(address)': FunctionFragment;
        'rewardPerToken()': FunctionFragment;
        'rewardPerTokenStored()': FunctionFragment;
        'rewardRate()': FunctionFragment;
        'rewardsDistributor()': FunctionFragment;
        'rewardsToken()': FunctionFragment;
        'setRewardsDistribution(address)': FunctionFragment;
        'stake(uint256)': FunctionFragment;
        'stakingToken()': FunctionFragment;
        'symbol()': FunctionFragment;
        'totalSupply()': FunctionFragment;
        'unclaimedRewards(address)': FunctionFragment;
        'userClaim(address)': FunctionFragment;
        'userData(address)': FunctionFragment;
        'userRewards(address,uint256)': FunctionFragment;
        'withdraw(uint256)': FunctionFragment;
    };
    encodeFunctionData(functionFragment: 'DURATION', values?: undefined): string;
    encodeFunctionData(functionFragment: 'LOCKUP', values?: undefined): string;
    encodeFunctionData(functionFragment: 'UNLOCK', values?: undefined): string;
    encodeFunctionData(functionFragment: 'balanceOf', values: [string]): string;
    encodeFunctionData(functionFragment: 'boostCoeff', values?: undefined): string;
    encodeFunctionData(functionFragment: 'boostDirector', values?: undefined): string;
    encodeFunctionData(functionFragment: 'claimReward', values?: undefined): string;
    encodeFunctionData(functionFragment: 'claimRewards', values?: undefined): string;
    encodeFunctionData(functionFragment: 'decimals', values?: undefined): string;
    encodeFunctionData(functionFragment: 'earned', values: [string]): string;
    encodeFunctionData(functionFragment: 'exit', values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: 'getBoost', values: [string]): string;
    encodeFunctionData(functionFragment: 'getRewardToken', values?: undefined): string;
    encodeFunctionData(functionFragment: 'initialize', values: [string, string, string]): string;
    encodeFunctionData(functionFragment: 'lastTimeRewardApplicable', values?: undefined): string;
    encodeFunctionData(functionFragment: 'lastUpdateTime', values?: undefined): string;
    encodeFunctionData(functionFragment: 'name', values?: undefined): string;
    encodeFunctionData(functionFragment: 'nexus', values?: undefined): string;
    encodeFunctionData(functionFragment: 'notifyRewardAmount', values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: 'periodFinish', values?: undefined): string;
    encodeFunctionData(functionFragment: 'pokeBoost', values: [string]): string;
    encodeFunctionData(functionFragment: 'priceCoeff', values?: undefined): string;
    encodeFunctionData(functionFragment: 'rawBalanceOf', values: [string]): string;
    encodeFunctionData(functionFragment: 'rewardPerToken', values?: undefined): string;
    encodeFunctionData(functionFragment: 'rewardPerTokenStored', values?: undefined): string;
    encodeFunctionData(functionFragment: 'rewardRate', values?: undefined): string;
    encodeFunctionData(functionFragment: 'rewardsDistributor', values?: undefined): string;
    encodeFunctionData(functionFragment: 'rewardsToken', values?: undefined): string;
    encodeFunctionData(functionFragment: 'setRewardsDistribution', values: [string]): string;
    encodeFunctionData(functionFragment: 'stake', values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: 'stakingToken', values?: undefined): string;
    encodeFunctionData(functionFragment: 'symbol', values?: undefined): string;
    encodeFunctionData(functionFragment: 'totalSupply', values?: undefined): string;
    encodeFunctionData(functionFragment: 'unclaimedRewards', values: [string]): string;
    encodeFunctionData(functionFragment: 'userClaim', values: [string]): string;
    encodeFunctionData(functionFragment: 'userData', values: [string]): string;
    encodeFunctionData(functionFragment: 'userRewards', values: [string, BigNumberish]): string;
    encodeFunctionData(functionFragment: 'withdraw', values: [BigNumberish]): string;
    decodeFunctionResult(functionFragment: 'DURATION', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'LOCKUP', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'UNLOCK', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'boostCoeff', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'boostDirector', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'claimReward', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'claimRewards', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'decimals', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'earned', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'exit', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'getBoost', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'getRewardToken', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'initialize', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'lastTimeRewardApplicable', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'lastUpdateTime', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'name', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'nexus', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'notifyRewardAmount', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'periodFinish', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'pokeBoost', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'priceCoeff', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'rawBalanceOf', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'rewardPerToken', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'rewardPerTokenStored', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'rewardRate', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'rewardsDistributor', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'rewardsToken', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setRewardsDistribution', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'stake', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'stakingToken', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'symbol', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'totalSupply', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'unclaimedRewards', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'userClaim', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'userData', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'userRewards', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;
    events: {
        'Poked(address)': EventFragment;
        'RewardAdded(uint256)': EventFragment;
        'RewardPaid(address,uint256)': EventFragment;
        'Staked(address,uint256,address)': EventFragment;
        'Transfer(address,address,uint256)': EventFragment;
        'Withdrawn(address,uint256)': EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: 'Poked'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'RewardAdded'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'RewardPaid'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'Staked'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'Transfer'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'Withdrawn'): EventFragment;
}
export declare type PokedEvent = TypedEvent<[string], {
    user: string;
}>;
export declare type PokedEventFilter = TypedEventFilter<PokedEvent>;
export declare type RewardAddedEvent = TypedEvent<[BigNumber], {
    reward: BigNumber;
}>;
export declare type RewardAddedEventFilter = TypedEventFilter<RewardAddedEvent>;
export declare type RewardPaidEvent = TypedEvent<[string, BigNumber], {
    user: string;
    reward: BigNumber;
}>;
export declare type RewardPaidEventFilter = TypedEventFilter<RewardPaidEvent>;
export declare type StakedEvent = TypedEvent<[string, BigNumber, string], {
    user: string;
    amount: BigNumber;
    payer: string;
}>;
export declare type StakedEventFilter = TypedEventFilter<StakedEvent>;
export declare type TransferEvent = TypedEvent<[string, string, BigNumber], {
    from: string;
    to: string;
    value: BigNumber;
}>;
export declare type TransferEventFilter = TypedEventFilter<TransferEvent>;
export declare type WithdrawnEvent = TypedEvent<[string, BigNumber], {
    user: string;
    amount: BigNumber;
}>;
export declare type WithdrawnEventFilter = TypedEventFilter<WithdrawnEvent>;
export interface MstableVault extends BaseContract {
    contractName: 'MstableVault';
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: MstableVaultInterface;
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
        DURATION(overrides?: CallOverrides): Promise<[BigNumber]>;
        LOCKUP(overrides?: CallOverrides): Promise<[BigNumber]>;
        UNLOCK(overrides?: CallOverrides): Promise<[BigNumber]>;
        balanceOf(_account: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        boostCoeff(overrides?: CallOverrides): Promise<[BigNumber]>;
        boostDirector(overrides?: CallOverrides): Promise<[string]>;
        claimReward(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        'claimRewards()'(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        'claimRewards(uint256,uint256)'(_first: BigNumberish, _last: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        decimals(overrides?: CallOverrides): Promise<[number]>;
        earned(_account: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        'exit(uint256,uint256)'(_first: BigNumberish, _last: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        'exit()'(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        getBoost(_account: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        getRewardToken(overrides?: CallOverrides): Promise<[string]>;
        initialize(_rewardsDistributor: string, _nameArg: string, _symbolArg: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        lastTimeRewardApplicable(overrides?: CallOverrides): Promise<[BigNumber]>;
        lastUpdateTime(overrides?: CallOverrides): Promise<[BigNumber]>;
        name(overrides?: CallOverrides): Promise<[string]>;
        nexus(overrides?: CallOverrides): Promise<[string]>;
        notifyRewardAmount(_reward: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        periodFinish(overrides?: CallOverrides): Promise<[BigNumber]>;
        pokeBoost(_account: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        priceCoeff(overrides?: CallOverrides): Promise<[BigNumber]>;
        rawBalanceOf(_account: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        rewardPerToken(overrides?: CallOverrides): Promise<[BigNumber]>;
        rewardPerTokenStored(overrides?: CallOverrides): Promise<[BigNumber]>;
        rewardRate(overrides?: CallOverrides): Promise<[BigNumber]>;
        rewardsDistributor(overrides?: CallOverrides): Promise<[string]>;
        rewardsToken(overrides?: CallOverrides): Promise<[string]>;
        setRewardsDistribution(_rewardsDistributor: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        'stake(uint256)'(_amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        'stake(address,uint256)'(_beneficiary: string, _amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        stakingToken(overrides?: CallOverrides): Promise<[string]>;
        symbol(overrides?: CallOverrides): Promise<[string]>;
        totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;
        unclaimedRewards(_account: string, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            amount: BigNumber;
            first: BigNumber;
            last: BigNumber;
        }>;
        userClaim(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        userData(arg0: string, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            rewardPerTokenPaid: BigNumber;
            rewards: BigNumber;
            lastAction: BigNumber;
            rewardCount: BigNumber;
        }>;
        userRewards(arg0: string, arg1: BigNumberish, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            start: BigNumber;
            finish: BigNumber;
            rate: BigNumber;
        }>;
        withdraw(_amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
    };
    DURATION(overrides?: CallOverrides): Promise<BigNumber>;
    LOCKUP(overrides?: CallOverrides): Promise<BigNumber>;
    UNLOCK(overrides?: CallOverrides): Promise<BigNumber>;
    balanceOf(_account: string, overrides?: CallOverrides): Promise<BigNumber>;
    boostCoeff(overrides?: CallOverrides): Promise<BigNumber>;
    boostDirector(overrides?: CallOverrides): Promise<string>;
    claimReward(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    'claimRewards()'(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    'claimRewards(uint256,uint256)'(_first: BigNumberish, _last: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    decimals(overrides?: CallOverrides): Promise<number>;
    earned(_account: string, overrides?: CallOverrides): Promise<BigNumber>;
    'exit(uint256,uint256)'(_first: BigNumberish, _last: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    'exit()'(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    getBoost(_account: string, overrides?: CallOverrides): Promise<BigNumber>;
    getRewardToken(overrides?: CallOverrides): Promise<string>;
    initialize(_rewardsDistributor: string, _nameArg: string, _symbolArg: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    lastTimeRewardApplicable(overrides?: CallOverrides): Promise<BigNumber>;
    lastUpdateTime(overrides?: CallOverrides): Promise<BigNumber>;
    name(overrides?: CallOverrides): Promise<string>;
    nexus(overrides?: CallOverrides): Promise<string>;
    notifyRewardAmount(_reward: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    periodFinish(overrides?: CallOverrides): Promise<BigNumber>;
    pokeBoost(_account: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    priceCoeff(overrides?: CallOverrides): Promise<BigNumber>;
    rawBalanceOf(_account: string, overrides?: CallOverrides): Promise<BigNumber>;
    rewardPerToken(overrides?: CallOverrides): Promise<BigNumber>;
    rewardPerTokenStored(overrides?: CallOverrides): Promise<BigNumber>;
    rewardRate(overrides?: CallOverrides): Promise<BigNumber>;
    rewardsDistributor(overrides?: CallOverrides): Promise<string>;
    rewardsToken(overrides?: CallOverrides): Promise<string>;
    setRewardsDistribution(_rewardsDistributor: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    'stake(uint256)'(_amount: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    'stake(address,uint256)'(_beneficiary: string, _amount: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    stakingToken(overrides?: CallOverrides): Promise<string>;
    symbol(overrides?: CallOverrides): Promise<string>;
    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
    unclaimedRewards(_account: string, overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber,
        BigNumber
    ] & {
        amount: BigNumber;
        first: BigNumber;
        last: BigNumber;
    }>;
    userClaim(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    userData(arg0: string, overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber
    ] & {
        rewardPerTokenPaid: BigNumber;
        rewards: BigNumber;
        lastAction: BigNumber;
        rewardCount: BigNumber;
    }>;
    userRewards(arg0: string, arg1: BigNumberish, overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber,
        BigNumber
    ] & {
        start: BigNumber;
        finish: BigNumber;
        rate: BigNumber;
    }>;
    withdraw(_amount: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        DURATION(overrides?: CallOverrides): Promise<BigNumber>;
        LOCKUP(overrides?: CallOverrides): Promise<BigNumber>;
        UNLOCK(overrides?: CallOverrides): Promise<BigNumber>;
        balanceOf(_account: string, overrides?: CallOverrides): Promise<BigNumber>;
        boostCoeff(overrides?: CallOverrides): Promise<BigNumber>;
        boostDirector(overrides?: CallOverrides): Promise<string>;
        claimReward(overrides?: CallOverrides): Promise<void>;
        'claimRewards()'(overrides?: CallOverrides): Promise<void>;
        'claimRewards(uint256,uint256)'(_first: BigNumberish, _last: BigNumberish, overrides?: CallOverrides): Promise<void>;
        decimals(overrides?: CallOverrides): Promise<number>;
        earned(_account: string, overrides?: CallOverrides): Promise<BigNumber>;
        'exit(uint256,uint256)'(_first: BigNumberish, _last: BigNumberish, overrides?: CallOverrides): Promise<void>;
        'exit()'(overrides?: CallOverrides): Promise<void>;
        getBoost(_account: string, overrides?: CallOverrides): Promise<BigNumber>;
        getRewardToken(overrides?: CallOverrides): Promise<string>;
        initialize(_rewardsDistributor: string, _nameArg: string, _symbolArg: string, overrides?: CallOverrides): Promise<void>;
        lastTimeRewardApplicable(overrides?: CallOverrides): Promise<BigNumber>;
        lastUpdateTime(overrides?: CallOverrides): Promise<BigNumber>;
        name(overrides?: CallOverrides): Promise<string>;
        nexus(overrides?: CallOverrides): Promise<string>;
        notifyRewardAmount(_reward: BigNumberish, overrides?: CallOverrides): Promise<void>;
        periodFinish(overrides?: CallOverrides): Promise<BigNumber>;
        pokeBoost(_account: string, overrides?: CallOverrides): Promise<void>;
        priceCoeff(overrides?: CallOverrides): Promise<BigNumber>;
        rawBalanceOf(_account: string, overrides?: CallOverrides): Promise<BigNumber>;
        rewardPerToken(overrides?: CallOverrides): Promise<BigNumber>;
        rewardPerTokenStored(overrides?: CallOverrides): Promise<BigNumber>;
        rewardRate(overrides?: CallOverrides): Promise<BigNumber>;
        rewardsDistributor(overrides?: CallOverrides): Promise<string>;
        rewardsToken(overrides?: CallOverrides): Promise<string>;
        setRewardsDistribution(_rewardsDistributor: string, overrides?: CallOverrides): Promise<void>;
        'stake(uint256)'(_amount: BigNumberish, overrides?: CallOverrides): Promise<void>;
        'stake(address,uint256)'(_beneficiary: string, _amount: BigNumberish, overrides?: CallOverrides): Promise<void>;
        stakingToken(overrides?: CallOverrides): Promise<string>;
        symbol(overrides?: CallOverrides): Promise<string>;
        totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
        unclaimedRewards(_account: string, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            amount: BigNumber;
            first: BigNumber;
            last: BigNumber;
        }>;
        userClaim(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        userData(arg0: string, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            rewardPerTokenPaid: BigNumber;
            rewards: BigNumber;
            lastAction: BigNumber;
            rewardCount: BigNumber;
        }>;
        userRewards(arg0: string, arg1: BigNumberish, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            start: BigNumber;
            finish: BigNumber;
            rate: BigNumber;
        }>;
        withdraw(_amount: BigNumberish, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        'Poked(address)'(user?: string | null): PokedEventFilter;
        Poked(user?: string | null): PokedEventFilter;
        'RewardAdded(uint256)'(reward?: null): RewardAddedEventFilter;
        RewardAdded(reward?: null): RewardAddedEventFilter;
        'RewardPaid(address,uint256)'(user?: string | null, reward?: null): RewardPaidEventFilter;
        RewardPaid(user?: string | null, reward?: null): RewardPaidEventFilter;
        'Staked(address,uint256,address)'(user?: string | null, amount?: null, payer?: null): StakedEventFilter;
        Staked(user?: string | null, amount?: null, payer?: null): StakedEventFilter;
        'Transfer(address,address,uint256)'(from?: string | null, to?: string | null, value?: null): TransferEventFilter;
        Transfer(from?: string | null, to?: string | null, value?: null): TransferEventFilter;
        'Withdrawn(address,uint256)'(user?: string | null, amount?: null): WithdrawnEventFilter;
        Withdrawn(user?: string | null, amount?: null): WithdrawnEventFilter;
    };
    estimateGas: {
        DURATION(overrides?: CallOverrides): Promise<BigNumber>;
        LOCKUP(overrides?: CallOverrides): Promise<BigNumber>;
        UNLOCK(overrides?: CallOverrides): Promise<BigNumber>;
        balanceOf(_account: string, overrides?: CallOverrides): Promise<BigNumber>;
        boostCoeff(overrides?: CallOverrides): Promise<BigNumber>;
        boostDirector(overrides?: CallOverrides): Promise<BigNumber>;
        claimReward(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        'claimRewards()'(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        'claimRewards(uint256,uint256)'(_first: BigNumberish, _last: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        decimals(overrides?: CallOverrides): Promise<BigNumber>;
        earned(_account: string, overrides?: CallOverrides): Promise<BigNumber>;
        'exit(uint256,uint256)'(_first: BigNumberish, _last: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        'exit()'(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        getBoost(_account: string, overrides?: CallOverrides): Promise<BigNumber>;
        getRewardToken(overrides?: CallOverrides): Promise<BigNumber>;
        initialize(_rewardsDistributor: string, _nameArg: string, _symbolArg: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        lastTimeRewardApplicable(overrides?: CallOverrides): Promise<BigNumber>;
        lastUpdateTime(overrides?: CallOverrides): Promise<BigNumber>;
        name(overrides?: CallOverrides): Promise<BigNumber>;
        nexus(overrides?: CallOverrides): Promise<BigNumber>;
        notifyRewardAmount(_reward: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        periodFinish(overrides?: CallOverrides): Promise<BigNumber>;
        pokeBoost(_account: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        priceCoeff(overrides?: CallOverrides): Promise<BigNumber>;
        rawBalanceOf(_account: string, overrides?: CallOverrides): Promise<BigNumber>;
        rewardPerToken(overrides?: CallOverrides): Promise<BigNumber>;
        rewardPerTokenStored(overrides?: CallOverrides): Promise<BigNumber>;
        rewardRate(overrides?: CallOverrides): Promise<BigNumber>;
        rewardsDistributor(overrides?: CallOverrides): Promise<BigNumber>;
        rewardsToken(overrides?: CallOverrides): Promise<BigNumber>;
        setRewardsDistribution(_rewardsDistributor: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        'stake(uint256)'(_amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        'stake(address,uint256)'(_beneficiary: string, _amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        stakingToken(overrides?: CallOverrides): Promise<BigNumber>;
        symbol(overrides?: CallOverrides): Promise<BigNumber>;
        totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
        unclaimedRewards(_account: string, overrides?: CallOverrides): Promise<BigNumber>;
        userClaim(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        userData(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        userRewards(arg0: string, arg1: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        withdraw(_amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        DURATION(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        LOCKUP(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        UNLOCK(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        balanceOf(_account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        boostCoeff(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        boostDirector(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        claimReward(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        'claimRewards()'(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        'claimRewards(uint256,uint256)'(_first: BigNumberish, _last: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        earned(_account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        'exit(uint256,uint256)'(_first: BigNumberish, _last: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        'exit()'(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        getBoost(_account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getRewardToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        initialize(_rewardsDistributor: string, _nameArg: string, _symbolArg: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        lastTimeRewardApplicable(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        lastUpdateTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        name(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        nexus(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        notifyRewardAmount(_reward: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        periodFinish(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        pokeBoost(_account: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        priceCoeff(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        rawBalanceOf(_account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        rewardPerToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        rewardPerTokenStored(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        rewardRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        rewardsDistributor(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        rewardsToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setRewardsDistribution(_rewardsDistributor: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        'stake(uint256)'(_amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        'stake(address,uint256)'(_beneficiary: string, _amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        stakingToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        unclaimedRewards(_account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        userClaim(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        userData(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        userRewards(arg0: string, arg1: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        withdraw(_amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
    };
}
