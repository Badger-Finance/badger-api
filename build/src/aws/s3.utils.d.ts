import AWS from 'aws-sdk';
/**
 * Grab an object from s3.
 * e.g. s3://my-bucket/path/to/file.txt
 * bucket: my-bucket, key: path/to/file.txt
 * @param bucket Bucket containing object.
 * @param key Key path to object.
 */
export declare const getObject: (bucket: string, key: string) => Promise<AWS.S3.Body>;
