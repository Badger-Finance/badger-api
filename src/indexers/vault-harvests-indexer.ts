import { getDataMapper, getVaultEntityId } from '../aws/dynamodb.utils';
import { VaultYieldEvent } from '../aws/models/vault-yield-event.model';
import { getSupportedChains } from '../chains/chains.utils';
import { HARVEST_SCAN_BLOCK_INCREMENT, loadYieldEvents } from '../vaults/harvests.utils';

export async function updateVaultHarvests() {
  const chains = getSupportedChains();
  const mapper = getDataMapper();

  for (const chain of chains) {
    const sdk = await chain.getSdk();
    const currentBlock = await sdk.provider.getBlockNumber();
    const vaults = await chain.vaults.all();

    await Promise.all(
      vaults.map(async (vault) => {
        try {
          const { name, protocol, lastHarvestIndexedBlock } = vault;
          const vaultId = [protocol, name].join(' ');

          console.time(`${vault.address}`);
          const yieldEvents = await loadYieldEvents(chain, vault, lastHarvestIndexedBlock);
          console.timeEnd(`${vault.address}`);

          if (yieldEvents.length === 0) {
            vault.lastHarvestIndexedBlock = Math.min(
              vault.lastHarvestIndexedBlock + HARVEST_SCAN_BLOCK_INCREMENT,
              currentBlock,
            );
            console.log(`[${vaultId}]: Yield events up to date as of block: ${vault.lastHarvestIndexedBlock}`);
            // update the vault's last harvested indexed block, done twice to not update before persist
            await mapper.put(vault);
            return;
          }

          // sort to highest timestamp (block) is at the end
          const sortedEvents = yieldEvents.sort((a, b) => a.timestamp - b.timestamp);
          vault.lastHarvestIndexedBlock = sortedEvents[sortedEvents.length - 1].block;
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
          await mapper.put(vault);
          console.log(`[${vaultId}]: Yield events up to date as of block: ${vault.lastHarvestIndexedBlock}`);
        } catch (err) {
          console.error(err);
        }
      }),
    );
  }

  return 'done';
}
