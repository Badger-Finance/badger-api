import { getAccounts } from '../accounts/accounts.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { ProtocolSummary } from '../protocols/interfaces/protocol-summary.interface';
import { getCachedVault } from '../vaults/vaults.utils';
import { ProtocolMetrics, ProtocolSettsMetrics } from './interfaces/metrics.interface';

export const getProtocolMetrics = async (): Promise<ProtocolMetrics> => {
  const [totalUsers, settMetrics] = await Promise.all([getProtocolTotalUsers(), getProtocolSettMetrics()]);
  return { ...settMetrics, totalUsers };
};

export async function getProtocolTotalUsers(): Promise<number> {
  const chains = loadChains();
  const usersAcrossChains = await Promise.all(chains.map((chain) => getAccounts(chain)));
  return new Set([...usersAcrossChains.flat()]).size;
}

export async function getProtocolSettMetrics(): Promise<ProtocolSettsMetrics> {
  const chains = loadChains();
  const multichainsSummary = await Promise.all(chains.map((chain) => getChainMetrics(chain)));

  let totalValueLocked = 0;
  let totalVaults = 0;

  for (const protocolSummary of multichainsSummary) {
    totalValueLocked += protocolSummary.totalValue;
    totalVaults += protocolSummary.setts?.length ?? 0;
  }

  return { totalValueLocked, totalVaults };
}

export async function getChainMetrics(chain: Chain): Promise<ProtocolSummary> {
  const setts = await Promise.all(chain.setts.map((sett) => getCachedVault(sett)));
  const totalValue = setts.reduce((total, sett) => total + sett.value, 0);

  return { totalValue, setts: setts.map(({ name, balance, value }) => ({ name, balance, value })) };
}
