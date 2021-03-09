import { TOKENS } from '../config/constants';

export type SettData = {
	name: string;
	symbol: string;
	depositToken: string;
	settToken: string;
	geyserAddress?: string;
	protocol?: string;
};

export const setts: SettData[] = [
	{
		name: 'Curve.fi renBTC/wBTC/sBTC',
		symbol: 'sBTCCRV',
		depositToken: TOKENS.CRV_SBTC,
		settToken: '0xd04c48a53c111300ad41190d63681ed3dad998ec',
		geyserAddress: '0x10fc82867013fce1bd624fafc719bb92df3172fc',
		protocol: 'curve',
	},
	{
		name: 'Curve.fi crvRenWBTC',
		symbol: 'renBTCCRV',
		depositToken: TOKENS.CRV_RENBTC,
		settToken: '0x6def55d2e18486b9ddfaa075bc4e4ee0b28c1545',
		geyserAddress: '0x2296f174374508278dc12b806a7f27c87d53ca15',
		protocol: 'curve',
	},
	{
		name: 'Curve.fi tBTC/sBTCCrv LP',
		symbol: 'tBTCCRV',
		depositToken: TOKENS.CRV_TBTC,
		settToken: '0xb9d076fde463dbc9f915e5392f807315bf940334',
		geyserAddress: '0x085a9340ff7692ab6703f17ab5ffc917b580a6fd',
		protocol: 'curve',
	},
	{
		name: 'Harvest Curve.fi crvRenWBTC',
		symbol: 'hrenBTCCRV',
		depositToken: TOKENS.CRV_RENBTC,
		settToken: '0xaf5a1decfa95baf63e0084a35c62592b774a2a87',
		geyserAddress: '0xed0b7f5d9f6286d00763b0ffcba886d8f9d56d5e',
		protocol: 'curve',
	},
	{
		name: 'Badger',
		symbol: 'BADGER',
		depositToken: TOKENS.BADGER,
		settToken: '0x19d97d8fa813ee2f51ad4b4e04ea08baf4dffc28',
		geyserAddress: '0xa9429271a28f8543efffa136994c0839e7d7bf77',
	},
	{
		name: 'Uniswap Wrapped BTC/Badger',
		symbol: 'BADGER-WBTC',
		depositToken: TOKENS.UNI_BADGER_WBTC,
		settToken: '0x235c9e24d3fb2fafd58a2e49d454fdcd2dbf7ff1',
		geyserAddress: '0xa207d69ea6fb967e54baa8639c408c31767ba62d',
		protocol: 'uniswap',
	},
	{
		name: 'Sushiswap Wrapped BTC/Wrapped Ether',
		symbol: 'SLP-WBTC-ETH',
		depositToken: TOKENS.SUSHI_ETH_WBTC,
		settToken: '0x758a43ee2bff8230eeb784879cdcff4828f2544d',
		geyserAddress: '0x612f681bcd12a0b284518d42d2dbcc73b146eb65',
		protocol: 'sushiswap',
	},
	{
		name: 'Sushiswap Wrapped BTC/Badger',
		symbol: 'SLP-BADGER-WBTC',
		depositToken: TOKENS.SUSHI_BADGER_WBTC,
		settToken: '0x1862a18181346ebd9edaf800804f89190def24a5',
		geyserAddress: '0xb5b654efba23596ed49fade44f7e67e23d6712e7',
		protocol: 'sushiswap',
	},
	{
		name: 'Digg',
		symbol: 'DIGG',
		depositToken: TOKENS.DIGG,
		settToken: '0x7e7e112a68d8d2e221e11047a72ffc1065c38e1a',
	},
	{
		name: 'Uniswap Wrapped BTC/Digg',
		symbol: 'DIGG-WBTC',
		depositToken: TOKENS.UNI_DIGG_WBTC,
		settToken: '0xc17078fdd324cc473f8175dc5290fae5f2e84714',
		geyserAddress: '0x0194b5fe9ab7e0c43a08acbb771516fc057402e7',
		protocol: 'uniswap',
	},
	{
		name: 'Sushiswap Wrapped BTC/Digg',
		symbol: 'SLP-DIGG-WBTC',
		depositToken: TOKENS.SUSHI_DIGG_WBTC,
		settToken: '0x88128580acdd9c04ce47afce196875747bf2a9f6',
		geyserAddress: '0x7f6fe274e172ac7d096a7b214c78584d99ca988b',
		protocol: 'sushiswap',
	},
];
