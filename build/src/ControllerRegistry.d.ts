import { AccountV3Controller } from "./accounts/account.v3.controller";
import { AccountsV2Controller } from "./accounts/accounts.v2.controller";
import { ChartsController } from "./charts/charts.controller";
import { DevelopmentController } from "./dev/dev.controller";
import { GasController } from "./gas/gas.controller";
import { LeaderBoardsController } from "./leaderboards/leaderboards.controller";
import { MetricsController } from "./metrics/metrics.controller";
import { PriceController } from "./prices/prices.controller";
import { ProofsV3Controller } from "./proofs/proof.v3.controller";
import { ProofsV2Controller } from "./proofs/proofs.v2.controller";
import { ProtocolController } from "./protocols/protocols.controller";
import { RewardV2Controller } from "./rewards/reward.v2.controller";
import { RewardsV2Controller } from "./rewards/rewards.v2.controller";
import { RewardsV3Controller } from "./rewards/rewards.v3.controller";
import { TokensController } from "./tokens/tokens.controller";
import { VaultsV2Controller } from "./vaults/vaults.v2.controller";
import { VaultsV3Controller } from "./vaults/vaults.v3.controller";
/**
 * Controller registry forces serverless offline to load
 * the appropriate controller routes on start. Default
 * lazy loading makes dealing with local development a pain
 * without this.
 */
export declare const V2_CONTROLLERS: (
  | typeof AccountsV2Controller
  | typeof ChartsController
  | typeof GasController
  | typeof LeaderBoardsController
  | typeof MetricsController
  | typeof PriceController
  | typeof ProofsV2Controller
  | typeof ProtocolController
  | typeof RewardV2Controller
  | typeof RewardsV2Controller
  | typeof TokensController
  | typeof VaultsV2Controller
)[];
export declare const V3_CONTROLLERS: (
  | typeof AccountV3Controller
  | typeof ChartsController
  | typeof DevelopmentController
  | typeof GasController
  | typeof LeaderBoardsController
  | typeof MetricsController
  | typeof PriceController
  | typeof ProofsV3Controller
  | typeof RewardsV3Controller
  | typeof TokensController
  | typeof VaultsV3Controller
)[];
