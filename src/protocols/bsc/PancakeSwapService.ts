import { Inject, Service } from "@tsed/di";
import { PriceService } from "../../prices/PricesService";

@Service()
export class PancakeSwapService {
  @Inject()
  priceService!: PriceService;

  
}
