import AWS from 'aws-sdk';
import csv from 'csv-parser';

export const parse = async (event) => {
  console.log(event);

  const s3 = new AWS.S3();
  const sqs = new AWS.SQS();
  const record = event.Records[0];

  await new Promise((resolve, reject) => {
    const bucketName = process.env.BUCKET;
    const recordKey = record.s3.object.key;
    const stream = s3.getObject({
      Bucket: bucketName,
      Key: recordKey,
    }).createReadStream();

    stream
    .pipe(csv())
    .on('data', (data) => {
      console.log(data);

      sqs.sendMessage({
        QueueUrl: process.env.SQS_URL,
        MessageBody: JSON.stringify(data),
      }, (error) => {
        console.log('SQS send message error');
        console.log(error);
      });
    })
    .on('end', async () => {
      const paramsToCopy = {
        Bucket: bucketName,
        CopySource: bucketName + '/' + recordKey,
        Key: recordKey.replace('uploaded', 'parsed'),
      };
      const paramsToDelete = {
        Bucket: bucketName,
        Key: recordKey,
      };

      console.log(paramsToCopy);
      console.log(paramsToDelete);

      await s3.copyObject(paramsToCopy).promise();
      await s3.deleteObject(paramsToDelete).promise();

      resolve();
    })
    .on('error', (error) => {
      console.log(error);
      reject(error);
    });
  });
}
