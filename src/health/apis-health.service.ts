import { Service } from '@tsed/common';
import { BadRequest } from '@tsed/exceptions';
import fetch from 'node-fetch';
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
      console.error(`Error intializing providers: ${e.toString()}`);
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
      try {
        const endpoint = this.endpoints[key];
        const res = await fetch(endpoint.toString());
        if (!res.ok) {
          result.isError = true;
          result.error = `Response had status code of ${res.status}`;
        }
        result.result = res.status.toString();
        results.push(result);
      } catch (e) {
        result.isError = true;
        result.error = e.toString();
        results.push(result);
      }
    }
    return results;
  }
}
