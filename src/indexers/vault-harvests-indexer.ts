import { getDataMapper, getVaultEntityId } from '../aws/dynamodb.utils';
import { VaultYieldEvent } from '../aws/models/vault-yield-event.model';
import { getSupportedChains } from '../chains/chains.utils';
import { rfw } from '../utils/retry.utils';
import { HARVEST_SCAN_BLOCK_INCREMENT, loadYieldEvents } from '../vaults/harvests.utils';

export async function updateVaultHarvests() {
  const chains = getSupportedChains();
  const mapper = getDataMapper();

  for (const chain of chains) {
    const sdk = await chain.getSdk();
    const currentBlock = await rfw(sdk.provider.getBlockNumber)();
    const vaults = await rfw(chain.vaults.all, chain.vaults)();

    await Promise.all(
      vaults.map(async (vault) => {
        try {
          const { name, protocol, lastHarvestIndexedBlock } = vault;
          const vaultId = [protocol, name].join(' ');

          const yieldEvents = await rfw(loadYieldEvents)(chain, vault, lastHarvestIndexedBlock);

          if (yieldEvents.length === 0) {
            vault.lastHarvestIndexedBlock = Math.min(
              vault.lastHarvestIndexedBlock + HARVEST_SCAN_BLOCK_INCREMENT,
              currentBlock,
            );
            // update the vault's last harvested indexed block, done twice to not update before persist
            try {
              await mapper.put(vault);
            } catch (err) {
              console.log({ err, vault, message: `Failed to persist vault definition for ${vault.name}` });
            }
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
          console.log({ err, vault, message: `Failed to persist vault definition for ${vault.name}` });
        }
      }),
    );
  }

  return 'done';
}
