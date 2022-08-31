import { getDataMapper, getVaultEntityId } from '../aws/dynamodb.utils';
import { HARVEST_SCAN_START_BLOCK } from '../aws/models/vault-definition.model';
import { VaultYieldEvent } from '../aws/models/vault-yield-event.model';
import { getSupportedChains } from '../chains/chains.utils';
import { HARVEST_SCAN_BLOCK_INCREMENT, loadYieldEvents } from '../vaults/harvests.utils';
import { YieldEvent } from '../vaults/interfaces/yield-event';

export async function updateVaultHarvests() {
  const chains = getSupportedChains();
  const mapper = getDataMapper();

  for (const chain of chains) {
    const sdk = await chain.getSdk();
    const currentBlock = await sdk.provider.getBlockNumber();
    const vaults = await chain.vaults.all();

    for (const vault of vaults) {
      try {
        // temporary fallback for handling non updated last harvest indexed blocks
        let lastHarvestBlock = vault.lastHarvestIndexedBlock ?? HARVEST_SCAN_START_BLOCK;
        let yieldEvents: YieldEvent[] = [];

        console.log(`[${vault.name}]: Last Indexed Block ${lastHarvestBlock}`);
        while (true) {
          yieldEvents = await loadYieldEvents(chain, vault, lastHarvestBlock);
          console.log(`[${vault.name}]: Discovered ${yieldEvents.length} yield events`);

          // found some events, let's check them out
          if (yieldEvents.length > 0) {
            break;
          } else {
            lastHarvestBlock += HARVEST_SCAN_BLOCK_INCREMENT;
            console.log(
              `[${vault.name}]: Increment block scan to ${lastHarvestBlock} - ${
                lastHarvestBlock + HARVEST_SCAN_BLOCK_INCREMENT
              }`,
            );
          }

          // we are checking blocks that do not exist yet, and found no sources - we are up to date!
          if (lastHarvestBlock >= currentBlock) {
            break;
          }
        }

        if (yieldEvents.length === 0) {
          console.log(`${vault.name} is up to date.`);
          continue;
        }

        const baseId = getVaultEntityId(chain, vault);
        const yieldEventEntities: VaultYieldEvent[] = yieldEvents.map((e) => {
          const yieldEvent: VaultYieldEvent = {
            id: [baseId, e.token, e.type].join('-').replace(/ /g, '-').toLowerCase(),
            chainAddress: baseId,
            chain: chain.network,
            vault: vault.address,
            ...e,
          };
          return Object.assign(new VaultYieldEvent(), yieldEvent);
        });

        for await (const _ of mapper.batchPut(yieldEventEntities)) {
        }

        // update the vault's last harvested indexed block
        vault.lastHarvestIndexedBlock = lastHarvestBlock;
        await mapper.put(vault);

        console.log(`[${vault.name}]: Persisted ${yieldEventEntities.length} yield events`);
      } catch (err) {
        console.error(err);
      }
    }
  }

  return 'done';
}
