"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurvePool3__factory = void 0;
const ethers_1 = require("ethers");
const _abi = [
    {
        name: 'TokenExchange',
        inputs: [
            {
                name: 'buyer',
                type: 'address',
                indexed: true,
            },
            {
                name: 'sold_id',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'tokens_sold',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'bought_id',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'tokens_bought',
                type: 'uint256',
                indexed: false,
            },
        ],
        anonymous: false,
        type: 'event',
    },
    {
        name: 'AddLiquidity',
        inputs: [
            {
                name: 'provider',
                type: 'address',
                indexed: true,
            },
            {
                name: 'token_amounts',
                type: 'uint256[2]',
                indexed: false,
            },
            {
                name: 'fee',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'token_supply',
                type: 'uint256',
                indexed: false,
            },
        ],
        anonymous: false,
        type: 'event',
    },
    {
        name: 'RemoveLiquidity',
        inputs: [
            {
                name: 'provider',
                type: 'address',
                indexed: true,
            },
            {
                name: 'token_amounts',
                type: 'uint256[2]',
                indexed: false,
            },
            {
                name: 'token_supply',
                type: 'uint256',
                indexed: false,
            },
        ],
        anonymous: false,
        type: 'event',
    },
    {
        name: 'RemoveLiquidityOne',
        inputs: [
            {
                name: 'provider',
                type: 'address',
                indexed: true,
            },
            {
                name: 'token_amount',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'coin_index',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'coin_amount',
                type: 'uint256',
                indexed: false,
            },
        ],
        anonymous: false,
        type: 'event',
    },
    {
        name: 'CommitNewParameters',
        inputs: [
            {
                name: 'deadline',
                type: 'uint256',
                indexed: true,
            },
            {
                name: 'admin_fee',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'mid_fee',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'out_fee',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'fee_gamma',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'allowed_extra_profit',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'adjustment_step',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'ma_half_time',
                type: 'uint256',
                indexed: false,
            },
        ],
        anonymous: false,
        type: 'event',
    },
    {
        name: 'NewParameters',
        inputs: [
            {
                name: 'admin_fee',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'mid_fee',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'out_fee',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'fee_gamma',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'allowed_extra_profit',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'adjustment_step',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'ma_half_time',
                type: 'uint256',
                indexed: false,
            },
        ],
        anonymous: false,
        type: 'event',
    },
    {
        name: 'RampAgamma',
        inputs: [
            {
                name: 'initial_A',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'future_A',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'initial_gamma',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'future_gamma',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'initial_time',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'future_time',
                type: 'uint256',
                indexed: false,
            },
        ],
        anonymous: false,
        type: 'event',
    },
    {
        name: 'StopRampA',
        inputs: [
            {
                name: 'current_A',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'current_gamma',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'time',
                type: 'uint256',
                indexed: false,
            },
        ],
        anonymous: false,
        type: 'event',
    },
    {
        name: 'ClaimAdminFee',
        inputs: [
            {
                name: 'admin',
                type: 'address',
                indexed: true,
            },
            {
                name: 'tokens',
                type: 'uint256',
                indexed: false,
            },
        ],
        anonymous: false,
        type: 'event',
    },
    {
        stateMutability: 'nonpayable',
        type: 'constructor',
        inputs: [
            {
                name: '_weth',
                type: 'address',
            },
        ],
        outputs: [],
    },
    {
        stateMutability: 'payable',
        type: 'fallback',
    },
    {
        stateMutability: 'payable',
        type: 'function',
        name: 'exchange',
        inputs: [
            {
                name: 'i',
                type: 'uint256',
            },
            {
                name: 'j',
                type: 'uint256',
            },
            {
                name: 'dx',
                type: 'uint256',
            },
            {
                name: 'min_dy',
                type: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'payable',
        type: 'function',
        name: 'exchange',
        inputs: [
            {
                name: 'i',
                type: 'uint256',
            },
            {
                name: 'j',
                type: 'uint256',
            },
            {
                name: 'dx',
                type: 'uint256',
            },
            {
                name: 'min_dy',
                type: 'uint256',
            },
            {
                name: 'use_eth',
                type: 'bool',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'payable',
        type: 'function',
        name: 'exchange',
        inputs: [
            {
                name: 'i',
                type: 'uint256',
            },
            {
                name: 'j',
                type: 'uint256',
            },
            {
                name: 'dx',
                type: 'uint256',
            },
            {
                name: 'min_dy',
                type: 'uint256',
            },
            {
                name: 'use_eth',
                type: 'bool',
            },
            {
                name: 'receiver',
                type: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'payable',
        type: 'function',
        name: 'exchange_underlying',
        inputs: [
            {
                name: 'i',
                type: 'uint256',
            },
            {
                name: 'j',
                type: 'uint256',
            },
            {
                name: 'dx',
                type: 'uint256',
            },
            {
                name: 'min_dy',
                type: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'payable',
        type: 'function',
        name: 'exchange_underlying',
        inputs: [
            {
                name: 'i',
                type: 'uint256',
            },
            {
                name: 'j',
                type: 'uint256',
            },
            {
                name: 'dx',
                type: 'uint256',
            },
            {
                name: 'min_dy',
                type: 'uint256',
            },
            {
                name: 'receiver',
                type: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'payable',
        type: 'function',
        name: 'exchange_extended',
        inputs: [
            {
                name: 'i',
                type: 'uint256',
            },
            {
                name: 'j',
                type: 'uint256',
            },
            {
                name: 'dx',
                type: 'uint256',
            },
            {
                name: 'min_dy',
                type: 'uint256',
            },
            {
                name: 'use_eth',
                type: 'bool',
            },
            {
                name: 'sender',
                type: 'address',
            },
            {
                name: 'receiver',
                type: 'address',
            },
            {
                name: 'cb',
                type: 'bytes32',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'payable',
        type: 'function',
        name: 'add_liquidity',
        inputs: [
            {
                name: 'amounts',
                type: 'uint256[2]',
            },
            {
                name: 'min_mint_amount',
                type: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'payable',
        type: 'function',
        name: 'add_liquidity',
        inputs: [
            {
                name: 'amounts',
                type: 'uint256[2]',
            },
            {
                name: 'min_mint_amount',
                type: 'uint256',
            },
            {
                name: 'use_eth',
                type: 'bool',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'payable',
        type: 'function',
        name: 'add_liquidity',
        inputs: [
            {
                name: 'amounts',
                type: 'uint256[2]',
            },
            {
                name: 'min_mint_amount',
                type: 'uint256',
            },
            {
                name: 'use_eth',
                type: 'bool',
            },
            {
                name: 'receiver',
                type: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        name: 'remove_liquidity',
        inputs: [
            {
                name: '_amount',
                type: 'uint256',
            },
            {
                name: 'min_amounts',
                type: 'uint256[2]',
            },
        ],
        outputs: [],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        name: 'remove_liquidity',
        inputs: [
            {
                name: '_amount',
                type: 'uint256',
            },
            {
                name: 'min_amounts',
                type: 'uint256[2]',
            },
            {
                name: 'use_eth',
                type: 'bool',
            },
        ],
        outputs: [],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        name: 'remove_liquidity',
        inputs: [
            {
                name: '_amount',
                type: 'uint256',
            },
            {
                name: 'min_amounts',
                type: 'uint256[2]',
            },
            {
                name: 'use_eth',
                type: 'bool',
            },
            {
                name: 'receiver',
                type: 'address',
            },
        ],
        outputs: [],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        name: 'remove_liquidity_one_coin',
        inputs: [
            {
                name: 'token_amount',
                type: 'uint256',
            },
            {
                name: 'i',
                type: 'uint256',
            },
            {
                name: 'min_amount',
                type: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        name: 'remove_liquidity_one_coin',
        inputs: [
            {
                name: 'token_amount',
                type: 'uint256',
            },
            {
                name: 'i',
                type: 'uint256',
            },
            {
                name: 'min_amount',
                type: 'uint256',
            },
            {
                name: 'use_eth',
                type: 'bool',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        name: 'remove_liquidity_one_coin',
        inputs: [
            {
                name: 'token_amount',
                type: 'uint256',
            },
            {
                name: 'i',
                type: 'uint256',
            },
            {
                name: 'min_amount',
                type: 'uint256',
            },
            {
                name: 'use_eth',
                type: 'bool',
            },
            {
                name: 'receiver',
                type: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        name: 'claim_admin_fees',
        inputs: [],
        outputs: [],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        name: 'ramp_A_gamma',
        inputs: [
            {
                name: 'future_A',
                type: 'uint256',
            },
            {
                name: 'future_gamma',
                type: 'uint256',
            },
            {
                name: 'future_time',
                type: 'uint256',
            },
        ],
        outputs: [],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        name: 'stop_ramp_A_gamma',
        inputs: [],
        outputs: [],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        name: 'commit_new_parameters',
        inputs: [
            {
                name: '_new_mid_fee',
                type: 'uint256',
            },
            {
                name: '_new_out_fee',
                type: 'uint256',
            },
            {
                name: '_new_admin_fee',
                type: 'uint256',
            },
            {
                name: '_new_fee_gamma',
                type: 'uint256',
            },
            {
                name: '_new_allowed_extra_profit',
                type: 'uint256',
            },
            {
                name: '_new_adjustment_step',
                type: 'uint256',
            },
            {
                name: '_new_ma_half_time',
                type: 'uint256',
            },
        ],
        outputs: [],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        name: 'apply_new_parameters',
        inputs: [],
        outputs: [],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        name: 'revert_new_parameters',
        inputs: [],
        outputs: [],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'get_dy',
        inputs: [
            {
                name: 'i',
                type: 'uint256',
            },
            {
                name: 'j',
                type: 'uint256',
            },
            {
                name: 'dx',
                type: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'calc_token_amount',
        inputs: [
            {
                name: 'amounts',
                type: 'uint256[2]',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'calc_withdraw_one_coin',
        inputs: [
            {
                name: 'token_amount',
                type: 'uint256',
            },
            {
                name: 'i',
                type: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'lp_price',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'A',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'gamma',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'fee',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'get_virtual_price',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'price_oracle',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        name: 'initialize',
        inputs: [
            {
                name: 'A',
                type: 'uint256',
            },
            {
                name: 'gamma',
                type: 'uint256',
            },
            {
                name: 'mid_fee',
                type: 'uint256',
            },
            {
                name: 'out_fee',
                type: 'uint256',
            },
            {
                name: 'allowed_extra_profit',
                type: 'uint256',
            },
            {
                name: 'fee_gamma',
                type: 'uint256',
            },
            {
                name: 'adjustment_step',
                type: 'uint256',
            },
            {
                name: 'admin_fee',
                type: 'uint256',
            },
            {
                name: 'ma_half_time',
                type: 'uint256',
            },
            {
                name: 'initial_price',
                type: 'uint256',
            },
            {
                name: '_token',
                type: 'address',
            },
            {
                name: '_coins',
                type: 'address[2]',
            },
            {
                name: '_precisions',
                type: 'uint256',
            },
        ],
        outputs: [],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'token',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'coins',
        inputs: [
            {
                name: 'arg0',
                type: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'address',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'price_scale',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'last_prices',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'last_prices_timestamp',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'initial_A_gamma',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'future_A_gamma',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'initial_A_gamma_time',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'future_A_gamma_time',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'allowed_extra_profit',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'future_allowed_extra_profit',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'fee_gamma',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'future_fee_gamma',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'adjustment_step',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'future_adjustment_step',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'ma_half_time',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'future_ma_half_time',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'mid_fee',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'out_fee',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'admin_fee',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'future_mid_fee',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'future_out_fee',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'future_admin_fee',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'balances',
        inputs: [
            {
                name: 'arg0',
                type: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'D',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'factory',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'xcp_profit',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'xcp_profit_a',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'virtual_price',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'admin_actions_deadline',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
    },
];
class CurvePool3__factory {
    static createInterface() {
        return new ethers_1.utils.Interface(_abi);
    }
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.CurvePool3__factory = CurvePool3__factory;
CurvePool3__factory.abi = _abi;
//# sourceMappingURL=CurvePool3__factory.js.map