import AWS from 'aws-sdk-mock';
import { products } from '../importProductsFile';
import { headers } from '../constants';

describe('importProductsFile', () => {
  const mockedUrl = 'some_url';

  beforeEach(() => {
    AWS.mock('S3', 'getSignedUrl', mockedUrl);
  });

  it('should return signed URL', async () => {
    const event = {
      queryStringParameters: {
        name: 'FileName',
      },
    };
    const result = await products(event);

    expect(result).toEqual({
      headers,
      statusCode: 200,
      body: mockedUrl,
    });
  });
});