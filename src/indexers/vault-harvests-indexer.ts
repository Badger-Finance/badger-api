import { getDataMapper, getVaultEntityId } from '../aws/dynamodb.utils';
import { VaultYieldEvent } from '../aws/models/vault-yield-event.model';
import { getSupportedChains } from '../chains/chains.utils';
import { loadYieldEvents } from '../vaults/harvests.utils';

export async function updateVaultHarvests() {
  const chains = getSupportedChains();
  const mapper = getDataMapper();

  for (const chain of chains) {
    const sdk = await chain.getSdk();
    const currentBlock = await sdk.provider.getBlockNumber();
    const vaults = await chain.vaults.all();

    for (const vault of vaults) {
      try {
        const { name, lastHarvestIndexedBlock } = vault;

        console.log(`[${name}]: Last Indexed Block ${lastHarvestIndexedBlock}`);
        const yieldEvents = await loadYieldEvents(chain, vault, lastHarvestIndexedBlock);
        console.log(`[${name}]: Discovered ${yieldEvents.length} yield events`);

        if (yieldEvents.length === 0) {
          vault.lastHarvestIndexedBlock = currentBlock;
          console.log(`[${vault.name}]: Yield events up to date as of block: ${vault.lastHarvestIndexedBlock}`);
          // update the vault's last harvested indexed block, done twice to not update before persist
          await mapper.put(vault);
          continue;
        }

        vault.lastHarvestIndexedBlock = yieldEvents[yieldEvents.length - 1].block;
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
        console.log(`[${vault.name}]: Yield events up to date as of block: ${vault.lastHarvestIndexedBlock}`);
        await mapper.put(vault);

        console.log(`[${vault.name}]: Persisted ${yieldEventEntities.length} yield events`);
      } catch (err) {
        console.error(err);
      }
    }
  }

  return 'done';
}
