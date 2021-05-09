import { Controller, Get, Inject, QueryParams } from "@tsed/common";
import { ContentType } from "@tsed/schema";
import { BoostsService } from "./boosts.service";

@Controller('/boosts')
export class BoostsController {
  @Inject()
  boostsService!: BoostsService;

  @ContentType('json')
  @Get('')
  async getLeaderBoard(@QueryParams('page') page?: number, @QueryParams('size') size?: number) {
    return this.boostsService.loadLeaderboardEntries(page, size);
  }
}