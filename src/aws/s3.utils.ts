import { BadRequest, NotFound } from '@tsed/exceptions';
import AWS from 'aws-sdk';

const s3 = new AWS.S3();

/**
 * Grab an object from s3.
 * e.g. s3://my-bucket/path/to/file.txt
 * bucket: my-bucket, key: path/to/file.txt
 * @param bucket Bucket containing object.
 * @param key Key path to object.
 */
export async function getObject(bucket: string, key: string): Promise<AWS.S3.Body> {
  const s3Path = `s3://${bucket}/${key}`;
  try {
    const params = {
      Bucket: bucket,
      Key: key
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
