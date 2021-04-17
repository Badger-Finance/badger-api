import { Service } from '@tsed/common';
import { BadRequest, NotFound } from '@tsed/exceptions';
import AWS from 'aws-sdk';
import NodeCache from 'node-cache';

const s3 = new AWS.S3();
const s3Cache = new NodeCache({ stdTTL: 300, checkperiod: 480 });

@Service()
export class S3Service {
  /**
   * Grab an object from s3.
   * e.g. s3://my-bucket/path/to/file.txt
   * bucket: my-bucket, key: path/to/file.txt
   * @param bucket Bucket containing object.
   * @param key Key path to object.
   */
  async getObject(bucket: string, key: string): Promise<AWS.S3.Body> {
    try {
      const params = {
        Bucket: bucket,
        Key: key,
      };
      const objectMetadata = await s3.headObject(params).promise();
      const cacheKey = objectMetadata.ETag ?? `s3://${bucket}/${key}`;
      const cachedObject = s3Cache.get(cacheKey) as AWS.S3.GetObjectOutput;
      if (cachedObject) {
        return cachedObject;
      }
      const object = await s3.getObject(params).promise();
      if (!object.Body) {
        throw new NotFound('Object does not exist');
      }
      s3Cache.set(cacheKey, object.Body);
      return object.Body;
    } catch (err) {
      throw new BadRequest('Unable to satisfy object request');
    }
  }
}
