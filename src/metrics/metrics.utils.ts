import { getAccounts } from "../accounts/accounts.utils";
import { SUPPORTED_CHAINS } from "../chains/chain";
import { Chain } from "../chains/config/chain.config";
import { ProtocolSummary } from "../protocols/interfaces/protocol-summary.interface";
import { getCachedVault } from "../vaults/vaults.utils";
import { ProtocolMetrics, ProtocolSettsMetrics } from "./interfaces/metrics.interface";

export const getProtocolMetrics = async (): Promise<ProtocolMetrics> => {
  const [totalUsers, settMetrics] = await Promise.all([getProtocolTotalUsers(), getProtocolSettMetrics()]);
  return { ...settMetrics, totalUsers };
};

export async function getProtocolTotalUsers(): Promise<number> {
  const usersAcrossChains = await Promise.all(SUPPORTED_CHAINS.map((chain) => getAccounts(chain)));
  return new Set([...usersAcrossChains.flat()]).size;
}

export async function getProtocolSettMetrics(): Promise<ProtocolSettsMetrics> {
  const multichainsSummary = await Promise.all(SUPPORTED_CHAINS.map((chain) => getChainMetrics(chain)));

  let totalValueLocked = 0;
  let totalVaults = 0;

  for (const protocolSummary of multichainsSummary) {
    totalValueLocked += protocolSummary.totalValue;
    totalVaults += protocolSummary.setts?.length ?? 0;
  }

  return { totalValueLocked, totalVaults };
}

export async function getChainMetrics(chain: Chain): Promise<ProtocolSummary> {
  const vaults = await chain.vaults.all();
  const chainVaults = await Promise.all(vaults.map((vault) => getCachedVault(chain, vault)));
  const totalValue = chainVaults.reduce((total, vault) => total + vault.value, 0);
  const vaultSummaries = chainVaults.map(({ name, balance, value }) => ({ name, balance, value }));
  return { totalValue, setts: vaultSummaries, vaults: vaultSummaries };
}
