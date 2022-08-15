import { Description, Example, Property, Title } from "@tsed/schema";

import { TOKENS } from "../../config/tokens.config";
import { HarvestType } from "../enums/harvest.enum";
import { VaultHarvestsExtendedResp } from "./vault-harvest-extended-resp.interface";

export class VaultHarvestsModel implements VaultHarvestsExtendedResp {
  @Title("timestamp")
  @Description("time of harvest emitted")
  @Example(Date.now())
  @Property()
  public timestamp: number;

  @Title("block")
  @Description("number of proccessed block")
  @Example(344534534)
  @Property()
  public block: number;

  @Title("token")
  @Description("addr of harvested token")
  @Example(TOKENS.BADGER)
  @Property()
  public token: string;

  @Title("amount")
  @Description("amount of harvested token")
  @Example("15.3452")
  @Property()
  public amount: number;

  @Title("eventType")
  @Description("Harvest or TreeDistribution")
  @Example(HarvestType.TreeDistribution)
  @Property()
  public eventType: HarvestType;

  @Title("strategyBalance")
  @Description("balance of strategy on time of harvest")
  @Example(777)
  @Property()
  public strategyBalance?: number;

  @Title("estimatedApr")
  @Description("Apr for current event")
  @Example(40)
  @Property()
  public estimatedApr?: number;

  constructor({
    timestamp,
    block,
    token,
    amount,
    eventType,
    strategyBalance,
    estimatedApr
  }: VaultHarvestsExtendedResp) {
    this.timestamp = timestamp;
    this.block = block;
    this.token = token;
    this.amount = amount;
    this.eventType = eventType;
    this.strategyBalance = strategyBalance;
    this.estimatedApr = estimatedApr;
  }
}
