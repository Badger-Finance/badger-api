import { Controller, Get, Inject } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { ApisHealthService } from './apis-health.service';
import { ContractsHealthService } from './contracts-health.service';
import { HealthService } from './health.interface';
import { HealthSnapshot } from './health.types';
import { ProvidersHealthService } from './providers-health.service';
import { SubgraphsHealthService } from './subgraphs-health.service';

@Controller('/health')
export class HealthController {
  @Inject()
  apisHealthService!: ApisHealthService;
  @Inject()
  contractsHealthService!: ContractsHealthService;
  @Inject()
  providersHealthService!: ProvidersHealthService;
  @Inject()
  subgraphsHealthService!: SubgraphsHealthService;

  @Get()
  @ContentType('json')
  async getAll(): Promise<HealthSnapshot[]> {
    const healthServices: HealthService[] = [
      this.apisHealthService,
      this.contractsHealthService,
      this.providersHealthService,
      this.subgraphsHealthService,
    ];
    return Promise.all(healthServices.map((service) => service.getHealth()));
  }

  @Get('/api')
  @ContentType('json')
  async getApis(): Promise<HealthSnapshot> {
    return await this.apisHealthService.getHealth();
  }

  @Get('/contract')
  @ContentType('json')
  async getContracts(): Promise<HealthSnapshot> {
    return await this.contractsHealthService.getHealth();
  }

  @Get('/provider')
  @ContentType('json')
  async getProviders(): Promise<HealthSnapshot> {
    return await this.providersHealthService.getHealth();
  }

  @Get('/subgraph')
  @ContentType('json')
  async getSubgraphs(): Promise<HealthSnapshot> {
    return await this.subgraphsHealthService.getHealth();
  }
}
