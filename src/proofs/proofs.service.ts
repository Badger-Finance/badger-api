import { MerkleProof } from '@badger-dao/sdk';
import { Service } from '@tsed/common';
import { ethers } from 'ethers';

import { getObject } from '../aws/s3.utils';
import { Chain } from '../chains/config/chain.config';
import { REWARD_DATA } from '../config/constants';
import { NodataForAddrError } from '../errors/allocation/nodata.for.addr.error';
import { NodataForChainError } from '../errors/allocation/nodata.for.chain.error';
import { NotFoundError } from '../errors/allocation/not.found.error';
import { ApiErrorCode } from '../errors/enums/error.codes.enum';
import { AirdropMerkleDistribution } from '../rewards/interfaces/merkle-distributor.interface';
import { CitadelMerkleClaim, CitadelMerkleDistribution } from './interfaces/citadel-merkle-claim.interface';

@Service()
export class ProofsService {
  /**
   * Load user bouncer proof. These proofs are used for vault guest lists.
   * @param address User Ethereum address.
   */
  async getBouncerProof(chain: Chain, address: string): Promise<MerkleProof> {
    const fileName = `badger-bouncer-${parseInt(chain.chainId)}.json`;
    const bouncerFile = await getObject(REWARD_DATA, fileName);
    if (!bouncerFile) {
      throw new NodataForChainError(chain.name);
    }
    const fileContents: AirdropMerkleDistribution = JSON.parse(bouncerFile.toString('utf-8'));
    const claim = fileContents.claims[ethers.utils.getAddress(address)];
    if (!claim) {
      throw new NodataForAddrError(`${address}`);
    }
    return claim.proof;
  }

  /**
   * Load user citadel presale proof. These proofs are used for presale guest lists.
   * @param address User Ethereum address.
   */
  async getCitadelClaim(address: string): Promise<CitadelMerkleClaim> {
    const fileName = `badger-serfs.json`;
    const bouncerFile = await getObject(REWARD_DATA, fileName);
    if (!bouncerFile) {
      throw new NotFoundError(`Citadel does not have a bouncer list`, ApiErrorCode.NoDataInBouncerList);
    }
    const fileContents: CitadelMerkleDistribution = JSON.parse(bouncerFile.toString('utf-8'));
    const claim = fileContents.claims[ethers.utils.getAddress(address)];
    if (!claim) {
      throw new NodataForAddrError(`${address}`);
    }
    return claim;
  }
}
