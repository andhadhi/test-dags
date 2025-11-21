# Andhadhi DAGs

This repository contains DAG task definitions and code for the Andhadhi scheduler.

## Setup

The SDK is bundled in the `lib/sdk` directory and installed via `package.json`.

### Install Dependencies

```bash
npm install
```

## DAG Files

### `my-first-dag.json`
A simple DAG that runs every 2 minutes demonstrating the SDK features:
- Task context access
- Environment variables
- Secret/Variable retrieval
- Automatic status management
- Result capture

**Task Code**: `src/main.js`

### `sdk-demo-dag.json`
An ETL pipeline DAG with 3 sequential tasks demonstrating:
- Task dependencies (`depends_on`)
- Data extraction → transformation → loading pattern
- Environment variables per task
- Kubernetes secrets reference
- Resource limits (CPU/memory)

**Task Code**: `tasks/extract.js`, `tasks/transform.js`, `tasks/load.js`

## Task Code

### `src/main.js`
Demonstrates:
- SDK initialization
- Accessing variables/secrets with `getVariable()` and `getSecretValue()`
- Using `ctx.run()` wrapper for automatic status management
- Returning structured data that gets stored in PostgreSQL

### `tasks/extract.js`
Simulates data extraction from an API:
- Reads `DATA_SOURCE` environment variable
- Uses SDK to get API credentials
- Returns extracted records

### `tasks/transform.js`
Simulates data transformation:
- **Fetches result from `extract-data` task** using `ctx.getTaskResult()`
- Processes data in configurable batches (`BATCH_SIZE`)
- Transforms records to uppercase and doubles values
- Returns transformed data

### `tasks/load.js`
Simulates loading data to a database:
- **Fetches result from `transform-data` task** using `ctx.getTaskResult()`
- Uses Kubernetes secrets for DB credentials (`DB_USER`, `DB_PASSWORD`)
- Reads `DB_HOST` from environment
- Returns load status

## SDK Features Used

### Basic Features
```javascript
const { AndhadhiContext } = require('@andhadhi/sdk');

const ctx = new AndhadhiContext();

const apiEndpoint = ctx.getVariable('API_ENDPOINT');
const apiKey = ctx.getSecretValue('API_KEY');

await ctx.run(async () => {
    return { processed: true, count: 100 };
});
```

### Fetching Task Results (XCom-like)
```javascript
const extractResult = await ctx.getTaskResult('extract-data');
console.log("Retrieved data:", extractResult);

const records = extractResult?.records || [];
const transformedRecords = records.map(r => ({
    ...r,
    name: r.name.toUpperCase()
}));
```

This allows tasks to access return values from previous tasks in the DAG, similar to Airflow's XCom pattern.

## Running Locally

```bash
npm test
```

Note: When running locally, you need to set the required environment variables:
- `ANDHADHI__SCHEDULER_URL`
- `ANDHADHI__TASK_RUN_ID`
- `ANDHADHI__DAG_ID`
- `ANDHADHI__RUN_ID`
- `ANDHADHI__DAG_NAME`
- `ANDHADHI__TASK_NAME`

## Container Execution

The DAG command installs dependencies and runs the task:

```bash
npm install && node src/main.js
```

This ensures the SDK and all dependencies are available in the container.
