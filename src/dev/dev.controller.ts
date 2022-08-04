import { Controller, Get, Inject, QueryParams, UseBefore } from '@tsed/common';
import { ContentType, Description, Hidden } from '@tsed/schema';

import DevelopmentFilter from '../common/filters/development-filter';
import { DevelopmentService } from './dev.service';

@Controller('/dev')
@UseBefore(DevelopmentFilter)
@Hidden()
export class DevelopmentController {
  @Inject()
  developmentService!: DevelopmentService;

  @Get('/test')
  @ContentType('json')
  @Description('Put any function that u want to test out')
  async test(@QueryParams('param') param: string): Promise<string> {
    return param;
  }

  @Get('/ddb/update/seeds')
  @ContentType('json')
  @Description('Update seed files for DynamoDb')
  async getAccount(): Promise<{ status: string }> {
    return this.developmentService.updateDynamoDbSeeds();
  }
}
