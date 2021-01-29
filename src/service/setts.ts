import { TOKENS } from './util/constants';

export const setts = {
	'0xd04c48a53c111300ad41190d63681ed3dad998ec': {
		asset: 'sBTCCRV',
		protocol: 'curve',
		token: TOKENS.SBTC,
		geyser: '0x10fc82867013fce1bd624fafc719bb92df3172fc',
	},
	'0x6def55d2e18486b9ddfaa075bc4e4ee0b28c1545': {
		asset: 'renBTCCRV',
		protocol: 'curve',
		token: TOKENS.RENBTC,
		geyser: '0x2296f174374508278dc12b806a7f27c87d53ca15',
	},
	'0xb9d076fde463dbc9f915e5392f807315bf940334': {
		asset: 'tBTCCRV',
		protocol: 'curve',
		token: TOKENS.TBTC,
		geyser: '0x085a9340ff7692ab6703f17ab5ffc917b580a6fd',
	},
	'0xaf5a1decfa95baf63e0084a35c62592b774a2a87': {
		asset: 'hrenBTCCRV',
		protocol: 'curve',
		token: TOKENS.RENBTC,
		geyser: '0xed0b7f5d9f6286d00763b0ffcba886d8f9d56d5e',
	},
	'0x19d97d8fa813ee2f51ad4b4e04ea08baf4dffc28': {
		asset: 'BADGER',
		protocol: 'badger',
		token: TOKENS.BADGER,
		geyser: '0xa9429271a28f8543efffa136994c0839e7d7bf77',
	},
	'0x235c9e24d3fb2fafd58a2e49d454fdcd2dbf7ff1': {
		asset: 'BADGER-WBTC',
		protocol: 'uniswap',
		token: TOKENS.UNI_BADGER,
		geyser: '0xa207d69ea6fb967e54baa8639c408c31767ba62d',
	},
	'0x758a43ee2bff8230eeb784879cdcff4828f2544d': {
		asset: 'SLP-WBTC-ETH',
		protocol: 'sushiswap',
		token: TOKENS.SUSHI_WBTC,
		geyser: '0x612f681bcd12a0b284518d42d2dbcc73b146eb65',
	},
	'0x1862a18181346ebd9edaf800804f89190def24a5': {
		asset: 'SLP-BADGER-WBTC',
		protocol: 'sushiswap',
		token: TOKENS.SUSHI_BADGER,
		geyser: '0xb5b654efba23596ed49fade44f7e67e23d6712e7',
	},
	'0x7e7e112a68d8d2e221e11047a72ffc1065c38e1a': {
		asset: 'DIGG',
		protocol: 'digg',
		token: TOKENS.DIGG,
	},
	'0xc17078fdd324cc473f8175dc5290fae5f2e84714': {
		asset: 'DIGG-WBTC',
		protocol: 'uniswap',
		token: TOKENS.UNI_DIGG,
		geyser: '0x0194b5fe9ab7e0c43a08acbb771516fc057402e7',
	},
	'0x88128580acdd9c04ce47afce196875747bf2a9f6': {
		asset: 'SLP-DIGG-WBTC',
		protocol: 'sushiswap',
		token: TOKENS.SUSHI_DIGG,
		geyser: '0x7f6fe274e172ac7d096a7b214c78584d99ca988b',
	},
};

export const diggSetts = [
	'0x7e7e112a68d8d2e221e11047a72ffc1065c38e1a',
	'0xc17078fdd324cc473f8175dc5290fae5f2e84714',
	'0x88128580acdd9c04ce47afce196875747bf2a9f6',
];
