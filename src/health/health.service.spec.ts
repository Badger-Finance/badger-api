import { PlatformTest } from '@tsed/common';
import { ApisHealthService } from './apis-health.service';
import { ContractsHealthService } from './contracts-health.service';
import { HealthService } from './health.interface';
import { ProvidersHealthService } from './providers-health.service';
import { SubgraphsHealthService } from './subgraphs-health.service';

describe('HealthChartsService', () => {
  let healthServices:
    | {
        apis: HealthService;
        contracts: HealthService;
        providers: HealthService;
        subgraphs: HealthService;
      }
    | undefined = undefined;

  beforeAll(async () => {
    await PlatformTest.create();
    healthServices = {
      apis: PlatformTest.get<ApisHealthService>(ApisHealthService),
      contracts: PlatformTest.get<ContractsHealthService>(ContractsHealthService),
      providers: PlatformTest.get<ProvidersHealthService>(ProvidersHealthService),
      subgraphs: PlatformTest.get<SubgraphsHealthService>(SubgraphsHealthService),
    };
  });

  afterEach(PlatformTest.reset);

  describe('ApisHealthService.importConfig()', () => {
    it('returns true', async (done) => {
      const importSuccess = healthServices?.apis.importConfig();
      expect(importSuccess).toBeTruthy();
      done();
    });
  });
  describe('ContractsHealthService.importConfig()', () => {
    it('returns true', async (done) => {
      const importSuccess = healthServices?.contracts.importConfig();
      expect(importSuccess).toBeTruthy();
      done();
    });
  });
  describe('ProvidersHealthService.importConfig()', () => {
    it('returns true', async (done) => {
      const importSuccess = healthServices?.providers.importConfig();
      expect(importSuccess).toBeTruthy();
      done();
    });
  });
  describe('SubgraphsHealthService.importConfig()', () => {
    it('returns true', async (done) => {
      const importSuccess = healthServices?.subgraphs.importConfig();
      expect(importSuccess).toBeTruthy();
      done();
    });
  });
});
