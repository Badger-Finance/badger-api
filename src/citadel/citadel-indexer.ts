import { Erc20__factory, formatBalance, Protocol } from '@badger-dao/sdk';
import { getCachedAccount } from '../accounts/accounts.utils';
import { Ethereum } from '../chains/config/eth.config';
import { getPrice } from '../prices/prices.utils';
import { VaultsService } from '../vaults/vaults.service';
import { getVaultDefinition } from '../vaults/vaults.utils';
import { CITADEL_TREASURY_ADDRESS, TRACKED_TOKENS, TRACKED_VAULTS } from './config/citadel-treasury.config';
import { TreasuryPosition } from '../treasury/interfaces/treasy-position.interface';
import { TreasurySummary } from '../treasury/interfaces/treasury-summary.interface';
import { getDataMapper } from '../aws/dynamodb.utils';
import { TreasurySummarySnapshot } from '../aws/models/treasury-summary-snapshot.model';
import { TOKEN_PRICE_DATA, TREASURY_HISTORIC_DATA, TREASURY_SNAPSHOT_DATA } from '../config/constants';

export async function snapshotTreasury() {
  const chain = new Ethereum();
  const sdk = await chain.getSdk();

  const lookupTokens = TRACKED_TOKENS.concat(TRACKED_VAULTS);
  const tokenInformation = await sdk.tokens.loadTokens(lookupTokens);

  const vaultPositions = new Set(TRACKED_VAULTS);
  const treasuryPositions: TreasuryPosition[] = await Promise.all(
    Object.entries(tokenInformation).map(async (e) => {
      const [address, token] = e;
      const isFarming = vaultPositions.has(address);

      const contract = Erc20__factory.connect(address, sdk.provider);
      const treasuryBalance = await contract.balanceOf(CITADEL_TREASURY_ADDRESS);

      const { price } = await getPrice(address);
      const balance = formatBalance(treasuryBalance, token.decimals);
      const value = price * balance;

      if (!isFarming) {
        return {
          ...token,
          balance,
          value,
          apr: 0,
          protocol: 'none',
        };
      }

      const { apr, minApr, maxApr } = await VaultsService.loadVault(chain, getVaultDefinition(chain, address));
      const { boost } = await getCachedAccount(chain, CITADEL_TREASURY_ADDRESS);
      const percentile = boost / 2000;

      let treasuryApr;
      if (minApr && maxApr) {
        treasuryApr = minApr + (maxApr - minApr) * percentile;
      } else {
        treasuryApr = apr;
      }

      return {
        ...token,
        balance,
        value,
        apr: treasuryApr,
        protocol: Protocol.Badger,
      };
    }),
  );

  const positions = treasuryPositions.filter((p) => p.value > 0);
  const value = positions.reduce((total, position) => (total += position.value), 0);

  let tvlApr = 0;
  positions.forEach((p) => {
    if (p.apr > 0) {
      tvlApr += p.apr * p.value;
    }
  });

  const treasuryYield = value === 0 ? 0 : tvlApr / value;

  const treasurySummary: TreasurySummary = {
    address: CITADEL_TREASURY_ADDRESS,
    value,
    yield: treasuryYield,
    positions,
  };

  const mapper = getDataMapper();

  console.log({ TREASURY_SNAPSHOT_DATA, TREASURY_HISTORIC_DATA, TOKEN_PRICE_DATA });
  // capture a current view of the treasury
  try {
    const currentSnapshot = Object.assign(new TreasurySummarySnapshot(), treasurySummary);
    console.log(currentSnapshot);
    await mapper.put(currentSnapshot);
  } catch (err) {
    console.error({ message: 'Unable to save Ctiadel treasury snapshot', err });
  }
}
