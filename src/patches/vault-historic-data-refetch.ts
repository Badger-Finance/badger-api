import { ChartTimeFrame } from '@badger-dao/sdk';
import { ethers } from 'ethers';

import { getDataMapper, getVaultEntityId } from '../aws/dynamodb.utils';
import { ChartDataBlob } from '../aws/models/chart-data-blob.model';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { getSupportedChains } from '../chains/chains.utils';
import { toChartDataKey } from '../charts/charts.utils';
import { getEnvVar } from '../config/config.utils';
import { VaultStrategy } from '../vaults/interfaces/vault-strategy.interface';
import { getStrategyInfo } from '../vaults/vaults.utils';

/**
 * Run Patch
 * npx ts-node -r dotenv/config src/patches/vault-historic-data-refetch.ts
 *
 * Target Patch
 * STAGE=staging | prod
 * VAULT="0x..."
 *
 * Requires DDB write access + MFA authentication to patch.
 *
 * Due IO errors in indexer, default vaules could be saved in DDB and corrapt data in charts
 * This patch will update the charts with the correct data.
 *
 * Data to be updated:
 * - `strategy` field
 *
 * https://github.com/Badger-Finance/badger-api/issues/1539
 */

async function vaultHistoricDataRefetch() {
  console.log('Patch:VaultSnapshotRefetch - Started');

  getEnvVar('STAGE');

  const vaultAddress = getEnvVar('VAULT');

  const mapper = getDataMapper();

  for (const chain of getSupportedChains()) {
    let vault: VaultDefinitionModel;

    try {
      vault = await chain.vaults.getVault(vaultAddress);
    } catch (err) {
      console.log(`Patch:VaultSnapshotRefetch - 
      Vault ${vaultAddress} not found for chain ${chain.network}. Next tick...`);
      continue;
    }

    const vaultEntityId = getVaultEntityId(chain, vault);

    let strategyInfo: VaultStrategy | undefined;

    for (const timeframe of Object.values(ChartTimeFrame)) {
      const vaultChartDataKey = toChartDataKey(HistoricVaultSnapshotModel.NAMESPACE, vaultEntityId, timeframe);

      let cachedChart: ChartDataBlob<HistoricVaultSnapshotModel> | undefined;

      try {
        const searchKey = Object.assign(new ChartDataBlob<HistoricVaultSnapshotModel>(), {
          id: vaultChartDataKey,
        });

        cachedChart = await mapper.get(searchKey);
      } catch (e) {
        console.debug(`
          Patch:VaultSnapshotRefetch - 
          Unable to query cached chart, for vault ${vaultChartDataKey} may simply not exist.
          ${e}
        `);
        cachedChart = undefined;
      }

      if (!cachedChart) continue;

      for (const snapshot of cachedChart.data) {
        if (!snapshot.strategy || (snapshot.strategy && snapshot.strategy.address === ethers.constants.AddressZero)) {
          try {
            strategyInfo = await getStrategyInfo(chain, vault, { blockTag: snapshot.block });
          } catch (err) {
            console.error(`
              Patch:VaultSnapshotRefetch - Failed to fetch strategyInfo
              for vaultChartDataKey ${vaultChartDataKey}
            ${err}`);

            continue;
          }

          snapshot.strategy = strategyInfo;
        }
      }

      try {
        await mapper.put(cachedChart);
      } catch (err) {
        console.error(`Patch:VaultSnapshotRefetch - Failed to save 
        vault chart data for ${vaultChartDataKey}. ${err}`);
      }

      console.log(`Patch:VaultSnapshotRefetch - Chart ${cachedChart.id} updated.`);
    }
  }

  console.log('Patch:VaultSnapshotRefetch - Finished');
}

vaultHistoricDataRefetch();
