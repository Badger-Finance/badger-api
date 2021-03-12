import { GraphQLClient } from 'graphql-request';
import { ASSET_DATA, BADGER_URL } from '../config/constants';
import { EventInput, getBlock, getIndexedBlock, GetPriceFunc, saveItem, THIRTY_MIN_BLOCKS } from '../config/util';
import { getSdk } from '../graphql/generated/badger';

export const indexAsset = async (event: EventInput, getPrice: GetPriceFunc) => {
	const badgerGraphqlClient = new GraphQLClient(BADGER_URL);
	const badgerGraphqlSdk = getSdk(badgerGraphqlClient);
	const { asset, createdBlock, contract } = event;
	let block = await getIndexedBlock(ASSET_DATA, asset, createdBlock);

	while (true) {
		const sett = await badgerGraphqlSdk.Sett({
			id: contract,
			block: {
				number: block,
			},
		});

		if (sett.sett == null) {
			block += THIRTY_MIN_BLOCKS;
			continue;
		}

		const { balance, totalSupply, pricePerFullShare, token } = sett.sett;

		const blockData = await getBlock(block);
		const timestamp = Number(blockData.timestamp) * 1000;
		const tokenBalance = balance / Math.pow(10, token.decimals);
		const supply = totalSupply / Math.pow(10, token.decimals);
		const ratio = pricePerFullShare / Math.pow(10, 18);
		const value = tokenBalance * (await getPrice(sett.sett)).usd;

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
