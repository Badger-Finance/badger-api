import { getDataMapper, getVaultEntityId } from '../aws/dynamodb.utils';
import { VaultYieldEvent } from '../aws/models/vault-yield-event.model';
import { getSupportedChains } from '../chains/chains.utils';
import { loadYieldEvents, queryLastHarvestBlock } from '../vaults/harvests.utils';

export async function updateVaultHarvests() {
  const chains = getSupportedChains();
  const mapper = getDataMapper();

  for (const chain of chains) {
    const vaults = await chain.vaults.all();

    for (const vault of vaults) {
      try {
        const lastHarvestBlock = await queryLastHarvestBlock(chain, vault);
        const yieldEvents = await loadYieldEvents(chain, vault, lastHarvestBlock);

        if (yieldEvents.length === 0) {
          console.log(`${vault.name} is up to date.`);
          continue;
        }

        const yieldEventEntities: VaultYieldEvent[] = yieldEvents.map((e) => {
          const yieldEvent: VaultYieldEvent = {
            id: getVaultEntityId(chain, vault),
            chain: chain.network,
            vault: vault.address,
            ...e,
          };
          return Object.assign(new VaultYieldEvent(), yieldEvent);
        });

        for await (const _ of mapper.batchPut(yieldEventEntities)) {
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  return 'done';
}
