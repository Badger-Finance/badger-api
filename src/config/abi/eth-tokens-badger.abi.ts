export const contract = '0x3472A5A71965499acd81997a54BBA8D852C6E53d';
export const abi = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'creationBlock',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_newController', type: 'address' }],
    name: 'changeController',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_blockNumber', type: 'uint256' },
    ],
    name: 'balanceOfAt',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'version',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_cloneTokenName', type: 'string' },
      { name: '_cloneDecimalUnits', type: 'uint8' },
      { name: '_cloneTokenSymbol', type: 'string' },
      { name: '_snapshotBlock', type: 'uint256' },
      { name: '_transfersEnabled', type: 'bool' },
    ],
    name: 'createCloneToken',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'parentToken',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
    name: 'generateTokens',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_blockNumber', type: 'uint256' }],
    name: 'totalSupplyAt',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'transfersEnabled',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'parentSnapShotBlock',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_amount', type: 'uint256' },
      { name: '_extraData', type: 'bytes' },
    ],
    name: 'approveAndCall',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
    name: 'destroyTokens',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: 'remaining', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_token', type: 'address' }],
    name: 'claimTokens',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'tokenFactory',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_transfersEnabled', type: 'bool' }],
    name: 'enableTransfers',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'controller',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: '_tokenFactory', type: 'address' },
      { name: '_parentToken', type: 'address' },
      { name: '_parentSnapShotBlock', type: 'uint256' },
      { name: '_tokenName', type: 'string' },
      { name: '_decimalUnits', type: 'uint8' },
      { name: '_tokenSymbol', type: 'string' },
      { name: '_transfersEnabled', type: 'bool' },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { payable: true, stateMutability: 'payable', type: 'fallback' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_token', type: 'address' },
      { indexed: true, name: '_controller', type: 'address' },
      { indexed: false, name: '_amount', type: 'uint256' },
    ],
    name: 'ClaimedTokens',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_from', type: 'address' },
      { indexed: true, name: '_to', type: 'address' },
      { indexed: false, name: '_amount', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_cloneToken', type: 'address' },
      { indexed: false, name: '_snapshotBlock', type: 'uint256' },
    ],
    name: 'NewCloneToken',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_owner', type: 'address' },
      { indexed: true, name: '_spender', type: 'address' },
      { indexed: false, name: '_amount', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
];
