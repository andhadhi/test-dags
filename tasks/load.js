import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

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

async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

async function loadData() {
  console.log('=== LOAD TASK ===');
  await new Promise(resolve => setTimeout(resolve, 2000));

  const inputKey = 'runs/' + (process.env.DAG_RUN_ID || 'test') + '/transform.json';
  let inputData = { records: [] };

  try {
    const response = await s3Client.send(new GetObjectCommand({
      Bucket: BUCKET,
      Key: inputKey,
    }));
    const body = await streamToString(response.Body);
    inputData = JSON.parse(body);
    console.log('Loaded input from s3://' + BUCKET + '/' + inputKey);
  } catch (err) {
    console.error('S3 Read Error:', err.message);
  }

  const loadResult = {
    recordsLoaded: inputData.records.length,
    loadedAt: new Date().toISOString(),
    status: 'success',
    destination: 'warehouse',
  };

  const outputKey = 'runs/' + (process.env.DAG_RUN_ID || 'test') + '/load-result.json';
  
  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: outputKey,
      Body: JSON.stringify(loadResult, null, 2),
      ContentType: 'application/json',
    }));
    console.log('Result saved to s3://' + BUCKET + '/' + outputKey);
  } catch (err) {
    console.error('S3 Write Error:', err.message);
  }

  console.log('Loaded ' + loadResult.recordsLoaded + ' records');
  console.log('=== PIPELINE COMPLETE ===');
  return loadResult;
}

loadData().catch(err => {
  console.error('Load failed:', err);
  process.exit(1);
});
