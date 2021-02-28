import { ASSET_DATA } from '../util/constants';
import {
	EventInput,
	getBlock,
	getIndexedBlock,
	GetPriceFunc,
	getSett,
	saveItem,
	THIRTY_MIN_BLOCKS,
} from '../util/util';

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

		const { balance, totalSupply, pricePerFullShare, token } = sett.data.sett;

		const blockData = await getBlock(block);
		const timestamp = Number(blockData.timestamp) * 1000;
		const tokenBalance = balance / Math.pow(10, token.decimals);
		const supply = totalSupply / Math.pow(10, token.decimals);
		const ratio = pricePerFullShare / Math.pow(10, 18);
		const value = tokenBalance * (await getPrice(sett)).usd;

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
};
