import { getAccounts } from '../accounts/accounts.utils';
import { loadChains } from '../chains/chain';
import { ProtocolMetrics, ProtocolSettsMetrics } from './interfaces/metrics.interface';
import { Chain } from '../chains/config/chain.config';
import { ProtocolSummary } from '../protocols/interfaces/protocol-summary.interface';
import { getCachedSett } from '../setts/setts.utils';

const chains = loadChains();

export const getProtocolMetrics = async (): Promise<ProtocolMetrics> => {
  const [totalUsers, settMetrics] = await Promise.all([getTotalUsers(), getProtocolSettMetrics()]);
  return { ...settMetrics, totalUsers };
};

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
  const setts = await Promise.all(chain.setts.map((sett) => getCachedSett(sett)));
  const totalValue = setts.reduce((total, sett) => total + sett.value, 0);

  return { totalValue, setts: setts.map(({ name, balance, value }) => ({ name, balance, value })) };
}

export async function getTotalUsers(): Promise<number> {
  const usersAcrossChains = await Promise.all(chains.map((chain) => getAccounts(chain)));
  return new Set([...usersAcrossChains.flat()]).size;
}
