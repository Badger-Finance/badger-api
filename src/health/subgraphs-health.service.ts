import { Service } from '@tsed/common';
import { BadRequest, InternalServerError } from '@tsed/exceptions';
import { GraphQLClient } from 'graphql-request';
import { subgraphs } from './health.config';
import { HealthService } from './health.interface';
import { HealthSnapshot, Subgraph, SubgraphResult } from './health.types';
import { convertToSnapshot } from './health.utils';

@Service()
export class SubgraphsHealthService implements HealthService {
  private subgraphsClients!: {
    [subgraph: string]: { client: GraphQLClient; subgraph: Subgraph };
  };
  public async getHealth(): Promise<HealthSnapshot> {
    const isValid = this.importConfig();
    if (isValid === true) {
      try {
        const results = await this.getResults();
        return convertToSnapshot('subgraphs', results);
      } catch (e) {
        const message = `Error running queries`;
        console.error(`${message}: ${e}`);
        const error = new InternalServerError(message);
        throw error;
      }
    } else {
      const error = new BadRequest('Invalid configuration');
      throw error;
    }
  }

  public importConfig(): boolean {
    try {
      this.subgraphsClients = {};
      for (const subgraph of subgraphs) {
        const client = this.generateClient(subgraph.url);
        this.subgraphsClients[subgraph.name] = { client: client, subgraph: subgraph };
      }
      return true;
    } catch (e) {
      console.error(`Failed to generate client: ${e}`);
      return false;
    }
  }

  public async getResults(): Promise<SubgraphResult[]> {
    const results: SubgraphResult[] = [];
    let error: unknown | undefined = undefined;
    let result: unknown | undefined = undefined;
    for (const subgraphName in this.subgraphsClients) {
      const subgraphClient = this.subgraphsClients[subgraphName];
      try {
        result = await subgraphClient.client.request(subgraphClient.subgraph.query);
      } catch (response) {
        error = response;
      }
      results.push({
        isError: error ? true : false,
        result: error ? error : result,
        subgraph: subgraphClient.subgraph,
      });
    }
    return results;
  }

  private generateClient(uri: URL): GraphQLClient {
    const client = new GraphQLClient(uri.toString());
    if (client === null || client === undefined) {
      const message = `Client for ${uri.toString()} is ${client}`;
      console.error(message);
      throw new InternalServerError(message);
    }
    return client;
  }
}
