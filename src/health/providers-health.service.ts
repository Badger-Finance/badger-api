import { Service } from '@tsed/common';
import { BadRequest } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { providers } from './health.config';
import { HealthService } from './health.interface';
import { HealthSnapshot, Result } from './health.types';
import { convertToSnapshot } from './health.utils';

@Service()
export class ProvidersHealthService implements HealthService {
  private initializedProviders: { [name: string]: ethers.providers.JsonRpcProvider } = {};

  public async getHealth(): Promise<HealthSnapshot> {
    const isValid = this.importConfig();
    if (isValid === true) {
      const results = await this.getResults();
      return convertToSnapshot('providers', results);
    } else {
      const error = new BadRequest('Invalid configuration');
      throw error;
    }
  }

  public importConfig(): boolean {
    try {
      this.initializedProviders = {};
      for (let index = 0, length = providers.length; index < length; index++) {
        const provider = providers[index];
        this.initializedProviders[provider.name] = new ethers.providers.JsonRpcProvider(provider.url.toString());
      }
      return true;
    } catch (e) {
      console.error(`Error intializing providers: ${e.toString()}`);
      return false;
    }
  }

  public async getResults(): Promise<Result[]> {
    const providerResults: Result[] = [];
    for (const key in this.initializedProviders) {
      let blockNumber = -1;
      const result: Result = {
        isError: false,
        name: key,
        result: '',
      };
      try {
        blockNumber = await this.initializedProviders[key].getBlockNumber();
        result.isError = false;
        result.result = JSON.stringify(blockNumber);
        providerResults.push(result);
      } catch (e) {
        const message = `Error getting block number for provider ${key}: ${e.toString()}`;
        console.error(message);
        result.error = message;
        result.isError = true;
        result.result = JSON.stringify(blockNumber);
        providerResults.push(result);
      }
    }
    return providerResults;
  }
}
