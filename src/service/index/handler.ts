import fetch from 'node-fetch';
import { PICKLE_URL, REWARD_DATA_TABLE } from '../util/constants';

import { EventInput, getBlock, getIndexedBlock, respond, saveItem, THIRTY_MIN_BLOCKS } from '../util/util';

export const handler = async (event: EventInput) => {
	const { asset, createdBlock, contract } = event;
	let block = await getIndexedBlock(REWARD_DATA_TABLE, asset, createdBlock);
	console.log(`Index rewards contract ${asset} at height: ${block}`);

	while (true) {
		const rewards = await queryRewardsContract(contract, block);
		console.log('Block: ', block, rewards);

		if (rewards.errors != undefined) {
			break;
		}

		if (rewards.data == null || rewards.data.rewardContract == null) {
			block += THIRTY_MIN_BLOCKS;
			continue;
		}

		const rewardsData = rewards.data.rewardContract;
		const blockData = await getBlock(block);
		const timestamp = Number(blockData.timestamp) * 1000;
		const staked = ((rewardsData.stakedTokens / rewardsData.stakingTokenTotalSupply) * 100).toFixed(2);
		const total = rewardsData.totalRewards / Math.pow(10, 18);
		const current = rewardsData.currentRewards / Math.pow(10, 18);

		const snapshot = {
			asset: asset,
			height: block,
			timestamp: timestamp,
			staked: staked,
			total: total,
			current: current,
		};

		await saveItem(REWARD_DATA_TABLE, snapshot);
		block += THIRTY_MIN_BLOCKS;
	}

	return respond(200);
};

const queryRewardsContract = async (contract: string, block: number) => {
	const query = `
    {
      rewardContract(id: "${contract}", block: {number: ${block}}) {
        totalRewards
        currentRewards
        stakedTokens
        stakingTokenTotalSupply
      }
    }
  `;
	const queryResult = await fetch(PICKLE_URL, {
		method: 'POST',
		body: JSON.stringify({ query }),
	});
	return queryResult.json();
};
