import { getAccounts } from '../accounts/accounts.utils';
import { loadChains } from '../chains/chain';
import { SettsService } from '../setts/setts.service';
import { ProtocolMetrics, ProtocolSettsMetrics } from './interfaces/metrics.interface';

const chains = loadChains();

export const getProtocolMetrics = async (): Promise<ProtocolMetrics> => {
  const [totalUsers, settMetrics] = await Promise.all([getTotalUsers(), getSettsMetrics()]);
  return { ...settMetrics, totalUsers };
};

export const getSettsMetrics = async (): Promise<ProtocolSettsMetrics> => {
  const settsService = new SettsService();
  const multichainsSummary = await Promise.all(chains.map((chain) => settsService.getProtocolSummary(chain)));

  console.log({ multichainsSummary });

  let totalValueLocked = 0;
  let totalVaults = 0;

  for (const protocolSummary of multichainsSummary) {
    totalValueLocked += protocolSummary.totalValue;
    totalVaults += protocolSummary.setts?.length ?? 0;
  }

  return { totalValueLocked, totalVaults };
};

export const getTotalUsers = async (): Promise<number> => {
  const usersAcrossChains = await Promise.all(chains.map((chain) => getAccounts(chain)));
  return new Set([...usersAcrossChains.flat()]).size;
};
