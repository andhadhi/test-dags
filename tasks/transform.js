const { AndhadhiContext } = require('@andhadhi/sdk');

async function transformData() {
    const ctx = new AndhadhiContext();

    console.log("Starting data transformation...");

    const batchSize = parseInt(process.env.BATCH_SIZE || "100");
    console.log(`Processing in batches of: ${batchSize}`);

    const extractResult = await ctx.getTaskResult('extract-data');
    console.log("Retrieved extract-data result:", extractResult);

    const result = await ctx.run(async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const inputRecords = extractResult?.records || [];
        const transformedRecords = inputRecords.map(record => ({
            id: record.id,
            name: record.name.toUpperCase(),
            value: record.value * 2,
            processed: true
        }));

        const transformedData = {
            records: transformedRecords,
            transformedAt: new Date().toISOString(),
            totalProcessed: transformedRecords.length,
            batchSize: batchSize,
            sourceExtraction: extractResult?.extractedAt
        };

        console.log(`Transformed ${transformedData.totalProcessed} records from extract-data`);

        return transformedData;
    });

    console.log("Transformation completed");
    return result;
}

transformData().catch(err => {
    console.error("Transformation failed:", err);
    process.exit(1);
});
