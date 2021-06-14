import { ethers } from "ethers";
import { Chain } from "../../chains/config/chain.config";
import { cvxRewardsAbi } from "../../config/abi/cvx-rewards.abi";
import { cvxCrvRewardsAbi } from "../../config/abi/cvxcrv-rewards.abi";
import { ONE_YEAR_SECONDS, TOKENS } from "../../config/constants";
import { getPrice } from "../../prices/prices.utils";
import { SourceType } from "../../protocols/enums/source-type.enum";
import { CachedValueSource } from "../../protocols/interfaces/cached-value-source.interface";
import { uniformPerformance } from "../../protocols/interfaces/performance.interface";
import { createValueSource } from "../../protocols/interfaces/value-source.interface";
import { SettDefinition } from "../../setts/interfaces/sett-definition.interface";
import { getCachedSett } from "../../setts/setts.utils";
import { valueSourceToCachedValueSource } from "../indexer.utils";

/* Strategy Definitions */
export const cvxRewards = '0xCF50b810E57Ac33B91dCF525C6ddd9881B139332';
export const cvxCrvRewards = '0x3Fe65692bfCD0e6CF84cB1E7d24108E434A7587e';

export async function getConvexApySnapshots(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  return Promise.all([getCvxRewards(chain, settDefinition), getCvxCrvRewards(chain, settDefinition)]);
}

async function getCvxRewards(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource> {
  const sett = await getCachedSett(settDefinition);
  const cvx = new ethers.Contract(cvxRewards, cvxRewardsAbi, chain.provider);
  const cvxPrice = await getPrice(TOKENS.CVX);
  const cvxCrvPrice = await getPrice(TOKENS.CVXCRV);
  const cvxReward = parseFloat(ethers.utils.formatEther(await cvx.currentRewards()));
  const cvxCrvLocked = parseFloat(ethers.utils.formatEther(await cvx.totalSupply()));
  const duration: number = await cvx.duration();
  const scalar = ONE_YEAR_SECONDS / duration;
  const emission = cvxReward * cvxPrice.usd * scalar;
  const poolValue = cvxCrvLocked * cvxCrvPrice.usd;
  const poolApr = emission / poolValue * 100;
  const settBalance = parseFloat(ethers.utils.formatEther(await cvx.balanceOf('0xCF50b810E57Ac33B91dCF525C6ddd9881B139332')));
  console.log({ poolApr, settBalance });
  const valueSource = createValueSource('CVX Rewards', uniformPerformance(poolApr));
  return valueSourceToCachedValueSource(valueSource, settDefinition, SourceType.Emission);
}

async function getCvxCrvRewards(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource> {
  const cvxCrv = new ethers.Contract(cvxCrvRewards, cvxCrvRewardsAbi, chain.provider);
  // const cvxRewards = 
  const valueSource = createValueSource('cvxCRV Rewards', uniformPerformance(0));
  return valueSourceToCachedValueSource(valueSource, settDefinition, SourceType.Emission);
}
