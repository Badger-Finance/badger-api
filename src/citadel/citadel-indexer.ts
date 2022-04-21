import { Erc20__factory, formatBalance } from '@badger-dao/sdk';
import { getCachedAccount } from '../accounts/accounts.utils';
import { Ethereum } from '../chains/config/eth.config';
import { TOKENS } from '../config/tokens.config';
import { getPrice } from '../prices/prices.utils';
import { VaultsService } from '../vaults/vaults.service';
import { getVaultDefinition } from '../vaults/vaults.utils';
import { CITADEL_TREASURY_ADDRESS, TRACKED_TOKENS, TRACKED_VAULTS } from './config/citadel-treasury.config';
import { TreasuryPosition } from './interfaces/treasy-position.interface';
import { CitadelTreasurySummary } from './interfaces/citadel-treasury-summary.interface';

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
      const balance = await contract.balanceOf(CITADEL_TREASURY_ADDRESS);

      const { price } = await getPrice(address);
      const amount = formatBalance(balance, token.decimals);
      const value = price * amount;

      if (!isFarming) {
        return {
          token,
          amount,
          value,
          apr: 0,
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
        token,
        amount,
        value,
        apr: treasuryApr,
      };
    }),
  );

  const positions = treasuryPositions.filter((p) => p.value > 0);
  const value = positions.reduce((total, position) => (total += position.value), 0);
  const btcPrice = await getPrice(TOKENS.WBTC);
  const valueBtc = value / btcPrice.price;

  const valuePaid = 0;
  const valuePaidBtc = valuePaid / btcPrice.price;

  const marketCapToTreasuryRatio = 0;

  let tvlApr = 0;
  positions.forEach((p) => {
    if (p.apr > 0) {
      tvlApr += p.apr * p.value;
    }
  });

  const treasuryYieldApr = value === 0 ? 0 : tvlApr / value;

  const treasurySummary: CitadelTreasurySummary = {
    value,
    valueBtc,
    valuePaid,
    valuePaidBtc,
    marketCapToTreasuryRatio,
    treasuryYieldApr,
    positions,
  };

  console.log(treasurySummary);
}
