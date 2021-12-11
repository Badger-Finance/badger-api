import { Service } from '@tsed/common';
import { BadRequest } from '@tsed/exceptions';
import { request } from '../etherscan/etherscan.utils';
import { apis } from './health.config';
import { HealthService } from './health.interface';
import { HealthSnapshot, Links, Result } from './health.types';
import { convertToSnapshot } from './health.utils';

@Service()
export class ApisHealthService implements HealthService {
  private endpoints: Links = {};

  public async getHealth(): Promise<HealthSnapshot> {
    const isValid = this.importConfig();
    if (isValid === true) {
      const results = await this.getResults();
      return convertToSnapshot('apis', results);
    } else {
      const error = new BadRequest('Invalid configuration');
      throw error;
    }
  }

  public importConfig(): boolean {
    this.endpoints = {};
    try {
      for (const api of apis) {
        this.endpoints[api.name] = api.url;
      }
      return true;
    } catch (e) {
      console.error(`Error intializing providers: ${e}`);
      return false;
    }
  }

  public async getResults(): Promise<Result[]> {
    const results: Result[] = [];
    for (const key in this.endpoints) {
      const result: Result = {
        isError: false,
        name: key,
        result: '',
      };
      const endpoint = this.endpoints[key];
      try {
        const { status } = await request(endpoint.toString());
        result.result = status.toString();
        results.push(result);
      } catch (e) {
        result.isError = true;
        result.error = `Unable to get results for ${endpoint}`;
        results.push(result);
      }
    }
    return results;
  }
}
