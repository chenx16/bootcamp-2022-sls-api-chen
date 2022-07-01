const AWS = require("aws-sdk");
const s3 = new AWS.S3({ signatureVersion: "v4" });

exports.handler = async (event) => {
  //url
  //url lasting time
  const filename = event.queryStringParameters.filename;
  const TTL = 300; //5 minutes
  const s3Params = {
    Bucket: process.env.BUCKET_NAME, // in setEnvVars.sh
    Key: filename,
    Expires: TTL,
    ContentType: "application/pdf",
  };

  let uploadURL;
  try {
    uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);
    //make call to amz s3 sdk
    //return presign url as a promise
    //because promise, use await
  } catch (e) {
    console.log(e);
  }

  return {
    //return an object backthrough lambda and api gateway

    statusCode: 200,
    body: JSON.stringify({
      uploadURL: uploadURL,
      filename: filename,
      validFor: `${TTL} seconds`,
    }),
  };
};

exports.s3Handler = s3;
