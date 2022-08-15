"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObject = void 0;
const tslib_1 = require("tslib");
const exceptions_1 = require("@tsed/exceptions");
const aws_sdk_1 = tslib_1.__importDefault(require("aws-sdk"));
const node_cache_1 = tslib_1.__importDefault(require("node-cache"));
const s3 = new aws_sdk_1.default.S3();
const s3Cache = new node_cache_1.default({ stdTTL: 300, checkperiod: 480 });
/**
 * Grab an object from s3.
 * e.g. s3://my-bucket/path/to/file.txt
 * bucket: my-bucket, key: path/to/file.txt
 * @param bucket Bucket containing object.
 * @param key Key path to object.
 */
const getObject = async (bucket, key) => {
  var _a;
  const s3Path = `s3://${bucket}/${key}`;
  try {
    const params = {
      Bucket: bucket,
      Key: key
    };
    const objectMetadata = await s3.headObject(params).promise();
    const cacheKey = (_a = objectMetadata.ETag) !== null && _a !== void 0 ? _a : s3Path;
    const cachedObject = s3Cache.get(cacheKey);
    if (cachedObject) {
      return cachedObject;
    }
    const object = await s3.getObject(params).promise();
    if (!object.Body) {
      throw new exceptions_1.NotFound(`Object ${s3Path} does not exist`);
    }
    s3Cache.set(cacheKey, object.Body);
    return object.Body;
  } catch {
    throw new exceptions_1.BadRequest(`Unable to satisfy object request: ${s3Path}`);
  }
};
exports.getObject = getObject;
//# sourceMappingURL=s3.utils.js.map
