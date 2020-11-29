import AWS from 'aws-sdk';
import { createProducts } from './helpers';

export const handler = async (event) => {
  const sns = new AWS.SNS();

  try {
    const values = event.Records.map((record) => {
      return JSON.parse(record.body);
    });

    await createProducts(values);

    for (const item of values) {
      await sns.publish({
        Message: `${item.title} product is created`,
        TopicArn: process.env.SNS_ARN,
        MessageAttributes: {
          productType: {
            DataType: 'String',
            StringValue: item.description,
          },
        },
      }).promise();
    }

    console.log(event.Records.length + ' products are created');
  } catch (error) {
    console.log('Batch product creation failed');
    console.log(error);
  }
}