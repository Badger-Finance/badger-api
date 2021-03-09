import { Service } from "@tsed/di";
import NodeCache from "node-cache";
import { MasterChefPool } from "../../interface/MasterChef";
import { Chain } from "../../util/constants";
import { getProvider } from "../../util/util";

@Service()
export class MasterChefService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 300, checkperiod: 480 });
  }

  async getPool(chain: Chain, chef: string, poolId: number): Promise<MasterChefPool> {
    const provider = getProvider(chain);
  }
}
