import BadgerSDK, { Erc20__factory, formatBalance, Vault__factory } from '@badger-dao/sdk';
import { getRewardsOnchain } from '../citadel/citadel.utils';
import { getDataMapper } from '../aws/dynamodb.utils';
import { CitadelRewardsSnapshot } from '../aws/models/citadel-rewards-snapshot';
import { RewardEventType, RewardEventTypeEnum } from '@badger-dao/sdk/lib/citadel/enums/reward-event-type.enum';
import { getPrice } from '../prices/prices.utils';
import { ONE_YEAR_SECONDS } from '../config/constants';
import { TOKENS } from '../config/tokens.config';
import { Ethereum } from '../chains/config/eth.config';

export async function indexAllRewards() {
  const chain = new Ethereum();
  const sdk = await chain.getSdk();

  try {
    await saveCitadelRewards(sdk, RewardEventTypeEnum.PAID);
  } catch (e) {
    console.warn(`Failed to save citadel paid rewards. ${e}`);
  }

  try {
    await saveCitadelRewards(sdk, RewardEventTypeEnum.ADDED);
  } catch (e) {
    console.warn(`Failed to save citadel added rewards. ${e}`);
  }

  return 'done';
}

async function saveCitadelRewards(sdk: BadgerSDK, type: RewardEventType) {
  const mapper = getDataMapper();

  const chainRewards = await getRewardsOnchain(sdk, type, true);

  const tokenDecimalMap: Record<string, number> = {};
  const tokenFinshMap: Record<string, number> = {};
  const tokenPriceMap: Record<string, number> = {};

  if (!chainRewards || chainRewards?.length === 0) {
    console.warn(`No new ${type} rewards found, skip`);
    return;
  }

  const citadel = Erc20__factory.connect(TOKENS.CTDL, sdk.provider);
  const citadelDecimals = await citadel.decimals();

  const xCitadel = Vault__factory.connect(TOKENS.XCTDL, sdk.provider);
  const tvl = formatBalance(await xCitadel.balance(), citadelDecimals);

  for (const event of chainRewards) {
    let tokenDecimals = tokenDecimalMap[event.token];

    if (!tokenDecimals) {
      const tokenContract = Erc20__factory.connect(event.token, sdk.provider);
      tokenDecimals = await tokenContract.decimals();

      tokenDecimalMap[event.token] = tokenDecimals;
    }

    const amount = formatBalance(event.reward, tokenDecimals);

    const account = type === RewardEventTypeEnum.PAID ? event.user : event.account;

    if (!account) throw new Error('Empty account data in onchain response');

    const rewardToSave: CitadelRewardsSnapshot = {
      account,
      createdAt: Date.now(),
      block: <number>event.block,
      token: event.token,
      payType: type,
      amount,
    };

    if (type === RewardEventTypeEnum.PAID) {
      await mapper.put(Object.assign(new CitadelRewardsSnapshot(), rewardToSave));
      continue;
    }

    rewardToSave.dataType = event.dataTypeHash;
    rewardToSave.startTime = event.timestamp;

    let finishTime = tokenFinshMap[event.token];

    if (!finishTime) {
      finishTime = (await sdk.citadel.getRewardStats(event.token))?.[1];
      tokenFinshMap[event.token] = finishTime;
    }

    if (!finishTime) {
      finishTime = Date.now();
      console.warn(`Failed to get finish time for ${event.token}`);
    }

    rewardToSave.finishTime = finishTime;

    let tokenPrice = tokenPriceMap[event.token];

    if (!tokenPrice) {
      // can be 0, then apr will be 0 to
      tokenPrice = (await getPrice(event.token)).price;
      tokenPriceMap[event.token] = tokenPrice;
    }

    const durationScalar = ONE_YEAR_SECONDS / (finishTime - <number>event.timestamp);
    const yearlyEmission = tokenPrice * amount * durationScalar;

    rewardToSave.apr = (yearlyEmission / tvl) * 100;

    await mapper.put(Object.assign(new CitadelRewardsSnapshot(), rewardToSave));
  }
}
