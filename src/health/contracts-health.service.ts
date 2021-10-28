import { Network } from '@badger-dao/sdk';
import { Service } from '@tsed/common';
import { BadRequest, InternalServerError } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { Chain } from '../chains/config/chain.config';
import * as bscContracts from '../config/abi/health-bsc-abis';
import * as ethContracts from '../config/abi/health-eth-abis';
import { HealthService } from './health.interface';
import { ChainResult, Contract, ContractResult, ContractToAbis, HealthSnapshot, Result } from './health.types';
import { camelCaseToSentenceCase, convertToSnapshot } from './health.utils';

@Service()
export class ContractsHealthService implements HealthService {
  private contractToAbis: ContractToAbis = {};
  private chains: Network[] = [Network.BinanceSmartChain, Network.Ethereum];
  private gasLimit = 9000000;

  public async getHealth(): Promise<HealthSnapshot> {
    const isValid = this.importConfig();
    if (isValid === true) {
      try {
        const results = await this.getResults();
        return convertToSnapshot('contracts', results);
      } catch (e) {
        const message = 'Error calling view methods';
        console.error(`${message}: ${e.toString()}`);
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
      this.contractToAbis = {};
      let contracts = {};
      for (const chain of this.chains) {
        const chainString: string = chain.toString();
        this.contractToAbis[chainString] = [];
        switch (chain) {
          case Network.Ethereum: {
            contracts = ethContracts;
            break;
          }
          case Network.BinanceSmartChain: {
            contracts = bscContracts;
            break;
          }
        }
        for (const key of Object.keys(contracts)) {
          const untypedContract = (contracts as never)[key];
          const abiString = JSON.stringify(untypedContract['abi'] as Record<string, unknown>);
          const typedContract: Contract = {
            abi: JSON.parse(abiString),
            address: (untypedContract['contract'] as Record<string, unknown>).toString(),
            name: camelCaseToSentenceCase(key),
          };
          this.contractToAbis[chainString].push(typedContract);
        }
      }
    } catch (e) {
      console.error(`Failed to add abi: ${e.toString()}`);
      return false;
    }
    return true;
  }

  public async getResults(): Promise<ChainResult[]> {
    let contractResults: ContractResult[] = [];
    const results: ChainResult[] = [];
    for (const Network of this.chains) {
      const chain = Chain.getChain(Network);
      for (const contract of this.contractToAbis[Network.toString()]) {
        const result = await this.callViewMethods(contract, chain);
        contractResults.push(result);
      }
      const chainResult: ChainResult = { chain: chain.symbol, contractResults: contractResults };
      contractResults = [];
      results.push(chainResult);
    }
    return results;
  }

  private async callViewMethods(contract: Contract, chain: Chain): Promise<ContractResult> {
    const promises: Promise<unknown>[] = [];
    const ethersContract = new ethers.Contract(contract.address, contract.abi, chain.batchProvider);
    const viewMethods = contract.abi.filter(
      (contractFunction) => contractFunction.stateMutability === 'view' && contractFunction.inputs.length === 0,
    );
    const viewMethodResults: Result[] = [];
    for (const viewMethod of viewMethods) {
      promises.push(
        ethersContract[viewMethod.name]({ gasLimit: this.gasLimit })
          .then((result: unknown) => {
            const stringResult = !result ? '' : JSON.stringify(result);
            console.log(
              `Calling view method ${viewMethod.name} on contract ${contract.name} with address ${contract.address}`,
            );
            viewMethodResults.push({ isError: false, name: viewMethod.name, result: stringResult });
          })
          .catch((e: Error) => {
            console.error(
              `Error calling view method ${viewMethod.name} on contract ${contract.name} with address ${
                contract.address
              }:  ${e.toString()}`,
            );
            viewMethodResults.push({ error: e.toString(), isError: true, name: viewMethod.name, result: e.toString() });
          }),
      );
    }
    try {
      console.log(`Calling methods on contract ${contract.address}`);
      await Promise.all(promises);
    } catch (e) {
      console.error(`Error calling contract ${contract.address}: ${e.toString()}`);
      return {
        address: contract.address,
        error: {
          error: e.toString(),
          isError: true,
        },
        name: contract.name,
        viewMethodResults: viewMethodResults,
      };
    }
    return {
      address: contract.address,
      error: {
        isError: false,
      },
      name: contract.name,
      viewMethodResults: viewMethodResults,
    };
  }
}
