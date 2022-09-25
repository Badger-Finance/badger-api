import { MerkleProof } from '@badger-dao/sdk';
import { BadRequest, NotFound } from '@tsed/exceptions';
import AWS from 'aws-sdk';
import { ethers } from 'ethers';

import { Chain } from '../chains/config/chain.config';
import { REWARD_DATA } from '../config/constants';
import { BoostData } from '../rewards/interfaces/boost-data.interface';
import {
  AirdropMerkleDistribution,
  RewardMerkleDistribution,
} from '../rewards/interfaces/merkle-distributor.interface';
import { Nullable } from '../utils/types.utils';

const s3 = new AWS.S3();

/**
 * Grab an object from s3.
 * e.g. s3://my-bucket/path/to/file.txt
 * bucket: my-bucket, key: path/to/file.txt
 * @param bucket Bucket containing object.
 * @param key Key path to object.
 */
async function getObject(bucket: string, key: string): Promise<AWS.S3.Body> {
  const s3Path = `s3://${bucket}/${key}`;
  try {
    const params = {
      Bucket: bucket,
      Key: key,
    };
    const object = await s3.getObject(params).promise();
    if (!object.Body) {
      throw new NotFound(`Object ${s3Path} does not exist`);
    }
    return object.Body;
  } catch {
    throw new BadRequest(`Unable to satisfy object request: ${s3Path}`);
  }
}

async function getFile<T>(key: string): Promise<Nullable<T>> {
  try {
    const requestedFile = await getObject(REWARD_DATA, key);
    return JSON.parse(requestedFile.toString('utf-8'));
  } catch {
    return null;
  }
}

/**
 * Returns user boost data file, if exists.
 * @param chain Network to acquire boost data for.
 * @returns Boost data file, if available.
 */
export async function getBoostFile(chain: Chain): Promise<Nullable<BoostData>> {
  return getFile(`badger-boosts-${chain.chainId}.json`);
}

/**
 * Returns chain distribution file, if exists.
 * @param chain Network to acquire distribution data for.
 * @returns Distribution file, if availble.
 */
export async function getTreeDistribution(chain: Chain): Promise<Nullable<RewardMerkleDistribution>> {
  return getFile(`badger-tree-${chain.chainId}.json`);
}

/**
 * Returns user chain specific claim proof, if exists.
 * @param chain Network to acquire claim data for.
 * @param address Requested claim proof address.
 * @returns User claim proof data for chain, if available.
 */
export async function getBouncerProof(chain: Chain, address: string): Promise<MerkleProof> {
  const bouncerFile = await getFile<AirdropMerkleDistribution>(`badger-bouncer-${chain.chainId}.json`);
  if (!bouncerFile) {
    return [];
  }
  const claim = bouncerFile.claims[ethers.utils.getAddress(address)];
  if (!claim) {
    return [];
  }
  return claim.proof;
}
