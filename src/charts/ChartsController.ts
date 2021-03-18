import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { SettSnapshot } from '../interface/SettSnapshot';
import { SettsService } from '../setts/SettsService';

@Controller('/charts')
export class ChartsController {
  @Inject()
  settsService!: SettsService;

  @Get()
  @ContentType('json')
  getChart(@QueryParams('settName') settName: string, @QueryParams('count') count?: number): Promise<SettSnapshot[]> {
    return this.settsService.getSettSnapshots(settName, count);
  }
}
