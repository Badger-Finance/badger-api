import {
	EventInput,
	getBlock,
	getIndexedBlock,
	GetPriceFunc,
	getSett,
	respond,
	saveItem,
	THIRTY_MIN_BLOCKS,
} from '../util/util';

const ASSET_DATA = process.env.ASSET_DATA || ''; // FIXME: sane defaults?

export const indexAsset = async (event: EventInput, getPrice: GetPriceFunc) => {
	const { asset, createdBlock, contract } = event;
	let block = await getIndexedBlock(ASSET_DATA, asset, createdBlock);
	console.log(`Index ${asset} at height: ${block}`);

	while (true) {
		const sett = await getSett(contract, block);

		if (sett.errors != undefined) {
			break;
		}

		if (sett.data == null || sett.data.sett == null) {
			block += THIRTY_MIN_BLOCKS;
			continue;
		}

		const { balance, totalSupply, pricePerFullShare } = sett.data.sett;

		const decimals = asset === 'digg' ? 9 : 18;
		const blockData = await getBlock(block);
		const timestamp = Number(blockData.timestamp) * 1000;
		const balanceComputed = balance / Math.pow(10, decimals);
		const supply = totalSupply / Math.pow(10, decimals);
		const ratio = pricePerFullShare / Math.pow(10, 18);
		const value = balanceComputed * (await getPrice(sett));

		const snapshot = {
			asset: asset,
			height: block,
			timestamp: timestamp,
			balance: balance,
			supply: supply,
			ratio: ratio,
			value: parseFloat(value.toFixed(2)),
		};

		await saveItem(ASSET_DATA, snapshot);
		block += THIRTY_MIN_BLOCKS;
	}

	return respond(200); // FIXME: is this right?
};
