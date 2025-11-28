import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: process.env.AWS_ENDPOINT_URL || 'http://localstack:4566',
  region: process.env.AWS_DEFAULT_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
  },
  forcePathStyle: true,
});

const BUCKET = process.env.S3_BUCKET || 'dag-demo';

async function extractData() {
  console.log('=== EXTRACT TASK ===');
  await new Promise(resolve => setTimeout(resolve, 2000));

  const extractedData = {
    records: [
      { id: 1, name: 'Product A', price: 100, category: 'electronics' },
      { id: 2, name: 'Product B', price: 200, category: 'electronics' },
      { id: 3, name: 'Product C', price: 150, category: 'clothing' },
    ],
    metadata: {
      source: process.env.DATA_SOURCE || 'demo-source',
      extractedAt: new Date().toISOString(),
      totalRecords: 3,
    },
  };

  const outputKey = 'runs/' + (process.env.DAG_RUN_ID || 'test') + '/extract.json';
  
  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: outputKey,
      Body: JSON.stringify(extractedData, null, 2),
      ContentType: 'application/json',
    }));
    console.log('Output saved to s3://' + BUCKET + '/' + outputKey);
  } catch (err) {
    console.error('S3 Error:', err.message);
  }
  
  console.log('Extracted ' + extractedData.records.length + ' records');
  return extractedData;
}

extractData().catch(err => {
  console.error('Extraction failed:', err);
  process.exit(1);
});
