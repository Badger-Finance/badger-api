import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { getLastCompoundHarvest, getVaultHarvestsOnChain } from '../vaults/vaults.utils';
import { HarvestCompoundData } from '../aws/models/harvest-compound.model';
import { VaultHarvestsExtended } from '../vaults/interfaces/vault-harvest-extended.interface';

/**
 * Save compound data for all vaults harvests, on all chains
 */
export async function indexVaultsHarvestsCompund() {
  console.log('IndexVaultsHarvestsCompund job has started!');

  const chains = loadChains();

  for (const chain of chains) {
    const mapper = getDataMapper();
    const sdk = await chain.getSdk();

    for (const vault of chain.vaults) {
      try {
        const lastCompHarvest = await getLastCompoundHarvest(vault.vaultToken);

        const harvests = await getVaultHarvestsOnChain(chain, vault.vaultToken, sdk, lastCompHarvest?.block);

        if (!harvests || harvests.length === 0) {
          console.warn(`Empty harvests for vault ${vault.vaultToken}`);
          continue;
        }

        await Promise.all(
          harvests.map(async (harvest) => {
            const harvestToSave: VaultHarvestsExtended = {
              ...harvest,
              vault: vault.vaultToken,
            };
            return mapper.put(Object.assign(new HarvestCompoundData(), harvestToSave));
          }),
        );
      } catch (err) {
        console.error(err);
      }
    }
  }
}
