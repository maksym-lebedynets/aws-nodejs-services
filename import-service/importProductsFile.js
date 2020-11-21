import AWS from 'aws-sdk';
import { headers } from './constants';

export const products = async event => {
  console.log(event);

  try {
    const { BUCKET: bucketName } = process.env;
    const { queryStringParameters } = event;
    const { name: fileName } = queryStringParameters;
    const s3 = new AWS.S3();
    const params = {
      Bucket: bucketName,
      Key: `uploaded/${fileName}`,
      Expires: 60,
      ContentType: 'text/csv',
    };
    const url = s3.getSignedUrl('putObject', params);

    return {
      statusCode: 200,
      headers,
      body: url,
    }
  } catch(error) {
    return {
      headers,
      statusCode: 500,
      body: error.toString(),
    };
  }
};
