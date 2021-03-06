import { Service } from '@tsed/common';
import { BadRequest } from '@tsed/exceptions';
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
	async getObject(bucket: string, key: string): Promise<AWS.S3.GetObjectOutput> {
		try {
			const params = {
				Bucket: bucket,
				Key: key,
			};
			const objectMetadata = await s3.headObject(params).promise();
			const cacheKey = objectMetadata.ETag ? objectMetadata.ETag : `s3://${bucket}/${key}`;
			console.log('Cache Key:', cacheKey);
			const cachedObject = s3Cache.get(cacheKey) as AWS.S3.GetObjectOutput;
			if (cachedObject) {
				console.log('Returned Cached Object');
				return cachedObject;
			}
			console.log('Returned Queried Object');
			const object = await s3.getObject(params).promise();
			s3Cache.set(cacheKey, object);
			return object;
		} catch (err) {
			// do not error deatils on exception
			console.error(err);
			throw new BadRequest('Unable to satisfy object request');
		}
	}
}
