import { getAccounts } from '../accounts/accounts.utils';
import { Chain } from '../chains/config/chain.config';
import { getCachedVault } from '../vaults/vaults.utils';
import { ProtocolMetrics } from './interfaces/metrics.interface';

export async function getChainMetrics(chains: Chain[]): Promise<ProtocolMetrics> {
  let totalUsers = 0;
  let totalValueLocked = 0;
  let totalVaults = 0;

  for (const chain of chains) {
    const accounts = await getAccounts(chain);
    totalUsers += accounts.length;

    const vaults = await chain.vaults.all();
    const chainVaults = await Promise.all(vaults.map((vault) => getCachedVault(chain, vault)));
    const totalValue = chainVaults.reduce((total, vault) => total + vault.value, 0);
    const vaultSummaries = chainVaults.map(({ name, balance, value }) => ({ name, balance, value }));
    totalValueLocked += totalValue;
    totalVaults += vaultSummaries.length;
  }

  return { totalValueLocked, totalVaults, totalUsers };
}
