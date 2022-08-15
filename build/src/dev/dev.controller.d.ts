import { DevelopmentService } from "./dev.service";
export declare class DevelopmentController {
  developmentService: DevelopmentService;
  test(param: string): Promise<string>;
  ddbUpdateSeeds(): Promise<{
    status: string;
  }>;
}
