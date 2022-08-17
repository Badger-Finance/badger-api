import { getDataMapper } from '../aws/dynamodb.utils';
import { HarvestCompoundData } from '../aws/models/harvest-compound.model';
import { getSupportedChains } from '../chains/chains.utils';
import { getLastCompoundHarvest, getVaultHarvestsOnChain } from '../vaults/harvests.utils';
import { VaultHarvestsExtended } from '../vaults/interfaces/vault-harvest-extended.interface';

/**
 * Save compound data for all vaults harvests, on all chains
 */
export async function indexVaultsHarvestsCompund() {
  console.log('IndexVaultsHarvestsCompund job has started!');

  for (const chain of getSupportedChains()) {
    const mapper = getDataMapper();
    const vaults = await chain.vaults.all();

    for (const vault of vaults) {
      try {
        const lastCompHarvest = await getLastCompoundHarvest(vault.address);

        const harvests = await getVaultHarvestsOnChain(chain, vault.address, lastCompHarvest?.block);

        if (!harvests || harvests.length === 0) {
          console.warn(`Empty harvests for vault ${vault.address}`);
          continue;
        }

        await Promise.all(
          harvests.map(async (harvest) => {
            const harvestToSave: VaultHarvestsExtended = {
              ...harvest,
              vault: vault.address,
            };
            return mapper.put(Object.assign(new HarvestCompoundData(), harvestToSave));
          }),
        );
      } catch (err) {
        console.error(err);
      }
    }
  }

  return 'done';
}
