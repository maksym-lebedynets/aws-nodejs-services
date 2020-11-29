import { createProducts } from '../helpers';
import { handler } from '../catalogBatchProcess';

jest.mock('../helpers', () => ({
  createProducts: jest.fn(),
}))
const mockPublish = jest.fn(() => ({
  promise: jest.fn(() => Promise.resolve()),
}));
jest.mock('aws-sdk', () => ({
  SNS: jest.fn(() => ({
    publish: mockPublish,
  })),
}));

describe('catalogBatchProcess', () => {
  const product = {
    title: 'some title',
    description: 'some description',
    price: 1000,
  };
  const event = {
    Records: [{
      body: JSON.stringify(product),
    }]
  };
  const SNS_ARN = 'some arn';
  let env;

  beforeEach(async () => {
    env = process.env.SNS_ARN;

    process.env.SNS_ARN = SNS_ARN

    mockPublish.mockClear();

    await handler(event);
  });

  afterAll(() => {
    process.env.SNS_ARN = env;
  });

  it('should create products from the SQS event', async () => {
    expect(createProducts).toBeCalledWith([product]);
  });

  it('should publish message to SNS after product creation', async () => {
    expect(mockPublish).toBeCalledTimes(1);
    expect(mockPublish).toBeCalledWith({
      Message: `${product.title} product is created`,
      TopicArn: SNS_ARN,
      MessageAttributes: {
        productType: {
          DataType: 'String',
          StringValue: product.description
        },
      },
    });
  });
});